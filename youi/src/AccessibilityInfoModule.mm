#if defined(YI_IOS) || defined(YI_TVOS)
#include "AccessibilityInfoModule.h"

#include <youireact/YiReactNativeView.h>

#import <UIKit/UIKit.h>

using namespace yi::react;

YI_RN_DEFINE_EXPORT_METHOD(AccessibilityInfoModule, get)(Callback successCallback, Callback failedCallback)
{
    bool selectionEnabled = UIAccessibilityIsSpeakSelectionEnabled();
    bool audibleEnabled = UIAccessibilityIsVoiceOverRunning();
    bool spoken = UIAccessibilityIsSpeakScreenEnabled();

    folly::dynamic accessibilityInfo = folly::dynamic::object;

    accessibilityInfo["selection"] = ToDynamic(selectionEnabled);
    accessibilityInfo["audible"] = ToDynamic(audibleEnabled);
    accessibilityInfo["spoken"] = ToDynamic(spoken);
    
    successCallback({ ToDynamic(accessibilityInfo) });
}
#endif
