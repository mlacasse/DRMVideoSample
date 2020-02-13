#ifdef YI_IOS

#include "AirplayService.h"
#include "AppDelegate.h"

#include <glm/glm.hpp>
#include <platform/YiAppLifeCycleBridgeLocator.h>

#import "AirplayDetector.h"

#define TAG "AirplayService"

static std::mutex s_AirplayServiceClientMutex;

AirplayService &AirplayService::GetInstance()
{
    static AirplayService s_pAirplayService;
    return s_pAirplayService;
}

AirplayService::AirplayService() :
    m_bIsAirplayObserverForegroundRestartRequired(true)
{
    // This is not for general usage across the app but this is the first responder
    // to perform getting ready to stable state of application.
    // Use PlatformEventBridge::BackgroundEntered and PlatformEventBridge::ForegroundEntered signal instead.
    CYIAppLifeCycleBridge *pAppLifeCycleBridge = CYIAppLifeCycleBridgeLocator::GetAppLifeCycleBridge();
    if (pAppLifeCycleBridge)
    {
        pAppLifeCycleBridge->ForegroundEntered.Connect(*this, &AirplayService::StartObserver);
        pAppLifeCycleBridge->BackgroundEntered.Connect(*this, &AirplayService::StopObserver);
    }

    StartObserver();
}

AirplayService::~AirplayService()
{
    CYIAppLifeCycleBridge *pAppLifeCycleBridge = CYIAppLifeCycleBridgeLocator::GetAppLifeCycleBridge();
    if (pAppLifeCycleBridge)
    {
        pAppLifeCycleBridge->ForegroundEntered.Disconnect(*this, &AirplayService::StartObserver);
        pAppLifeCycleBridge->BackgroundEntered.Disconnect(*this, &AirplayService::StopObserver);
    }

    StopObserver();
}

void AirplayService::ShowAirplayDeviceOptions(const YI_FLOAT_RECT &rAirplayButtonFrame)
{
    float reciprocalScale = 1.0f / [UIScreen mainScreen].scale;
    CGRect airplayButtonFrame = CGRectMake(rAirplayButtonFrame.left * reciprocalScale,
                                           rAirplayButtonFrame.top * reciprocalScale,
                                           glm::abs(rAirplayButtonFrame.right - rAirplayButtonFrame.left) * reciprocalScale,
                                           glm::abs(rAirplayButtonFrame.bottom - rAirplayButtonFrame.top) * reciprocalScale);
    
    AppDelegate *delegate = static_cast<AppDelegate *>([[UIApplication sharedApplication] delegate]);
    [delegate showAirplayDeviceOptions:airplayButtonFrame];
}

bool AirplayService::IsAirplayAvailable()
{
    // It has been observed on iOS 9 and 9.0.2 that we have to force query IsAirplayConnected() in order
    // to get a correct value of the airplay device availability
    // We need to do this as long as we need to query the airplay status
    IsAirplayConnected();
    return [[AirplayDetector getSharedAirplayDetector] isAirplayAvailable];
}

bool AirplayService::IsAirplayConnected()
{
    return [[AirplayDetector getSharedAirplayDetector] isAirplayConnected];
}

void AirplayService::StopObserver()
{
    if ([[AirplayDetector getSharedAirplayDetector] isAirplayObserverActive])
    {
        m_bIsAirplayObserverForegroundRestartRequired = true;
        [[AirplayDetector getSharedAirplayDetector] stopAirplayObserver];
    }
}

void AirplayService::StartObserver()
{
    if (m_bIsAirplayObserverForegroundRestartRequired)
    {
        m_bIsAirplayObserverForegroundRestartRequired = false;
        [[AirplayDetector getSharedAirplayDetector] startAirplayObserver];
    }
}

#endif // YI_IOS
