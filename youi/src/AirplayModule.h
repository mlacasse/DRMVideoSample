#ifndef _AIRPLAY_MODULE_H_
#define _AIRPLAY_MODULE_H_

#include <youireact/NativeModule.h>
#include <youireact/modules/components/VideoModule.h>
#include <youireact/nodes/ShadowVideo.h>

namespace yi
{
namespace react
{
class YI_RN_MODULE(AirplayModule, EventEmitterModule)
{
public:
    AirplayModule();
    virtual ~AirplayModule();

    YI_RN_EXPORT_NAME(Airplay);

    YI_RN_EXPORT_METHOD(setExternalAutoPlayback)(uint64_t tag, bool bEnable);
    YI_RN_EXPORT_METHOD(showAirplayDeviceOptions)();

    void OnAvailabilityStatusChanged(bool bStatus);
    void OnConnectionStatusChanged(bool bStatus);

private:
    virtual void StartObserving() override;
    virtual void StopObserving() override;
};

} // namespace react
} // namespace yi

#endif
