#include "GoogleCastModule.h"

#define LOG_TAG "GoogleCastModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(GoogleCastModule, EventEmitterModule);

#ifndef YI_IOS
GoogleCastModule::GoogleCastModule() {
  YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

GoogleCastModule::~GoogleCastModule()
{}

void GoogleCastModule::StartObserving()
{}

void GoogleCastModule::StopObserving()
{}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, connect)(std::string uniqueId)
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, disconnect)()
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, play)(folly::dynamic source, folly::dynamic metadata)
{
    YI_UNUSED(source);
    YI_UNUSED(metadata);

    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, pause)()
{
    YI_LOGD(LOG_TAG, "GoogleCast is not supported on this platform.");
}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, getAvailableDevices)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic errorInfo = folly::dynamic::object;
    
    errorInfo["message"] = ToDynamic( "GoogleCast is not supported on this platform." );
    
    failedCallback({ ToDynamic(errorInfo) });
}
#endif
