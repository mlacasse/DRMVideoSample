#include "CustomFairplayDrmHandlerModule.h"

#include "CustomFairplayDrmConfiguration.h"

#include <utility/YiUtilities.h>

#define TAG "CustomFairPlayDrmConfiguration"

using namespace yi::react;

static const std::string DRM_REQUEST_URL_AVAILABLE_EVENT = "DRM_REQUEST_URL_AVAILABLE";
static const std::string SPC_MESSAGE_AVAILABLE_EVENT = "SPC_MESSAGE_AVAILABLE";

YI_RN_INSTANTIATE_MODULE(CustomFairplayDrmHandlerModule, EventEmitterModule);

CustomFairplayDrmHandlerModule::CustomFairplayDrmHandlerModule()
{
    SetSupportedEvents({DRM_REQUEST_URL_AVAILABLE_EVENT,
                        SPC_MESSAGE_AVAILABLE_EVENT});
}

CustomFairplayDrmHandlerModule::~CustomFairplayDrmHandlerModule() = default;

YI_RN_DEFINE_EXPORT_METHOD(CustomFairplayDrmHandlerModule, requestSPCMessage)
(uint64_t componentTag, std::string applicationIdentifier, std::string contentIdentifier)
{
    auto pDrmConfiguration = dynamic_cast<CustomFairplayDrmConfiguration *>(GetDrmConfiguration(componentTag));
    if (!pDrmConfiguration)
    {
        return;
    }

    pDrmConfiguration->OnModuleRequestSPCMessage(applicationIdentifier, contentIdentifier);
}

YI_RN_DEFINE_EXPORT_METHOD(CustomFairplayDrmHandlerModule, provideCKCMessage)
(uint64_t componentTag, std::string ckcMessage)
{
    auto pDrmConfiguration = dynamic_cast<CustomFairplayDrmConfiguration *>(GetDrmConfiguration(componentTag));
    if (!pDrmConfiguration)
    {
        return;
    }

    pDrmConfiguration->OnModuleProvideCKCMessage(ckcMessage);
}

YI_RN_DEFINE_EXPORT_METHOD(CustomFairplayDrmHandlerModule, notifyFailure)
(uint64_t componentTag)
{
    auto pDrmConfiguration = dynamic_cast<CustomFairplayDrmConfiguration *>(GetDrmConfiguration(componentTag));
    if (!pDrmConfiguration)
    {
        return;
    }

    pDrmConfiguration->OnModuleNotifyFailure();
}

void CustomFairplayDrmHandlerModule::OnDRMRequestUrlAvailable(uint64_t componentTag, const CYIUrl &drmRequestUrl)
{
    folly::dynamic args = folly::dynamic::object("tag", componentTag)("drmRequestUrl", ToDynamic(drmRequestUrl.ToString()));
    EmitEvent(DRM_REQUEST_URL_AVAILABLE_EVENT, args);
}

void CustomFairplayDrmHandlerModule::OnSPCMessageAvailable(uint64_t componentTag, const CYIString &spcMessage)
{
    std::vector<char> base64Characters = YiBase64Encode(spcMessage);
    folly::dynamic args = folly::dynamic::object("tag", componentTag)("spcMessage", ToDynamic(CYIString(base64Characters.data(), base64Characters.size())));
    EmitEvent(SPC_MESSAGE_AVAILABLE_EVENT, args);
}
