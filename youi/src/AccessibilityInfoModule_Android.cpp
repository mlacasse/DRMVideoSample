#include "AccessibilityInfoModule.h"

#include <logging/YiLogger.h>
#include <youireact/YiReactNativeView.h>

#include <jni.h>

#define LOG_TAG "AccessibilityInfoModule"

using namespace yi::react;

extern JavaVM *cachedJVM;
extern jobject cachedActivity;

YI_RN_INSTANTIATE_MODULE(AccessibilityInfoModule);

#if defined(YI_ANDROID)
AccessibilityInfoModule::AccessibilityInfoModule():
  accessibilityEnabled(false),
  audibleFeedbackEnabled(false),
  genericFeedbackEnabled(false),
  hapticFeedbackEnabled(false),
  spokenFeedbackEnabled(false),
  selectionFeedbackEnabled(false),
  visualFeedbackEnabled(false),
  brailleFeedbackEnabled(false) {
    JNIEnv *pEnv = NULL;

    cachedJVM->GetEnv(reinterpret_cast<void **>(&pEnv), JNI_VERSION_1_6);

    if (pEnv)
    {
        jclass localDeviceClass = pEnv->FindClass("tv/youi/AccessibilityInfoModule");
        jclass _class = (jclass)pEnv->NewGlobalRef(localDeviceClass);

        if (_class)
        {
            jmethodID _enabled   = pEnv->GetStaticMethodID(_class, "_enabled", "(Landroid/content/Context;)Z");
            jmethodID _audible   = pEnv->GetStaticMethodID(_class, "_audible", "(Landroid/content/Context;)Z");
            jmethodID _generic   = pEnv->GetStaticMethodID(_class, "_generic", "(Landroid/content/Context;)Z");
            jmethodID _haptic    = pEnv->GetStaticMethodID(_class, "_haptic", "(Landroid/content/Context;)Z");
            jmethodID _spoken    = pEnv->GetStaticMethodID(_class, "_spoken", "(Landroid/content/Context;)Z");
            jmethodID _visual    = pEnv->GetStaticMethodID(_class, "_visual", "(Landroid/content/Context;)Z");
            jmethodID _braille   = pEnv->GetStaticMethodID(_class, "_braille", "(Landroid/content/Context;)Z");

            YI_LOGD(LOG_TAG, "Initialized JNI methods.");

            accessibilityEnabled = (jboolean)pEnv->CallStaticBooleanMethod(_class, _enabled, cachedActivity);

            YI_LOGD(LOG_TAG, "accessibility: %s", (accessibilityEnabled ? "on" : "off"));

            if (accessibilityEnabled) {
              audibleFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _audible, cachedActivity);
              genericFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _generic, cachedActivity);
              hapticFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _haptic, cachedActivity);
              spokenFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _spoken, cachedActivity);
              visualFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _visual, cachedActivity);
              brailleFeedbackEnabled = (jboolean) pEnv->CallStaticBooleanMethod(_class, _braille, cachedActivity);
            }

            YI_LOGD(LOG_TAG, "audible: %s", (audibleFeedbackEnabled ? "on" : "off"));
            YI_LOGD(LOG_TAG, "generic: %s", (genericFeedbackEnabled ? "on" : "off"));
            YI_LOGD(LOG_TAG, "haptic: %s", (hapticFeedbackEnabled ? "on" : "off"));
            YI_LOGD(LOG_TAG, "spoken: %s", (spokenFeedbackEnabled ? "on" : "off"));
            YI_LOGD(LOG_TAG, "visual: %s", (visualFeedbackEnabled ? "on" : "off"));
            YI_LOGD(LOG_TAG, "braille: %s", (brailleFeedbackEnabled ? "on" : "off"));
        }
    }
}
#endif