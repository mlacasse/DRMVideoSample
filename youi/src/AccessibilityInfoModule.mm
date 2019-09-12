#if defined(YI_IOS)
#include "AccessibilityInfoModule.h"

#include <logging/YiLogger.h>
#include <youireact/YiReactNativeView.h>

#import <UIKit/UIKit.h>

#define LOG_TAG "AccessibilityInfoModule"

using namespace yi::react;

AccessibilityInfoModule::AccessibilityInfoModule():
  genericFeedbackEnabled(false),
  hapticFeedbackEnabled(false),
  visualFeedbackEnabled(false),
  brailleFeedbackEnabled(false) {
    selectionFeedbackEnabled = UIAccessibilityIsSpeakSelectionEnabled();
    audibleFeedbackEnabled = UIAccessibilityIsVoiceOverRunning();
    spokenFeedbackEnabled = UIAccessibilityIsSpeakScreenEnabled();

    accessibilityEnabled = selectionFeedbackEnabled || audibleFeedbackEnabled || spokenFeedbackEnabled;
}
#endif
