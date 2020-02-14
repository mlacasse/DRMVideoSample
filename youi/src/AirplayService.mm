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
        pAppLifeCycleBridge->ForegroundEntered.Connect(*this, &AirplayService::StartObserving);
        pAppLifeCycleBridge->BackgroundEntered.Connect(*this, &AirplayService::StopObserving);
    }
}

AirplayService::~AirplayService()
{
    CYIAppLifeCycleBridge *pAppLifeCycleBridge = CYIAppLifeCycleBridgeLocator::GetAppLifeCycleBridge();
    if (pAppLifeCycleBridge)
    {
        pAppLifeCycleBridge->ForegroundEntered.Disconnect(*this, &AirplayService::StartObserving);
        pAppLifeCycleBridge->BackgroundEntered.Disconnect(*this, &AirplayService::StopObserving);
    }
}

void AirplayService::ShowAirplayDeviceOptions()
{
    float reciprocalScale = 1.0f / [UIScreen mainScreen].scale;
    CGRect airplayButtonFrame = CGRectMake(0, 0, 100 * reciprocalScale, 100 * reciprocalScale);
    
    AppDelegate *delegate = static_cast<AppDelegate *>([[UIApplication sharedApplication] delegate]);
    [delegate showAirplayDeviceOptions:airplayButtonFrame];
}

void AirplayService::StopObserving()
{
    if ([[AirplayDetector getSharedAirplayDetector] isAirplayObserverActive])
    {
        m_bIsAirplayObserverForegroundRestartRequired = true;
        [[AirplayDetector getSharedAirplayDetector] stopAirplayObserver];
    }
}

void AirplayService::StartObserving()
{
    if (m_bIsAirplayObserverForegroundRestartRequired)
    {
        m_bIsAirplayObserverForegroundRestartRequired = false;
        [[AirplayDetector getSharedAirplayDetector] startAirplayObserver];
    }
}

#endif // YI_IOS
