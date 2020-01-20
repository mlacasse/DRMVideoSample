#include "GoogleCastModule.h"

using namespace yi::react;

#define LOG_TAG "GoogleCastModule"

YI_RN_INSTANTIATE_MODULE(GoogleCastModule, EventEmitterModule);

#ifndef YI_IOS
GoogleCastModule::GoogleCastModule() {
  YI_LOGD(LOG_TAG, "GoogleCastModule is not supported on this platform.");
}

GoogleCastModule::~GoogleCastModule()
{}

void GoogleCastModule::StartObserving()
{}

void GoogleCastModule::StopObserving()
{}

YI_RN_DEFINE_EXPORT_METHOD(GoogleCastModule, getAvailableDevices)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic errorInfo = folly::dynamic::object;
    
    errorInfo["message"] = ToDynamic( "GoogleCast is not supported on this platform." );
    
    failedCallback({ ToDynamic(errorInfo) });
}
#endif
