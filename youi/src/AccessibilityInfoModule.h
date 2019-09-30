#ifndef _ACCESSIBILITY_INFO_MODULE_H_
#define _ACCESSIBILITY_INFO_MODULE_H_

#include <youireact/NativeModule.h>

namespace yi
{
namespace react
{
class YI_RN_MODULE(AccessibilityInfoModule)
{
public:
    YI_RN_EXPORT_NAME(AccessibilityInfo);

    AccessibilityInfoModule();

    YI_RN_EXPORT_METHOD(get)(Callback successCallback, Callback failedCallback);
};

} // namespace react
} // namespace yi

#endif // _ACCESSIBILITY_INFO_MODULE_H_
