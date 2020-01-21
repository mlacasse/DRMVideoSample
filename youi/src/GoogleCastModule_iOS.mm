#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

#ifdef YI_IOS

#import <GoogleCast/GoogleCast.h>

using namespace yi::react;

GoogleCastModule::GoogleCastModule()
{
    GCKDiscoveryCriteria *criteria = [[GCKDiscoveryCriteria alloc]
                                      initWithApplicationID:kGCKDefaultMediaReceiverApplicationID];

    GCKCastOptions *options = [[GCKCastOptions alloc] initWithDiscoveryCriteria:criteria];
    [GCKCastContext setSharedInstanceWithOptions:options];
}

GoogleCastModule::~GoogleCastModule()
{}

void GoogleCastModule::StartObserving()
{}

void GoogleCastModule::StopObserving()
{}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, connect)(std::string uniqueId)
{
    NSString *deviceID = [NSString stringWithCString:uniqueId.c_str()
                                            encoding:[NSString defaultCStringEncoding]];

    GCKDiscoveryManager *discoveryManager = [GCKCastContext sharedInstance].discoveryManager;
    GCKDevice *device = [discoveryManager deviceWithUniqueID:deviceID];

    if (device == nil)
    {
        YI_LOGD(LOG_TAG, "GoogleCastModule could not connect to %s!", uniqueId.c_str());
    }
    else
    {
        GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;

        BOOL bSuccess = [sessionManager startSessionWithDevice:device];
        if (bSuccess)
        {
            YI_LOGD(LOG_TAG, "GoogleCastModule connected to %s", uniqueId.c_str());
        }
        else
        {
            YI_LOGD(LOG_TAG, "GoogleCastModule could not connect to %s!", uniqueId.c_str());
        }
    }
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, disconnect)()
{
    GCKSessionManager *sessionManager = [GCKCastContext sharedInstance].sessionManager;
    
    if (sessionManager.currentSession != nil)
    {
        [sessionManager endSessionAndStopCasting:NO];
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
