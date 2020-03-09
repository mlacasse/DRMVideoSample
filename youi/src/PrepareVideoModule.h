#ifndef _PREPARE_VIDEO_MODULE_H_
#define _PREPARE_VIDEO_MODULE_H_

#include <youireact/NativeModule.h>
#include <youireact/modules/components/VideoModule.h>
#include <youireact/nodes/ShadowVideo.h>

namespace yi
{
namespace react
{
class YI_RN_MODULE(PrepareVideoModule)
{
public:
    PrepareVideoModule();
    virtual ~PrepareVideoModule();

    YI_RN_EXPORT_NAME(PrepareVideo);

    YI_RN_EXPORT_METHOD(prepare)
    (Callback successCallback, Callback failedCallback, uint64_t tag, folly::dynamic source);
};

} // namespace react
} // namespace yi

#endif
