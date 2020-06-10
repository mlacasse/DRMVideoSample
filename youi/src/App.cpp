// © You i Labs Inc. 2000-2019. All rights reserved.
#include "App.h"

#include "AirplayModule.h"
#include "DevicePowerManagementBridgeModule.h"
#include "DimensionsModule.h"
#include "GoogleCastModule.h"
#include "InteractionModule.h"
#include "OrientationLockModule.h"
#include "PrepareVideoModule.h"
#include "TrackpadModule.h"

#include <automation/YiWebDriverLocator.h>

#include <cxxreact/JSBigString.h>
#include <glog/logging.h>

#include <framework/YiFramework.h>
#include <framework/YiVersion.h>
#include <logging/YiLogger.h>
#include <logging/YiLoggerHelper.h>
#include <network/YiHTTPService.h>
#include <player/YiExoPlayerVideoPlayer.h>

#include <youireact/modules/drm/FairPlayDrmHandlerModule.h>
#include <youireact/modules/drm/WidevineCustomRequestDrmHandlerModule.h>
#include <youireact/VideoPlayerFactory.h>

#include <JSBundlingStrings.h>

#define LOG_TAG "DRMVideoSample"

App::App() = default;

App::~App() = default;

using namespace yi::react;

bool App::UserInit()
{
#if defined(YI_ANDROID)
    VideoPlayerFactory::SetFactoryFunction([] {
        auto player = std::make_unique<CYIExoPlayerVideoPlayer>();

        player->Init();
        player->SetLivePresentationDelay_(18000, true);

        return player;
    });
#endif

    // Start the web driver for allowing the use of Appium.
    CYIWebDriver *pWebDriver = CYIWebDriverLocator::GetWebDriver();
    if (pWebDriver)
    {
        pWebDriver->Start();
    }

    enum
    {
      /** This value was picked through trial and error.
       Too small makes the application crash; better to be safe and pick a larger buffer
       size for networking than guessing the lowest magical value.
       */
          oneMegabyteInBytes = 1048576
    };

    // Disable hud
    SetHUDVisibility(false);

    // App wide Log preferences
    CYILogger::SetLevel(EYILogLevel::debug);

    // Now create and install our logging filter.
    CYILogger::PushFilter(CYILogger::CreateFilter({
        { "CYIAssetDownloadHelper", EYILogLevel::err },
        { "CYIExoPlayer", EYILogLevel::err },
        { "CYIFocusState", EYILogLevel::err },
        { "CYIHTTPService", EYILogLevel::err },
        { "CYIHTTPServiceStats", EYILogLevel::err },
        { "CYIImageView", EYILogLevel::err },
        { "CYILRUCache", EYILogLevel::err },
        { "CYIPersistentStorePriv_Default", EYILogLevel::err },
        { "CYIPersistentCache", EYILogLevel::err },
        { "CYISceneManager", EYILogLevel::err },
        { "CYIScreenTransitionManager", EYILogLevel::err },
        { "CYISecureStorageBridgeDefault", EYILogLevel::err },
        { "CYITCPSocketPriv_Base", EYILogLevel::err },
        { "CYITransferHandle", EYILogLevel::err },
        { "DecoratorMap", EYILogLevel::err },
        { "EventDispatcherModule", EYILogLevel::err },
        { "MakeMethod_18ImageUtilityModule", EYILogLevel::err },
        { "NativeAnimatedNodesManager", EYILogLevel::err },
        { "NativeModuleBase", EYILogLevel::err },
        { "TimingModule", EYILogLevel::err },
        { "Transfer", EYILogLevel::err },
        { "ShadowTree", EYILogLevel::err },
        { "UIManagerModule", EYILogLevel::err },

        // Info messages
        { "JavaScript", EYILogLevel::info },

        // Suppressed messages
        { "CYISceneNode", EYILogLevel::off },
        { "CYIAssetManager", EYILogLevel::off },
        { "CYITextRendererFT", EYILogLevel::off },
        { "CYITextRendererFT::AddFont", EYILogLevel::off },
        { "IComponentManager", EYILogLevel::off },
        { "ReactComponent", EYILogLevel::off },
        { "TextUtilities", EYILogLevel::off },
        { "TimingModule", EYILogLevel::off },

    // by default, only warnings and errors are logged
    }, EYILogLevel::debug));

    CYINetworkConfiguration config;

    config.SetResponseCacheSize(oneMegabyteInBytes * 12);
    config.SetPersistentCacheSize(0);

    CYIHTTPService::GetInstance()->Start(config);
    CYIHTTPService::GetInstance()->ClearCache();

#if !defined(YI_MINI_GLOG)
    // miniglog defines this using a non-const char * causing a compile error and it has no implementation anyway.
    static bool isGoogleLoggingInitialized = false;
    if (!isGoogleLoggingInitialized)
    {
        google::InitGoogleLogging("--logtostderr=1");
        isGoogleLoggingInitialized = true;
    }
#endif

    std::unique_ptr<JsBundleLoader>pBundleLoader(GetBundler());

    PlatformApp::SetJsBundleLoader(std::move(pBundleLoader));

    bool result = PlatformApp::UserInit();

    GetBridge().AddModule<AirplayModule>();
    GetBridge().AddModule<DevicePowerManagementBridgeModule>();
    GetBridge().AddModule<DimensionsModule>();
    GetBridge().AddModule<GoogleCastModule>();
    GetBridge().AddModule<InteractionModule>();
    GetBridge().AddModule<OrientationLockModule>();
    GetBridge().AddModule<PrepareVideoModule>();
    GetBridge().AddModule<TrackpadModule>();

    // DRM Modules
    GetBridge().AddModule<FairPlayDrmHandlerModule>();
    GetBridge().AddModule<WidevineCustomRequestDrmHandlerModule>();

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
