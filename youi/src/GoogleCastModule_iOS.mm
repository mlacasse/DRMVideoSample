#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

#ifdef YI_IOS

#include "apple/FollyUtils.h"

#import <GoogleCast/GoogleCast.h>

using namespace yi::react;

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
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            GCKMediaStatus * mediaStatus = [remoteMediaClient mediaStatus];
            if (mediaStatus != nil)
            {
                folly::dynamic status = folly::dynamic::object;

                status["duration"] = ToDynamic([[mediaStatus mediaInformation] streamDuration]);
                status["elapsed"] = ToDynamic([mediaStatus streamPosition]);

                GCKMediaPlayerState playerState = [mediaStatus playerState];

                switch (playerState) {
                    case GCKMediaPlayerStatePlaying:
                        status["state"] = ToDynamic("playing");
                        status["connected"] = ToDynamic(true);

                        break;
                    case GCKMediaPlayerStateIdle:
                        status["state"] = ToDynamic("idle");
                        status["connected"] = ToDynamic(false);

                        switch([mediaStatus idleReason]) {
                            case GCKMediaPlayerIdleReasonNone:
                                status["reason"] = ToDynamic("no reason");
                                break;
                            case GCKMediaPlayerIdleReasonFinished:
                                status["reason"] = ToDynamic("playback has finished");
                                break;
                            case GCKMediaPlayerIdleReasonCancelled:
                                status["reason"] = ToDynamic("playback was cancelled");
                                break;
                            case GCKMediaPlayerIdleReasonInterrupted:
                                status["reason"] = ToDynamic("playback was interrupted");
                                break;
                            case GCKMediaPlayerIdleReasonError:
                                status["reason"] = ToDynamic("playback error has occurred");
                                break;
                        };

                        break;
                    case GCKMediaPlayerStatePaused:
                        status["state"] = ToDynamic("paused");
                        status["connected"] = ToDynamic(true);

                        break;
                    case GCKMediaPlayerStateLoading:
                        status["state"] = ToDynamic("loading");
                        status["connected"] = ToDynamic(true);

                        break;
                    case GCKMediaPlayerStateBuffering:
                        status["state"] = ToDynamic("buffering");
                        status["connected"] = ToDynamic(true);

                        break;
                    default:
                        status["state"] = ToDynamic("unknown");
                        status["connected"] = ToDynamic(false);

                        break;
                }

                EmitEvent("update", folly::dynamic::object("status", status));
            }
        }
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

        BOOL bSuccess = [sessionManager startSessionWithDevice:device];
        if (!bSuccess)
        {
            YI_LOGE(LOG_TAG, "GoogleCast could not connect to device!");
        }
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, disconnect)()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    
    if (sessionManager.currentSession != nil)
    {
        [sessionManager endSessionAndStopCasting:YES];
    }
    
    m_timer.Stop();
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, prepare)
(Callback successCallback, Callback failedCallback, folly::dynamic source, folly::dynamic details)
{
    m_timer.Stop();

    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            id streamDictionary = convertFollyDynamic(source);
            id metadataDictionary = convertFollyDynamic(details);

            GCKMediaMetadata *metadata = [[GCKMediaMetadata alloc]
                                            initWithMetadataType:GCKMediaMetadataTypeMovie];
            [metadata setString: metadataDictionary[@"title"] forKey:kGCKMetadataKeyTitle];
            [metadata setString: metadataDictionary[@"description"] forKey:kGCKMetadataKeySubtitle];
            [metadata addImage:[[GCKImage alloc]
                                initWithURL:[[NSURL alloc] initWithString: metadataDictionary[@"image"]]
                                width: [metadataDictionary[@"width"] integerValue]
                                height: [metadataDictionary[@"height"] integerValue]]];

            GCKMediaInformationBuilder *mediaInfoBuilder =
              [[GCKMediaInformationBuilder alloc] initWithContentURL:
               [NSURL URLWithString:streamDictionary[@"uri"]]];

            mediaInfoBuilder.streamType = GCKMediaStreamTypeNone;
            mediaInfoBuilder.contentType = streamDictionary[@"type"];
            mediaInfoBuilder.metadata = metadata;

            GCKMediaInformation *mediaInformation = [mediaInfoBuilder build];

            GCKRequest *request = [remoteMediaClient loadMedia:mediaInformation autoplay:YES];
            if (request != nil)
            {
                m_timer.Start();

                successCallback({});
            }
            else
            {
                YI_LOGE(LOG_TAG, "GoogleCast request for media failed!");

                failedCallback({});
            }
        }
        else
        {
            YI_LOGE(LOG_TAG, "GoogleCast no remote media client!");

            failedCallback({});
        }
    }
    else
    {
        YI_LOGE(LOG_TAG, "GoogleCast no session!");

        failedCallback({});
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
