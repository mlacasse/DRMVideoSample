#ifndef AirplayService_h
#define AirplayService_h

#include <signal/YiSignal.h>
#include <signal/YiSignalHandler.h>

class AirplayService : public CYISignalHandler
{
public:

    static AirplayService &GetInstance();
    ~AirplayService();

    void ShowAirplayDeviceOptions();

    void StartObserving();
    void StopObserving();

    CYISignal<bool> AirplayAvailabilityStatusChanged;
    CYISignal<bool> AirplayConnectionStatusChanged;

private:
    AirplayService();

    bool m_bIsAirplayObserverForegroundRestartRequired;
};

#endif /* AirplayService_h */
