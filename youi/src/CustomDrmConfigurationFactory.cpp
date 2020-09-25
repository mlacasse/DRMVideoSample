#include "CustomDrmConfigurationFactory.h"
#include "CustomFairplayDrmConfiguration.h"
#include "CustomWidevineDrmConfiguration.h"

#include <player/YiFairPlayDRMConfiguration.h>
#include <player/YiPlayReadyDRMConfiguration.h>
#include <player/YiWidevineModularDRMConfiguration.h>
#include <utility/YiUtilities.h>

#include <youireact/modules/drm/DrmConfigurationFactory.h>
#include <youireact/modules/drm/ReactFairPlayDrmConfiguration.h>
#include <youireact/modules/drm/ReactWidevineCustomRequestDrmConfiguration.h>
#include <youireact/nodes/ReactComponent.h>
#include <youireact/props/VideoProps.h>

using namespace yi::react;

#define TAG "CustomDrmConfigurationFactory"

std::unique_ptr<CYIAbstractVideoPlayer::DRMConfiguration> CustomDrmConfigurationFactory::CustomDrmConfiguration(const ReactComponent *pReactComponent, const std::string &drmScheme, const folly::dynamic &drmInfo)
{
    std::unique_ptr<CYIAbstractVideoPlayer::DRMConfiguration> pDrmConfiguration = nullptr;

    if (drmScheme == "fairplay")
    {
        if (!pReactComponent)
        {
            YI_LOGF(TAG, "FairPlay DRM requires a react component to initialize.");
            return nullptr;
        }
        pDrmConfiguration = std::make_unique<CustomFairplayDrmConfiguration>(pReactComponent);
    }
    else if (drmScheme == "widevine_modular" || drmScheme == "widevine_modular_custom_request")
    {
        if (!pReactComponent)
        {
            YI_LOGF(TAG, "Widevine DRM requires a react component to initialize.");
            return nullptr;
        }

        pDrmConfiguration = std::make_unique<CustomWidevineDrmConfiguration>(pReactComponent);
    }
    else
    {
        // for configurations that are not playReady, let's reset and use the default
        // this is necessary because the `Create` method recursively calls the custom
        // factory again.
        DrmConfigurationFactory::SetFactoryFunction(nullptr);
        pDrmConfiguration = DrmConfigurationFactory::Create(pReactComponent, drmScheme, drmInfo);
        DrmConfigurationFactory::SetFactoryFunction(CustomDrmConfigurationFactory::CustomDrmConfiguration);
    }

    return pDrmConfiguration;
}
