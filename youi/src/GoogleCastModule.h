#ifndef _GOOGLECAST_MODULE_H_
#define _GOOGLECAST_MODULE_H_

#include <utility/YiTimer.h>
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
    YI_RN_EXPORT_METHOD(connect)(std::string uniqueId);
    YI_RN_EXPORT_METHOD(disconnect)();

    YI_RN_EXPORT_METHOD(prepare)(Callback successCallback, Callback failedCallback, folly::dynamic source, folly::dynamic metadata);
    YI_RN_EXPORT_METHOD(play)();
    YI_RN_EXPORT_METHOD(pause)();

private:
    void OnTimeout();

    CYITimer m_timer;
};

} // namespace react
} // namespace yi

#endif
