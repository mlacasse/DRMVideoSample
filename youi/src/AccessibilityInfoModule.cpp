#include "AccessibilityInfoModule.h"

#include <logging/YiLogger.h>
#include <youireact/YiReactNativeView.h>

#define LOG_TAG "AccessibilityInfoModule"

using namespace yi::react;

YI_RN_INSTANTIATE_MODULE(AccessibilityInfoModule);

#if !defined(YI_ANDROID) && !defined(YI_IOS) && !defined(YI_TVOS)
AccessibilityInfoModule::AccessibilityInfoModule():
  accessibilityEnabled(false),
  audibleFeedbackEnabled(false),
  genericFeedbackEnabled(false),
  hapticFeedbackEnabled(false),
  spokenFeedbackEnabled(false),
  selectionFeedbackEnabled(false),
  visualFeedbackEnabled(false),
  brailleFeedbackEnabled(false) {
    YI_LOGE(LOG_TAG, "React Native AccessibilityInfoModule is not supported on this platform.");
}
#endif

YI_RN_DEFINE_EXPORT_CONSTANT(AccessibilityInfoModule, enabled)
{
    return ToDynamic(AccessibilityInfoModule::accessibilityEnabled);
}

YI_RN_DEFINE_EXPORT_METHOD(AccessibilityInfoModule, get)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic accessibilityInfo = folly::dynamic::object;
    
    accessibilityInfo["audible"] = ToDynamic(AccessibilityInfoModule::audibleFeedbackEnabled);
    accessibilityInfo["generic"] = ToDynamic(AccessibilityInfoModule::genericFeedbackEnabled);
    accessibilityInfo["haptic"] = ToDynamic(AccessibilityInfoModule::hapticFeedbackEnabled);
    accessibilityInfo["spoken"] = ToDynamic(AccessibilityInfoModule::spokenFeedbackEnabled);
    accessibilityInfo["selection"] = ToDynamic(AccessibilityInfoModule::selectionFeedbackEnabled);
    accessibilityInfo["visual"] = ToDynamic(AccessibilityInfoModule::visualFeedbackEnabled);
    accessibilityInfo["braille"] = ToDynamic(AccessibilityInfoModule::brailleFeedbackEnabled);
    
    successCallback({ ToDynamic(accessibilityInfo) });
}
