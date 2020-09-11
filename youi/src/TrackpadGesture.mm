#ifdef YI_TVOS

#include "TrackpadModule.h"

#include <event/YiEvent.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>
#include <utility/YiUtilities.h>
#include <youireact/ReactNativePlatformApp.h>

#import "TrackpadGesture.h"

#import <apple/YiRootViewController.h>
#import <UIKit/UIGestureRecognizerSubclass.h>

using namespace yi::react;

#define LOG_TAG "TrackpadGesture"

CYISignal<std::shared_ptr<CYIEvent>> TrackpadModule::EmitTrackpadEvent;

@implementation TrackpadGestureRecognizer

- (void) touchesBegan: (NSSet<UITouch *> *) touches withEvent: (UIEvent *) event
{
    std::shared_ptr<CYIEvent> pEvent = std::make_shared<CYIEvent>(CYIEvent::Type::TrackpadDown);
    pEvent->m_eventTimeMs = YiGetTimeuS() / 1000;

    TrackpadModule::EmitTrackpadEvent.Emit(pEvent);
}

- (void) touchesEnded: (NSSet<UITouch *> *) touches withEvent: (UIEvent *) event
{
    std::shared_ptr<CYIEvent> pEvent = std::make_shared<CYIEvent>(CYIEvent::Type::TrackpadUp);
    pEvent->m_eventTimeMs = YiGetTimeuS() / 1000;

    TrackpadModule::EmitTrackpadEvent.Emit(pEvent);
}

@end

@implementation TrackpadGesture

- (id) init
{
    if (self = [super init])
    {
         _touchRecognizer = [[TrackpadGestureRecognizer alloc] initWithTarget: self action: nil];
         [_touchRecognizer setAllowedTouchTypes: @[@(UITouchTypeIndirect)]];
    }

    return self;
}

- (void) addGestureRecognizers
{
      UIView *parentView = [[YiRootViewController sharedInstance] view];
      [parentView addGestureRecognizer: _touchRecognizer];
}

- (void) removeGestureRecognizers
{
      UIView *parentView = [[YiRootViewController sharedInstance] view];
      [parentView removeGestureRecognizer: _touchRecognizer];
}

@end

static TrackpadGesture* pGestureRecognizer = nil;

void TrackpadModule::StartObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadMove, this);

    TrackpadModule::EmitTrackpadEvent.Connect(*this, &TrackpadModule::OnEmitTrackpadEvent);

    if (pGestureRecognizer == nil)
    {
        pGestureRecognizer = [[TrackpadGesture alloc] init];
    }

    [pGestureRecognizer addGestureRecognizers];
}

void TrackpadModule::StopObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadMove, this);

    TrackpadModule::EmitTrackpadEvent.Disconnect(*this, &TrackpadModule::OnEmitTrackpadEvent);

    if (pGestureRecognizer)
    {
        [pGestureRecognizer removeGestureRecognizers];
    }
}

#endif

