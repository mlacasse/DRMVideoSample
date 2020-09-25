#include "CustomWidevineDrmConfiguration.h"

#include <youireact/IBridge.h>

#define TAG "CustomWidevineDrmConfiguration"

using namespace yi::react;

CustomWidevineDrmConfiguration::CustomWidevineDrmConfiguration(const ReactComponent *pReactComponent)
: RegisteredDrmConfiguration<CustomWidevineDrmConfiguration, CustomWidevineDrmHandlerModule>(pReactComponent)
{
    DRMPostRequestAvailable.Connect(*this, &CustomWidevineDrmConfiguration::OnDRMPostRequestAvailable);
}

CustomWidevineDrmConfiguration::~CustomWidevineDrmConfiguration() = default;

void CustomWidevineDrmConfiguration::OnDRMPostRequestAvailable(const CYIString &drmRequestUrl, const std::vector<char> &postData, const std::vector<std::pair<CYIString, CYIString>> &headers)
{
    auto *pDrmHandlerModule = GetModule();
    if (pDrmHandlerModule)
    {
        pDrmHandlerModule->OnDRMPostRequestAvailable(GetComponentTag(), drmRequestUrl, postData, headers);
    }
}
