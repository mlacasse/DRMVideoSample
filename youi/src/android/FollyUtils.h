#ifdef YI_ANDROID

#ifndef _FOLLY_UTILS_H_
#define _FOLLY_UTILS_H_

#include <jni.h>

#include <android/log.h>

#include <folly/json.h>
#include <folly/dynamic.h>

class FollyUtils
{
public:
    FollyUtils(const folly::dynamic &dyn);
    ~FollyUtils();
    typedef std::shared_ptr<FollyUtils> Ptr;

    jobject get() const;
    bool isJsonKind() const;
private:
    void follyDynamicObjectToJavaHashMap(const folly::dynamic &dyn);

    jobject mGlobalRef;
    bool mIsJsonKind;
};

typedef FollyUtils JniGlobal;

JniGlobal::Ptr getDictionaryObject(const folly::dynamic &dyn);
std::shared_ptr<std::string> getStringFromJString(const jstring& jStr);

#endif

#endif  //_FOLLY_UTILS_H_

