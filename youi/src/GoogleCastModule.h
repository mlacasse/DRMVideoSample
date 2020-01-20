#ifndef _GOOGLECAST_MODULE_H_
#define _GOOGLECAST_MODULE_H_

#include <youireact/NativeModule.h>
#include <youireact/modules/EventEmitter.h>

namespace yi
{
namespace react
{
class YI_RN_MODULE(GoogleCastModule, EventEmitterModule)
{
public:
    GoogleCastModule();
    virtual ~GoogleCastModule();

    YI_RN_EXPORT_NAME(GoogleCast);

    YI_RN_EXPORT_METHOD(getAvailableDevices)(Callback successCallback, Callback failedCallback);

private:
    virtual void StartObserving() override;
    virtual void StopObserving() override;
};

} // namespace react
} // namespace yi

#endif
