#if defined(YI_IOS)
#include "AccessibilityInfoModule.h"

#include <logging/YiLogger.h>
#include <youireact/YiReactNativeView.h>

#import <UIKit/UIKit.h>

#define LOG_TAG "AccessibilityInfoModule"

using namespace yi::react;

YI_RN_DEFINE_EXPORT_METHOD(AccessibilityInfoModule, get)(Callback successCallback, Callback failedCallback)
{
    folly::dynamic accessibilityInfo = folly::dynamic::object;
    
    accessibilityInfo["selection"] = ToDynamic(UIAccessibilityIsSpeakSelectionEnabled());
    accessibilityInfo["audible"] = ToDynamic(UIAccessibilityIsVoiceOverRunning());
    accessibilityInfo["spoken"] = ToDynamic(UIAccessibilityIsSpeakScreenEnabled());
    
    successCallback({ ToDynamic(accessibilityInfo) });
}
#endif
