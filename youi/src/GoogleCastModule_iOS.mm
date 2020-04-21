#ifdef YI_IOS

#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

#import <GoogleCast/GoogleCast.h>

using namespace yi::react;

namespace {
// From https://github.com/facebook/react-native/blob/master/React/CxxUtils/RCTFollyConvert.mm
id convertFollyDynamic(const folly::dynamic &dyn) {
    switch (dyn.type()) {
        case folly::dynamic::NULLT:
            return (id)kCFNull;
        case folly::dynamic::BOOL:
            return dyn.asBool() ? @YES : @NO;
        case folly::dynamic::INT64:
            return @(dyn.asInt());
        case folly::dynamic::DOUBLE:
            return @(dyn.asDouble());
        case folly::dynamic::STRING:
            return [[NSString alloc] initWithBytes:dyn.c_str() length:dyn.size()
                                          encoding:NSUTF8StringEncoding];
        case folly::dynamic::ARRAY: {
            NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:dyn.size()];
            for (auto &elem : dyn) {
                [array addObject:convertFollyDynamic(elem)];
            }
            return array[0];
        }
        case folly::dynamic::OBJECT: {
            NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:dyn.size()];
            for (auto &elem : dyn.items()) {
                dict[convertFollyDynamic(elem.first)] = convertFollyDynamic(elem.second);
            }
            return dict;
        }
    }
}
} // namespace

GoogleCastModule::GoogleCastModule()
{
    SetSupportedEvents({ "update" });

    GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc]
                                      initWithApplicationID:kGCKDefaultMediaReceiverApplicationID];

    GCKCastOptions *options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
    [GCKCastContext setSharedInstanceWithOptions:options];
        
    m_timer.TimedOut.Connect(*this, &GoogleCastModule::OnTimeout, EYIConnectionType::Async);
    m_timer.SetSingleShot(false);
    m_timer.SetInterval(1000);
    m_timer.Start();
}

GoogleCastModule::~GoogleCastModule()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager != nil)
    {
        [sessionManager endSessionAndStopCasting:YES];
    }

    m_timer.Stop();
    m_timer.TimedOut.Disconnect(*this);
}

void GoogleCastModule::OnTimeout()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        folly::dynamic mediaState = folly::dynamic::object;
        folly::dynamic connectionState = folly::dynamic::object;

        switch([sessionManager.currentSession connectionState])
        {
            case GCKConnectionStateConnected:
                connectionState["state"] = ToDynamic("connected");
                break;
            case GCKConnectionStateDisconnected:
            case GCKConnectionStateDisconnecting:
            case GCKConnectionStateConnecting:
            default:
                connectionState["state"] = ToDynamic("disconnected");
                break;
        }

        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            GCKMediaStatus * mediaStatus = [remoteMediaClient mediaStatus];
            if (mediaStatus != nil)
            {
                mediaState["duration"] = ToDynamic([[mediaStatus mediaInformation] streamDuration]);
                mediaState["elapsed"] = ToDynamic([mediaStatus streamPosition]);

                GCKMediaPlayerState playerState = [mediaStatus playerState];

                switch (playerState)
                {
                    case GCKMediaPlayerStatePlaying:
                        mediaState["state"] = ToDynamic("playing");

                        break;
                    case GCKMediaPlayerStateIdle:
                        mediaState["state"] = ToDynamic("idle");

                        switch([mediaStatus idleReason]) {
                            case GCKMediaPlayerIdleReasonNone:
                                mediaState["reason"] = ToDynamic("no reason");
                                break;
                            case GCKMediaPlayerIdleReasonFinished:
                                mediaState["reason"] = ToDynamic("playback has finished");
                                break;
                            case GCKMediaPlayerIdleReasonCancelled:
                                mediaState["reason"] = ToDynamic("playback was cancelled");
                                break;
                            case GCKMediaPlayerIdleReasonInterrupted:
                                mediaState["reason"] = ToDynamic("playback was interrupted");
                                break;
                            case GCKMediaPlayerIdleReasonError:
                                mediaState["reason"] = ToDynamic("playback error has occurred");
                                break;
                        };

                        break;
                    case GCKMediaPlayerStatePaused:
                        mediaState["state"] = ToDynamic("paused");
                        break;
                    case GCKMediaPlayerStateLoading:
                        mediaState["state"] = ToDynamic("loading");
                        break;
                    case GCKMediaPlayerStateBuffering:
                        mediaState["state"] = ToDynamic("buffering");
                        break;
                    default:
                        mediaState["state"] = ToDynamic("unknown");
                        break;
                }
            }
        }

        folly::dynamic state = folly::dynamic::object;

        state["media"] = ToDynamic(mediaState);
        state["connection"] = ToDynamic(connectionState);

        EmitEvent("update", ToDynamic(state));
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, connect)(std::string uniqueId)
{
    NSString *deviceID = [NSString stringWithCString:uniqueId.c_str()
                                            encoding:[NSString defaultCStringEncoding]];

    GCKDiscoveryManager *discoveryManager = [GCKCastContext sharedInstance].discoveryManager;
    GCKDevice *device = [discoveryManager deviceWithUniqueID:deviceID];

    if (device != nil)
    {
        GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;

        [sessionManager endSessionAndStopCasting:YES];
        [sessionManager startSessionWithDevice:device];
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, disconnect)()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    
    if (sessionManager.currentSession != nil)
    {
        [sessionManager endSessionAndStopCasting:YES];
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, prepare)(Callback successCallback, Callback failedCallback, folly::dynamic source)
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            id sourceDictionary = convertFollyDynamic(source);
            
            GCKMediaMetadata *metadata = [[GCKMediaMetadata alloc]
                                            initWithMetadataType:GCKMediaMetadataTypeMovie];

            [metadata setString: sourceDictionary[@"cast"][@"title"] forKey:kGCKMetadataKeyTitle];
            [metadata setString: sourceDictionary[@"cast"][@"description"] forKey:kGCKMetadataKeySubtitle];
            [metadata addImage:[[GCKImage alloc]
                                initWithURL:[[NSURL alloc] initWithString: sourceDictionary[@"cast"][@"image"][@"uri"]]
                                width: [sourceDictionary[@"cast"][@"image"][@"width"] integerValue]
                                height: [sourceDictionary[@"cast"][@"image"][@"height"] integerValue]]];

            GCKMediaInformationBuilder *mediaInfoBuilder =
              [[GCKMediaInformationBuilder alloc] initWithContentURL: [NSURL URLWithString: sourceDictionary[@"uri"]]];

            mediaInfoBuilder.streamType = GCKMediaStreamTypeNone;
            mediaInfoBuilder.contentType = [sourceDictionary[@"type"] isEqual: @"HLS"] ? @"application/x-mpegURL" : @"application/dash+xml";
            mediaInfoBuilder.metadata = metadata;

            GCKMediaInformation *mediaInformation = [mediaInfoBuilder build];

            GCKRequest *request = [remoteMediaClient loadMedia:mediaInformation autoplay:YES];
            if (request != nil)
            {
                successCallback({});
            }
            else
            {
                failedCallback({ ToDynamic("GoogleCast request for media failed!") });
            }
        }
        else
        {
            failedCallback({ ToDynamic("GoogleCast no remote media client!") });
        }
    }
    else
    {
        failedCallback({ ToDynamic("GoogleCast no session!") });
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, play)()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            [remoteMediaClient play];
        }
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, pause)()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            [remoteMediaClient pause];
        }
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, getAvailableDevices)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic availableDevices = folly::dynamic::object;

    GCKDiscoveryManager *discoveryManager = [GCKCastContext sharedInstance].discoveryManager;

    for (NSUInteger i = 0; i < discoveryManager.deviceCount; i++)
    {
        folly::dynamic availableDevice = folly::dynamic::object;

        GCKDevice *device = [discoveryManager deviceAtIndex:i];

        availableDevice["deviceID"] = ToDynamic([device.deviceID UTF8String]);
        availableDevice["uniqueId"] = ToDynamic([device.uniqueID UTF8String]);
        availableDevice["friendlyName"] = ToDynamic([device.friendlyName UTF8String]);

        availableDevices[CYIString::FromValue(i).GetData()] = ToDynamic(availableDevice);
    }   

    successCallback({ ToDynamic(availableDevices) });
}

#endif
