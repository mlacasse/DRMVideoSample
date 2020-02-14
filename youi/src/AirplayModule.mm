#ifdef YI_IOS

#include "AirplayModule.h"

#include "AirplayService.h"

#include <player/YiAVPlayer.h>
#include <youireact/ShadowTree.h>
#include <youireact/nodes/ShadowVideo.h>
#include <youireact/nodes/ShadowVideoRef.h>

#define LOG_TAG "AirplayModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(AirplayModule, EventEmitterModule);

AirplayModule::AirplayModule()
{
    SetSupportedEvents({ "update" });
    
    AirplayService::GetInstance().AirplayAvailabilityStatusChanged.Connect(*this, &AirplayModule::OnAvailabilityStatusChanged);
    AirplayService::GetInstance().AirplayConnectionStatusChanged.Connect(*this, &AirplayModule::OnConnectionStatusChanged);
}

AirplayModule::~AirplayModule()
{
    StopObserving();

    AirplayService::GetInstance().AirplayAvailabilityStatusChanged.Disconnect(*this, &AirplayModule::OnAvailabilityStatusChanged);
    AirplayService::GetInstance().AirplayConnectionStatusChanged.Disconnect(*this, &AirplayModule::OnConnectionStatusChanged);
}

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
    AirplayService::GetInstance().ShowAirplayDeviceOptions();
}

void AirplayModule::OnAvailabilityStatusChanged(bool bStatus)
{
    EmitEvent("update", folly::dynamic::object("available", bStatus));
}

void AirplayModule::OnConnectionStatusChanged(bool bStatus)
{
    EmitEvent("update", folly::dynamic::object("connected", bStatus));
}

void AirplayModule::StartObserving()
{
    AirplayService::GetInstance().StartObserving();
}

void AirplayModule::StopObserving()
{
    AirplayService::GetInstance().StopObserving();
}

#endif
