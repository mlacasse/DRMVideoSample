#include "AccessibilityInfoModule.h"

#include <youireact/YiReactNativeView.h>

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(AccessibilityInfoModule);

AccessibilityInfoModule::AccessibilityInfoModule()
{}

#if !defined(YI_ANDROID) && !defined(YI_IOS) && !defined(YI_TVOS)
YI_RN_DEFINE_EXPORT_METHOD(AccessibilityInfoModule, get)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic errorInfo = folly::dynamic::object;
    
    accessibilityInfo["message"] = "React Native AccessibilityInfoModule is not supported on this platform.";
    
    failedCallback({ ToDynamic(errorInfo) });
}
#endif
