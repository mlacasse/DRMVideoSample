
#ifndef _CUSTOM_DRM_CONFIGURATION_FACTORY_H_
#define _CUSTOM_DRM_CONFIGURATION_FACTORY_H_

#include <player/YiAbstractVideoPlayer.h>
#include <youireact/modules/drm/DrmConfigurationFactory.h>

#include <folly/dynamic.h>

namespace yi
{
namespace react
{
class ReactComponent;
}
}

class CustomDrmConfigurationFactory
{
public:
    static std::unique_ptr<CYIAbstractVideoPlayer::DRMConfiguration> CustomDrmConfiguration(const yi::react::ReactComponent *pReactComponent, const std::string &drmScheme, const folly::dynamic &drmInfo);
};

#endif //_CUSTOM_DRM_CONFIGURATION_FACTORY_H_
