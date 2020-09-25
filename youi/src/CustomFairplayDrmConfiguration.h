#ifndef _CUSTOM_FAIRPLAY_DRM_CONFIGURATION_H_
#define _CUSTOM_FAIRPLAY_DRM_CONFIGURATION_H_

#include "CustomFairplayDrmHandlerModule.h"

#include <youireact/modules/drm/RegisteredDrmConfiguration.h>
#include <youireact/nodes/ReactComponent.h>

#include <player/YiFairPlayDRMConfiguration.h>
#include <signal/YiSignalHandler.h>

namespace yi
{
namespace react
{
class IBridge;

class CustomFairplayDrmConfiguration
: public RegisteredDrmConfiguration<CustomFairplayDrmConfiguration, CustomFairplayDrmHandlerModule>
, public CYIFairPlayDRMConfiguration
, public CYISignalHandler
{
public:
    CustomFairplayDrmConfiguration(const ReactComponent *pReactComponent);
    ~CustomFairplayDrmConfiguration();

    void OnModuleRequestSPCMessage(const CYIString &applicationIdentifier, const CYIString &contentIdentifier);
    void OnModuleProvideCKCMessage(const CYIString &ckcMessage);
    void OnModuleNotifyFailure();

private:
    void OnDRMRequestUrlAvailable(const CYIUrl &drmRequestUrl);
    void OnSPCMessageAvailable(const CYIString &spcMessage);
};

} // namespace react

} // namespace yi

#endif // _CUSTOM_FAIRPLAY_DRM_CONFIGURATION_H_
