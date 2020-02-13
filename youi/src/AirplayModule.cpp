#ifndef YI_IOS

#include "AirplayModule.h"

#define LOG_TAG "AirplayModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(AirplayModule, VideoModule);

AirplayModule::AirplayModule()
{}

AirplayModule::~AirplayModule()
{}

YI_RN_DEFINE_EXPORT_METHOD(AirplayModule, setExternalAutoPlayback)(uint64_t tag, bool bEnable)
{
    YI_UNUSED(tag);
    YI_UNUSED(bEnable);

    YI_LOGD(LOG_TAG, "Airplay is not supported on this platform.");
}

#endif
