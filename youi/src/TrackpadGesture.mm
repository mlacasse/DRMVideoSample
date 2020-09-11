#ifdef YI_TVOS

#include "TrackpadModule.h"

#include <event/YiTrackpadEvent.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>
#include <utility/YiUtilities.h>
#include <youireact/ReactNativePlatformApp.h>

#import "TrackpadGesture.h"

#import <apple/YiRootViewController.h>
#import <UIKit/UIGestureRecognizerSubclass.h>

using namespace yi::react;

#define LOG_TAG "TrackpadGesture"

CYISignal<std::shared_ptr<CYITrackpadEvent>> TrackpadModule::EmitTrackpadEvent;

@implementation TrackpadGestureRecognizer

- (void) touchesBegan: (NSSet *) touches withEvent: (UIEvent *) event
{
    [super touchesBegan: touches withEvent: event];

    std::shared_ptr<CYITrackpadEvent> pEvent = std::make_shared<CYITrackpadEvent>(CYIEvent::Type::TrackpadDown);
    pEvent->m_eventTimeMs = YiGetTimeuS() / 1000;

    TrackpadModule::EmitTrackpadEvent.Emit(pEvent);
}

- (void) touchesMoved: (NSSet *) touches withEvent: (UIEvent *) event
{
    [super touchesMoved: touches withEvent: event];
}

- (void) touchesEnded: (NSSet *) touches withEvent: (UIEvent *) event
{
    [super touchesEnded: touches withEvent: event];

    std::shared_ptr<CYITrackpadEvent> pEvent = std::make_shared<CYITrackpadEvent>(CYIEvent::Type::TrackpadUp);
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

