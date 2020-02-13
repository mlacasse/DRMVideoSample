#ifndef _AIRPLAY_MODULE_H_
#define _AIRPLAY_MODULE_H_

#include <youireact/NativeModule.h>
#include <youireact/modules/components/VideoModule.h>
#include <youireact/nodes/ShadowVideo.h>

namespace yi
{
namespace react
{
class YI_RN_MODULE(AirplayModule, VideoModule)
{
public:
    AirplayModule();
    virtual ~AirplayModule();

    YI_RN_EXPORT_NAME(Airplay);

    YI_RN_EXPORT_METHOD(setExternalAutoPlayback)(uint64_t tag, bool bEnable);
    YI_RN_EXPORT_METHOD(showAirplayDeviceOptions)();
    YI_RN_EXPORT_METHOD(isAirplayAvailable)(Callback successCallback, Callback failedCallback);
    YI_RN_EXPORT_METHOD(isAirplayConnected)(Callback successCallback, Callback failedCallback);
};

} // namespace react
} // namespace yi

#endif
