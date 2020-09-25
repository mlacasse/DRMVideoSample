#ifndef _CUSTOM_WIDEVINE_CUSTOM_REQUEST_DRM_CONFIGURATION_H_
#define _CUSTOM_WIDEVINE_CUSTOM_REQUEST_DRM_CONFIGURATION_H_

#include "CustomWidevineDrmHandlerModule.h"
#include <youireact/nodes/ReactComponent.h>

#include <player/YiWidevineModularCustomRequestDRMConfiguration.h>
#include <signal/YiSignalHandler.h>

namespace yi
{
namespace react
{
class CustomWidevineDrmConfiguration
: public RegisteredDrmConfiguration<CustomWidevineDrmConfiguration, CustomWidevineDrmHandlerModule>
, public CYIWidevineModularCustomRequestDRMConfiguration
, public CYISignalHandler
{
public:
    CustomWidevineDrmConfiguration(const ReactComponent *pReactComponent);
    ~CustomWidevineDrmConfiguration();

private:
    void OnDRMPostRequestAvailable(const CYIString &drmRequestUrl, const std::vector<char> &postData, const std::vector<std::pair<CYIString, CYIString>> &headers);
};

} // namespace react

} // namespace yi

#endif // _CUSTOM_WIDEVINE_CUSTOM_REQUEST_DRM_CONFIGURATION_H_
