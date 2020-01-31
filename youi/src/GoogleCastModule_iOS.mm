#ifdef YI_IOS

#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

#include "apple/FollyUtils.h"

#import <GoogleCast/GoogleCast.h>

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(GoogleCastModule, EventEmitterModule);

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
            double approximateStreamPosition = [remoteMediaClient approximateStreamPosition];

            EmitEvent("update", folly::dynamic::object("elapsed", approximateStreamPosition));
        }
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, connect)(std::string uniqueId)
{
    NSString *deviceID = [NSString stringWithCString:uniqueId.c_str()
                                            encoding:[NSString defaultCStringEncoding]];

    GCKDiscoveryManager *discoveryManager = [GCKCastContext sharedInstance].discoveryManager;
    GCKDevice *device = [discoveryManager deviceWithUniqueID:deviceID];

    if (device == nil)
    {
        YI_LOGE(LOG_TAG, "GoogleCast could not connect to device!");
    }
    else
    {
        GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;

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

    m_timer.Start();
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

    m_timer.Stop();
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
