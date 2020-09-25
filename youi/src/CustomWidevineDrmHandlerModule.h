#ifndef _CUSTOM_WIDEVINE_DRM_HANDLER_MODULE_H_
#define _CUSTOM_WIDEVINE_DRM_HANDLER_MODULE_H_

#include <youireact/modules/EventEmitter.h>
#include <youireact/modules/drm/DrmConfigurationModuleRegistry.h>
#include <youireact/props/VideoProps.h>

namespace yi
{
namespace react
{
class CustomWidevineDrmConfiguration;

class YI_RN_MODULE(CustomWidevineDrmHandlerModule, EventEmitterModule), public DrmConfigurationModuleRegistry<CustomWidevineDrmConfiguration>
{
public:
    CustomWidevineDrmHandlerModule();
    virtual ~CustomWidevineDrmHandlerModule() final;

    YI_RN_EXPORT_NAME(WidevineCustomRequestDrmHandlerModule);

    /*!
     \brief Provides the final license data to the player with tag \a componentTag, using the input \a licenseData.
     */
    YI_RN_EXPORT_METHOD(notifySuccess)
    (uint64_t componentTag, std::vector<char> licenseData);

    /*!
     \brief Notify the player with tag \a componentTag that an error occurred while attempting to initialize Widevine DRM with custom request handling.
     */
    YI_RN_EXPORT_METHOD(notifyFailure)
    (uint64_t componentTag);

    /*!
     \brief Notify the react module that the DRM POST request information is availeble.
     */
    void OnDRMPostRequestAvailable(uint64_t componentTag, const CYIString &drmRequestUrl, const std::vector<char> &postData, const std::vector<std::pair<CYIString, CYIString>> &headers);
};

} // namespace react

} // namespace yi

#endif // _CUSTOM_WIDEVINE_DRM_HANDLER_MODULE_H_
