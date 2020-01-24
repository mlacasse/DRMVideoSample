#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

#define INTERVAL 1000

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

    m_timer.SetInterval(INTERVAL);
}

GoogleCastModule::~GoogleCastModule()
{}

void GoogleCastModule::StartObserving()
{}

void GoogleCastModule::StopObserving()
{}

void GoogleCastModule::OnTimeout()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    
    if (sessionManager.currentSession != nil)
    {
        double approximateStreamPosition = [sessionManager.currentSession.remoteMediaClient approximateStreamPosition];

        EmitEvent("change", folly::dynamic::object("position", approximateStreamPosition));
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
        YI_LOGD(LOG_TAG, "GoogleCast could not connect to %s!", uniqueId.c_str());
    }
    else
    {
        GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;

        BOOL bSuccess = [sessionManager startSessionWithDevice:device];
        if (bSuccess)
        {
            YI_LOGD(LOG_TAG, "GoogleCast connected to %s", uniqueId.c_str());
        }
        else
        {
            YI_LOGE(LOG_TAG, "GoogleCast could not connect to %s!", uniqueId.c_str());
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

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, prepare)(folly::dynamic source, folly::dynamic details)
{
    id streamDictionary = convertFollyDynamic(source);
    id metadataDictionary = convertFollyDynamic(details);

    GCKMediaMetadata *metadata = [[GCKMediaMetadata alloc]
                                    initWithMetadataType:GCKMediaMetadataTypeMovie];
    [metadata setString: metadataDictionary[@"title"] forKey:kGCKMetadataKeyTitle];
    [metadata setString: metadataDictionary[@"description"] forKey:kGCKMetadataKeySubtitle];
    [metadata addImage:[[GCKImage alloc]
                        initWithURL:[[NSURL alloc] initWithString: metadataDictionary[@"image"]]
                        width:640
                        height:360]];

    GCKMediaInformationBuilder *mediaInfoBuilder =
      [[GCKMediaInformationBuilder alloc] initWithContentURL:
       [NSURL URLWithString:streamDictionary[@"uri"]]];

    mediaInfoBuilder.streamType = GCKMediaStreamTypeNone;
    mediaInfoBuilder.contentType = streamDictionary[@"type"];
    mediaInfoBuilder.metadata = metadata;

    GCKMediaInformation *mediaInformation = [mediaInfoBuilder build];

    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    if (sessionManager.currentSession != nil)
    {
        GCKRemoteMediaClient *remoteMediaClient = sessionManager.currentSession.remoteMediaClient;
        if (remoteMediaClient != nil)
        {
            GCKRequest *request = [remoteMediaClient loadMedia:mediaInformation];
            if (request == nil)
            {
                YI_LOGE(LOG_TAG, "GoogleCast request failed!");
            }
        }
        else
        {
            YI_LOGE(LOG_TAG, "No remote media client!");
        }
    }
    else
    {
        YI_LOGE(LOG_TAG, "No session!");
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
