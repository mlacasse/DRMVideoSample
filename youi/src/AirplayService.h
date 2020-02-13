#ifndef AirplayService_h
#define AirplayService_h

#include <signal/YiSignal.h>
#include <signal/YiSignalHandler.h>

class AirplayService : public CYISignalHandler
{
public:

    static AirplayService &GetInstance();
    ~AirplayService();

    void ShowAirplayDeviceOptions(const YI_FLOAT_RECT &rAirplayButtonFrame);

    bool IsAirplayAvailable();
    bool IsAirplayConnected();

    CYISignal<bool> AirplayAvailabilityStatusChanged;
    CYISignal<bool> AirplayConnectionStatusChanged;

private:
    void StartObserver();
    void StopObserver();

    AirplayService();

    bool m_bIsAirplayObserverForegroundRestartRequired;
};

#endif /* AirplayService_h */
