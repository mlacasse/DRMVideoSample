#include "CustomFairplayDrmConfiguration.h"
#include "CustomFairplayDrmHandlerModule.h"

#include <youireact/IBridge.h>
#include <youireact/modules/drm/FairPlayDrmHandlerModule.h>

#define TAG "CustomFairplayDrmConfiguration"

using namespace yi::react;

CustomFairplayDrmConfiguration::CustomFairplayDrmConfiguration(const ReactComponent *pReactComponent)
    : RegisteredDrmConfiguration<CustomFairplayDrmConfiguration, CustomFairplayDrmHandlerModule>(pReactComponent)
{
    DRMRequestUrlAvailable.Connect(*this, &CustomFairplayDrmConfiguration::OnDRMRequestUrlAvailable);
    SPCMessageAvailable.Connect(*this, &CustomFairplayDrmConfiguration::OnSPCMessageAvailable);
}

CustomFairplayDrmConfiguration::~CustomFairplayDrmConfiguration() = default;

void CustomFairplayDrmConfiguration::OnModuleRequestSPCMessage(const CYIString &applicationIdentifier, const CYIString &contentIdentifier)
{
    RequestSPCMessage.Emit(applicationIdentifier, contentIdentifier);
}

void CustomFairplayDrmConfiguration::OnModuleProvideCKCMessage(const CYIString &ckcMessage)
{
    ProvideCKCMessage.Emit(ckcMessage);
}

void CustomFairplayDrmConfiguration::OnModuleNotifyFailure()
{
    NotifyFailure.Emit();
}

void CustomFairplayDrmConfiguration::OnDRMRequestUrlAvailable(const CYIUrl &drmRequestUrl)
{
    auto pDrmHandlerModule = GetModule();
    if (pDrmHandlerModule)
    {
        pDrmHandlerModule->OnDRMRequestUrlAvailable(GetComponentTag(), drmRequestUrl);
    }
}

void CustomFairplayDrmConfiguration::OnSPCMessageAvailable(const CYIString &spcMessage)
{
    auto pDrmHandlerModule = GetModule();
    if (pDrmHandlerModule)
    {
        pDrmHandlerModule->OnSPCMessageAvailable(GetComponentTag(), spcMessage);
    }
}
