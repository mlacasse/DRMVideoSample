#include "CustomWidevineDrmHandlerModule.h"

#include "CustomWidevineDrmConfiguration.h"

#include <utility/YiUtilities.h>

#define TAG "CustomWidevineDrmHandlerModule"

using namespace yi::react;

static const std::string DRM_POST_REQUEST_AVAILABLE = "DRM_POST_REQUEST_AVAILABLE";

YI_RN_INSTANTIATE_MODULE(CustomWidevineDrmHandlerModule, EventEmitterModule);

CustomWidevineDrmHandlerModule::CustomWidevineDrmHandlerModule()
{
    SetSupportedEvents({DRM_POST_REQUEST_AVAILABLE});
}

CustomWidevineDrmHandlerModule::~CustomWidevineDrmHandlerModule() = default;

YI_RN_DEFINE_EXPORT_METHOD(CustomWidevineDrmHandlerModule, notifySuccess)
(uint64_t componentTag, std::vector<char> licenseData)
{
    auto pDrmConfiguration = dynamic_cast<CustomWidevineDrmConfiguration *>(GetDrmConfiguration(componentTag));
    if (!pDrmConfiguration)
    {
        return;
    }

    pDrmConfiguration->NotifySuccess.Emit(licenseData);
}

YI_RN_DEFINE_EXPORT_METHOD(CustomWidevineDrmHandlerModule, notifyFailure)
(uint64_t componentTag)
{
    auto pDrmConfiguration = dynamic_cast<CustomWidevineDrmConfiguration *>(GetDrmConfiguration(componentTag));
    if (!pDrmConfiguration)
    {
        return;
    }

    pDrmConfiguration->NotifyFailure.Emit();
}

void CustomWidevineDrmHandlerModule::OnDRMPostRequestAvailable(uint64_t componentTag, const CYIString &drmRequestUrl, const std::vector<char> &postData, const std::vector<std::pair<CYIString, CYIString>> &headers)
{
    folly::dynamic headersObject = folly::dynamic::object;
    for (auto &pair : headers)
    {
        headersObject[ToDynamic(std::move(pair.first))] = ToDynamic(std::move(pair.second));
    }

    folly::dynamic args = folly::dynamic::object("tag", componentTag)("drmRequestUrl", ToDynamic(drmRequestUrl))("postData", ToDynamic(postData))("headers", headersObject);
    EmitEvent(DRM_POST_REQUEST_AVAILABLE, args);
}
