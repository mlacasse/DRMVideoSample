#ifndef AirplayService_h
#define AirplayService_h

#include <signal/YiSignal.h>
#include <signal/YiSignalHandler.h>

class AirplayService : public CYISignalHandler
{
public:

    static AirplayService &GetInstance();
    ~AirplayService();

    void StartAirplayObserver();
    void StopAirplayObserver();

    void ShowAirplayDeviceOptions(const YI_FLOAT_RECT &rAirplayButtonFrame);

    bool ValidateIsAirplaying();
    bool ValidateIsAirplayAvailable();
    bool ValidateIsAirplayConnected();

    bool IsAirplayMonitoringActive() const;
    const CYIString &GetConnectedDeviceName() const;

    CYISignal<bool> AirplayAvailabilityStatusChanged;
    CYISignal<bool> AirplayConnectionStatusChanged;

protected:

    bool IsAirplayConnected() const;

private:
    void OnBackgroundEntered();
    void OnForegroundEntered();

    AirplayService();

    CYIString m_connectedDeviceName;

    bool m_bIsAirplaying;
    bool m_bIsMonitoringAirplayStatus;
    bool m_bIsAirplayObserverForegroundRestartRequired;
};

#endif /* AirplayService_h */
