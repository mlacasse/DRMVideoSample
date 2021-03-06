#if defined(YI_IOS)
#include "DimensionsModule.h"

#include <framework/YiApp.h>
#include <framework/YiAppContext.h>
#include <youireact/YiReactNativeView.h>

#import <UIKit/UIKit.h>

using namespace yi::react;

DimensionsModule::DimensionsModule()
{
    SetSupportedEvents({ "change" });

    DimensionsModule::ratio = [[UIScreen mainScreen] scale];

    CYIAppContext::GetInstance()->GetApp()->SurfaceSizeChanged.Connect(*this, &DimensionsModule::OnSurfaceSizeChanged);

    InitReactNativeView();
}
#endif
