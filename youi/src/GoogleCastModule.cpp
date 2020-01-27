#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(GoogleCastModule, EventEmitterModule);

#ifndef YI_IOS
GoogleCastModule::GoogleCastModule() {
    SetSupportedEvents({ "update" });
    
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

GoogleCastModule::~GoogleCastModule()
{}

void GoogleCastModule::OnTimeout()
{}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, connect)(std::string uniqueId)
{
    YI_UNUSED(uniqueId);

    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, disconnect)()
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, prepare)
(Callback successCallback, Callback failedCallback, folly::dynamic source, folly::dynamic metadata)
{
    YI_UNUSED(source);
    YI_UNUSED(metadata);
    YI_UNUSED(successCallback);
    YI_UNUSED(failedCallback);

    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, play)()
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, pause)()
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, getAvailableDevices)(Callback successCallback, Callback failedCallback)
{
    YI_UNUSED(successCallback);

    folly::dynamic errorInfo = folly::dynamic::object;
    
    errorInfo["message"] = ToDynamic( "GoogleCast is not supported on this platform." );
    
    failedCallback({ ToDynamic(errorInfo) });
}
#endif
