#ifndef _CUSTOM_FAIRPLAY_DRM_HANDLER_MODULE_H_
#define _CUSTOM_FAIRPLAY_DRM_HANDLER_MODULE_H_

#include <youireact/modules/EventEmitter.h>
#include <youireact/modules/drm/DrmConfigurationModuleRegistry.h>
#include <youireact/props/VideoProps.h>

namespace yi
{
namespace react
{
class CustomFairplayDrmConfiguration;

class YI_RN_MODULE(CustomFairplayDrmHandlerModule, EventEmitterModule), public DrmConfigurationModuleRegistry<CustomFairplayDrmConfiguration>
{
public:
    CustomFairplayDrmHandlerModule();
    virtual ~CustomFairplayDrmHandlerModule() final;

    YI_RN_EXPORT_NAME(FairPlayDrmHandlerModule);

    YI_RN_EXPORT_METHOD(requestSPCMessage)
    (uint64_t componentTag, std::string applicationIdentifier, std::string contentIdentifier);

    YI_RN_EXPORT_METHOD(provideCKCMessage)
    (uint64_t componentTag, std::string ckcMessage);

    YI_RN_EXPORT_METHOD(notifyFailure)
    (uint64_t componentTag);

    void OnDRMRequestUrlAvailable(uint64_t componentTag, const CYIUrl &drmRequestUrl);
    void OnSPCMessageAvailable(uint64_t componentTag, const CYIString &spcMessage);
};

} // namespace react

} // namespace yi

#endif // _CUSTOM_FAIRPLAY_DRM_HANDLER_MODULE_H_
