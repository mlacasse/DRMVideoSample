#ifdef YI_ANDROID

#ifndef FOLLY_UTILS_H
#define FOLLY_UTILS_H

#include "JniGlobalRefsManager.h"

#include <jni.h>
#include <android/log.h>

JniGlobal::Ptr getDictionaryObject(const folly::dynamic &dyn);
std::shared_ptr<std::string> getStringFromJString(const jstring& jStr);

# define LOGD(tag,...) __android_log_print(ANDROID_LOG_DEBUG, tag, __VA_ARGS__)

#endif

#endif  //FOLLY_UTILS_H

