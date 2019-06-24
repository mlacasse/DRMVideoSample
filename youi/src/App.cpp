// © You i Labs Inc. 2000-2019. All rights reserved.
#include "App.h"
#include <appium/YiWebDriverLocator.h>
#include <cxxreact/JSBigString.h>
#include <glog/logging.h>

#include <logging/YiLogger.h>
#include <logging/YiLoggerHelper.h>
#include <framework/YiFramework.h>

#include <youireact/modules/drm/FairPlayDrmHandlerModule.h>
#include <network/YiHTTPService.h>

#if defined(YI_LOCAL_JS_APP)
#    if defined(YI_INLINE_JS_APP)
#        include "youireact/JsBundleLoaderInlineString.h"
const char INLINE_JS_BUNDLE_STRING[] =
#        include "InlineJSBundleGenerated/index.youi.bundle"
    ;
#    else
#        include "youireact/JsBundleLoaderLocalAsset.h"
#    endif
#else
#    include "youireact/JsBundleLoaderRemote.h"
#endif

App::App() = default;

App::~App() = default;

using namespace yi::react;

bool App::UserInit()
{
    // Setup Logging Preferences
    std::shared_ptr<CYIPreferences> pPreferences(new CYIPreferences());
    
    // App wide Log preferences
    pPreferences->Set("TAG_GENERAL", "DEBUG");
    
    // Error messages
    pPreferences->Set("TAG_CYIAssetDownloadHelper", "ERROR");
    pPreferences->Set("TAG_CYIHTTPService", "ERROR");
    pPreferences->Set("TAG_CYIHTTPServiceStats", "ERROR");
    pPreferences->Set("TAG_CYIImageView", "ERROR");
    pPreferences->Set("TAG_CYILRUCache", "ERROR");
    pPreferences->Set("TAG_CYIPersistentCache", "ERROR");
    pPreferences->Set("TAG_CYITransferHandle", "ERROR");
    pPreferences->Set("TAG_EventDispatcherModule", "ERROR");
    pPreferences->Set("TAG_CYIExoPlayer", "ERROR");
    pPreferences->Set("TAG_ShadowTree", "ERROR");
    pPreferences->Set("TAG_UIManagerModule", "ERROR");
    
    // Debug messages
    pPreferences->Set("TAG_Transfer", "DEBUG");
    
    // Info messages
    pPreferences->Set("TAG_JavaScript", "INFO");
    
    CYILogger::SetPreferences(pPreferences);

    // Start the web driver for allowing the use of Appium.
    CYIWebDriver *pWebDriver = CYIWebDriverLocator::GetWebDriver();
    if (pWebDriver)
    {
        pWebDriver->Start();
    }

#if !defined(YI_MINI_GLOG)
    // miniglog defines this using a non-const char * causing a compile error and it has no implementation anyway.
    static bool isGoogleLoggingInitialized = false;
    if (!isGoogleLoggingInitialized)
    {
        google::InitGoogleLogging("--logtostderr=1");
        isGoogleLoggingInitialized = true;
    }
#endif

#if defined(YI_LOCAL_JS_APP)
#    if defined(YI_INLINE_JS_APP)
    std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderInlineString(INLINE_JS_BUNDLE_STRING));
#    else
    std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderLocalAsset());
#    endif
#else
    std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderRemote());
#endif

    PlatformApp::SetJsBundleLoader(std::move(pBundleLoader));
    bool result = PlatformApp::UserInit();

    GetBridge().AddModule<FairPlayDrmHandlerModule>();
    
    CYIHTTPService::GetInstance()->ClearCache();

    return result;
}

bool App::UserStart()
{
    return PlatformApp::UserStart();
}

void App::UserUpdate()
{
    PlatformApp::UserUpdate();
}
