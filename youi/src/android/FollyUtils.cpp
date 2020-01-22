#ifdef YI_ANDROID

#include "youireact/NativeModule.h"
#include "UtilityBridgesAndroid.h"

extern JavaVM  *cachedJVM;

extern "C"
{
}

JNIEnv *GetEnv()
{
    JNIEnv *pEnv;
    cachedJVM->GetEnv(reinterpret_cast<void**>(&pEnv), JNI_VERSION_1_6);

    return pEnv;
}

JniGlobal::Ptr getDictionaryObject(const folly::dynamic &dyn)
{
    JniGlobal::Ptr jniGlobal(new JniGlobal(dyn));
    if (jniGlobal->get() && jniGlobal->isJsonKind())
    {
        return jniGlobal;
    }
    return JniGlobal::Ptr();
}

std::shared_ptr<std::string> getStringFromJString(const jstring& jStr)
{
    std::shared_ptr<std::string> result;
    if (jStr != nullptr)
    {
        JNIEnv *env = GetEnv();
        const char * utfChar = env->GetStringUTFChars(jStr, 0);
        result.reset(new std::string(utfChar));
        env->ReleaseStringUTFChars(jStr, utfChar);
    }
    return result;
}

#endif

