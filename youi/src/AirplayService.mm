#ifdef YI_IOS

#include "AirplayService.h"
#include "AppDelegate.h"

#include <glm/glm.hpp>

#import "AirplayDetector.h"

#define TAG "AirplayService"

static std::mutex s_AirplayServiceClientMutex;

AirplayService &AirplayService::GetInstance()
{
    static AirplayService s_pAirplayService;
    return s_pAirplayService;
}

AirplayService::AirplayService() :
    m_connectedDeviceName("Unknown"),
    m_bIsAirplaying(false),
    m_bIsMonitoringAirplayStatus(false),
    m_bIsAirplayObserverForegroundRestartRequired(false)
{}

AirplayService::~AirplayService() = default;

void AirplayService::StartAirplayObserver()
{
    if (!m_bIsMonitoringAirplayStatus)
    {
        std::lock_guard<std::mutex> lockGuard(s_AirplayServiceClientMutex);
        if(!m_bIsMonitoringAirplayStatus)
        {
            m_bIsMonitoringAirplayStatus = true;
            [[AirplayDetector getSharedAirplayDetector] startAirplayObserver];
        }
    }
}

void AirplayService::StopAirplayObserver()
{
    if (m_bIsMonitoringAirplayStatus)
    {
        std::lock_guard<std::mutex> lockGuard(s_AirplayServiceClientMutex);
        if (m_bIsMonitoringAirplayStatus)
        {
            m_bIsMonitoringAirplayStatus = false;
            [[AirplayDetector getSharedAirplayDetector] stopAirplayObserver];
        }
    }
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

bool AirplayService::ValidateIsAirplaying()
{
    // Same iOS 9 and 9.0.2 reasoning as above
    // Force to query IsAirplayConnected() as long as we query the airplay status
    m_bIsAirplaying = ValidateIsAirplayConnected();
    return  m_bIsAirplaying;
}

bool AirplayService::ValidateIsAirplayAvailable()
{
    // It has been observed on iOS 9 and 9.0.2 that we have to force query IsAirplayConnected() in order
    // to get a correct value of the airplay device availability
    // We need to do this as long as we need to query the airplay status
    ValidateIsAirplayConnected();
    return [[AirplayDetector getSharedAirplayDetector] isAirplayAvailable];
}

bool AirplayService::ValidateIsAirplayConnected()
{
    m_bIsAirplaying = [[AirplayDetector getSharedAirplayDetector] isAirplayConnected];
    return m_bIsAirplaying;
}

bool AirplayService::IsAirplayMonitoringActive() const
{
    return m_bIsMonitoringAirplayStatus;
}

void AirplayService::OnBackgroundEntered()
{
    if ([[AirplayDetector getSharedAirplayDetector] isAirplayObserverActive])
    {
        m_bIsAirplayObserverForegroundRestartRequired = true;
        [[AirplayDetector getSharedAirplayDetector] stopAirplayObserver];
    }
}

void AirplayService::OnForegroundEntered()
{
    if (m_bIsAirplayObserverForegroundRestartRequired)
    {
        m_bIsAirplayObserverForegroundRestartRequired = false;
        [[AirplayDetector getSharedAirplayDetector] startAirplayObserver];
    }
}

#endif // YI_IOS
