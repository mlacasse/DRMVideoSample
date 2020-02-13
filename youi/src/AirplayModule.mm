#ifdef YI_IOS

#include "AirplayModule.h"

#include "AirplayService.h"

#include <player/YiAVPlayer.h>
#include <youireact/ShadowTree.h>
#include <youireact/nodes/ShadowVideo.h>
#include <youireact/nodes/ShadowVideoRef.h>

#define LOG_TAG "AirplayModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(AirplayModule, VideoModule);

AirplayModule::AirplayModule()
{}

AirplayModule::~AirplayModule()
{}

YI_RN_DEFINE_EXPORT_METHOD(AirplayModule, setExternalAutoPlayback)(uint64_t tag, bool bEnable)
{
    CYIAVPlayer *pAVPlayer = nullptr;

    auto &shadowRegistry = GetBridge().GetShadowTree().GetShadowRegistry();

    auto pComponent = shadowRegistry.Get(tag);
    if (pComponent)
    {
        ShadowVideo *pShadowVideo = dynamic_cast<ShadowVideo *>(pComponent);
        if (pShadowVideo)
        {
            pAVPlayer = dynamic_cast<CYIAVPlayer *>(&pShadowVideo->GetPlayer());
        }
        else
        {
            ShadowVideoRef *pShadowVideoRef = dynamic_cast<ShadowVideoRef *>(pComponent);
            if (pShadowVideoRef)
            {
                pAVPlayer = dynamic_cast<CYIAVPlayer *>(&pShadowVideoRef->GetPlayer());
            }
        }
    }

    if (pAVPlayer)
    {
        pAVPlayer->EnableAutoExternalPlaybackWhenAvailable(bEnable);
    }
}

YI_RN_DEFINE_EXPORT_METHOD(AirplayModule, showAirplayDeviceOptions)()
{
    YI_FLOAT_RECT frame;
    
    frame.left = 0;
    frame.top = 0;
    frame.right = 100;
    frame.bottom = 100;

    AirplayService::GetInstance().ShowAirplayDeviceOptions(frame);
}

YI_RN_DEFINE_EXPORT_METHOD(AirplayModule, isAirplayAvailable)
    (Callback successCallback, Callback failedCallback)
{
    YI_UNUSED(failedCallback);

    successCallback({ ToDynamic(AirplayService::GetInstance().IsAirplayAvailable()) });
}

YI_RN_DEFINE_EXPORT_METHOD(AirplayModule, isAirplayConnected)
    (Callback successCallback, Callback failedCallback)
{
    YI_UNUSED(failedCallback);

    successCallback({ ToDynamic(AirplayService::GetInstance().IsAirplayConnected()) });
}

#endif
