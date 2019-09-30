#include "AccessibilityInfoModule.h"

#include <logging/YiLogger.h>
#include <youireact/YiReactNativeView.h>

#include <jni.h>

#define LOG_TAG "AccessibilityInfoModule"

using namespace yi::react;

extern JavaVM *cachedJVM;
extern jobject cachedActivity;

YI_RN_DEFINE_EXPORT_METHOD(AccessibilityInfoModule, get)(Callback successCallback, Callback failedCallback)
{
    JNIEnv *pEnv = NULL;

    cachedJVM->GetEnv(reinterpret_cast<void **>(&pEnv), JNI_VERSION_1_6);

    if (pEnv)
    {
        jclass localDeviceClass = pEnv->FindClass("tv/youi/AccessibilityInfoModule");
        jclass _class = (jclass)pEnv->NewGlobalRef(localDeviceClass);

        if (_class)
        {
            jmethodID _audible   = pEnv->GetStaticMethodID(_class, "_audible", "(Landroid/content/Context;)Z");
            jmethodID _generic   = pEnv->GetStaticMethodID(_class, "_generic", "(Landroid/content/Context;)Z");
            jmethodID _haptic    = pEnv->GetStaticMethodID(_class, "_haptic", "(Landroid/content/Context;)Z");
            jmethodID _spoken    = pEnv->GetStaticMethodID(_class, "_spoken", "(Landroid/content/Context;)Z");
            jmethodID _visual    = pEnv->GetStaticMethodID(_class, "_visual", "(Landroid/content/Context;)Z");
            jmethodID _braille   = pEnv->GetStaticMethodID(_class, "_braille", "(Landroid/content/Context;)Z");

            folly::dynamic accessibilityInfo = folly::dynamic::object;

            accessibilityInfo["audible"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _audible, cachedActivity));
            accessibilityInfo["generic"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _generic, cachedActivity));
            accessibilityInfo["braille"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _braille, cachedActivity));
            accessibilityInfo["spoken"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _spoken, cachedActivity));
            accessibilityInfo["haptic"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _haptic, cachedActivity));
            accessibilityInfo["visual"] = ToDynamic(pEnv->CallStaticBooleanMethod(_class, _visual, cachedActivity));
            
            successCallback({ ToDynamic(accessibilityInfo) });
        }
    }
}
#endif