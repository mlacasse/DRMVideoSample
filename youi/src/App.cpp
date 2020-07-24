// © You i Labs Inc. 2000-2019. All rights reserved.
#include "App.h"

#include "DevicePowerManagementBridgeModule.h"
#include "DimensionsModule.h"
#include "OrientationLockModule.h"
#include "TrackpadModule.h"

#include <automation/YiWebDriverLocator.h>

#include <cxxreact/JSBigString.h>
#include <glog/logging.h>

#include <logging/YiLogger.h>
#include <logging/YiLoggerHelper.h>
#include <framework/YiFramework.h>

#include <youireact/modules/drm/FairPlayDrmHandlerModule.h>
#include <youireact/modules/drm/WidevineCustomRequestDrmHandlerModule.h>

#include <network/YiHTTPService.h>

#include <JSBundlingStrings.h>

App::App() = default;

App::~App() = default;

using namespace yi::react;

bool App::UserInit()
{
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

    // Setup Logging Preferences
    
    // App wide Log preferences
    CYILogger::SetLevel(EYILogLevel::debug);
    
    // Now create and install our logging filter.
    CYILogger::PushFilter(CYILogger::CreateFilter({
        { "CYIAssetDecoderTemplate", EYILogLevel::err },
        { "CYIAssetDownloadHelper", EYILogLevel::err },
        { "CYIExoPlayer", EYILogLevel::err },
        { "CYIFocusState", EYILogLevel::err },
        { "CYIImageView", EYILogLevel::err },
        { "CYIListView", EYILogLevel::err },
        { "CYILRUCache", EYILogLevel::err },
        { "CYIPersistentStorePriv_Default", EYILogLevel::err },
        { "CYIPersistentCache", EYILogLevel::err },
        { "CYIScreenTransitionManager", EYILogLevel::err },
        { "CYISecureStorageBridgeDefault", EYILogLevel::err },
        { "AccessibilityInfoModule", EYILogLevel::err },
        { "DecoratorMap", EYILogLevel::err },
        { "EventDispatcherModule", EYILogLevel::err },
        { "MakeMethod_18ImageUtilityModule", EYILogLevel::err },
        { "NativeAnimatedNodesManager", EYILogLevel::err },
        { "NativeModuleBase", EYILogLevel::err },
        { "TimingModule", EYILogLevel::err },
        { "Transfer", EYILogLevel::err },
        { "ShadowLinearGradientView", EYILogLevel::err },
        { "ShadowTree", EYILogLevel::err },
        { "StorageModuleImplementation", EYILogLevel::err },
        { "UIManagerModule", EYILogLevel::err },
        { "YiAEFilterUtilities::SetTextNodeData", EYILogLevel::err },

        // Networking
        { "CYIHTTPService", EYILogLevel::err },
        { "CYIHTTPServiceStats", EYILogLevel::err },
        { "CYIHTTPServicePriv_Default", EYILogLevel::err },
        { "CYIHTTPResponseCache", EYILogLevel::err },
        { "CYIHTTPServicePriv", EYILogLevel::err },
        { "CYITCPSocketPrivBase", EYILogLevel::err },
        { "CYITransferHandle", EYILogLevel::err },
        
        // Debug messages
        { "LocationManagerDelegate", EYILogLevel::debug },
        { "GeoLocationModule", EYILogLevel::debug },
        { "ShadowLinearGradientView", EYILogLevel::debug },
        
        // Info messages
        { "JavaScript", EYILogLevel::info },
        
        // Suppressed messages
        { "CYISceneManager", EYILogLevel::off },
        { "CYISceneNode", EYILogLevel::off },
        { "CYIAssetManager", EYILogLevel::off },
        { "CYITextRendererFT", EYILogLevel::off },
        { "CYITextRendererFT::AddFont", EYILogLevel::off },
        { "CYITimelinePriv", EYILogLevel::off },
        { "CYITimelinePriv::Init", EYILogLevel::off },
        { "EventDispatcherModule", EYILogLevel::off },
        { "IComponentManager", EYILogLevel::off },
        { "ReactComponent", EYILogLevel::off },
        { "ServerCommand", EYILogLevel::off },
        { "ShadowTree", EYILogLevel::off },
        { "TextUtilities", EYILogLevel::off },
        { "TimingModule", EYILogLevel::off },
        { "UIManagerModule", EYILogLevel::off },
        { "YiDeleteLater", EYILogLevel::off },

    // by default, only warnings and errors are logged
    }, EYILogLevel::debug));

    CYINetworkConfiguration config;

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

    GetBridge().AddModule<FairPlayDrmHandlerModule>();
    GetBridge().AddModule<WidevineCustomRequestDrmHandlerModule>();
    GetBridge().AddModule<DevicePowerManagementBridgeModule>();
    GetBridge().AddModule<DimensionsModule>();
    GetBridge().AddModule<OrientationLockModule>();
    GetBridge().AddModule<TrackpadModule>();

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
