#ifdef YI_TVOS

#include "TrackpadModule.h"

#include <event/YiEvent.h>
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
CYISignal<TrackpadModule::Direction, bool> TrackpadModule::EmitTrackpadDpadEvent;

@implementation TrackpadGestureRecognizer

- (void) touchesBegan: (NSSet<UITouch *> *) touches withEvent: (UIEvent *) event
{
    [super touchesBegan:touches withEvent:event];

    std::shared_ptr<CYITrackpadEvent> pEvent = std::make_shared<CYITrackpadEvent>(CYIEvent::Type::TrackpadDown);
    pEvent->m_eventTimeMs = YiGetTimeuS() / 1000;

    TrackpadModule::EmitTrackpadEvent.Emit(pEvent);
}

- (void) touchesEnded: (NSSet<UITouch *> *) touches withEvent: (UIEvent *) event
{
    [super touchesEnded:touches withEvent:event];

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
        _touchRecognizer = [[TrackpadGestureRecognizer alloc] initWithTarget:self action:nil];
        [_touchRecognizer setAllowedTouchTypes:@[@(UITouchTypeIndirect)]];

        UIView *parentView = [[YiRootViewController sharedInstance] view];
        [parentView addGestureRecognizer:_touchRecognizer];

        for (GCController *controller in GCController.controllers)
        {
            [self configureController:controller];
        }

        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(controllerConnected:) name:GCControllerDidConnectNotification object:nil];
    }

    return self;
}

- (void)controllerConnected:(NSNotification *)notification {
    (void)notification;

    for (GCController *controller in GCController.controllers)
    {
        [self configureController:controller];
    }
}

- (void)configureController:(GCController *)controller {
    if (GCMicroGamepad *microGamepad = controller.microGamepad)
    {
        microGamepad.reportsAbsoluteDpadValues = true;
        microGamepad.dpad.up.valueChangedHandler = ^(GCControllerButtonInput * _Nonnull button, float value, BOOL pressed)
        {
            TrackpadModule::EmitTrackpadDpadEvent(TrackpadModule::Direction::Up, pressed);
        };

        microGamepad.dpad.down.valueChangedHandler = ^(GCControllerButtonInput * _Nonnull button, float value, BOOL pressed)
        {
            TrackpadModule::EmitTrackpadDpadEvent(TrackpadModule::Direction::Down, pressed);
        };

        microGamepad.dpad.left.valueChangedHandler = ^(GCControllerButtonInput * _Nonnull button, float value, BOOL pressed)
        {
            TrackpadModule::EmitTrackpadDpadEvent(TrackpadModule::Direction::Left, pressed);
        };

        microGamepad.dpad.right.valueChangedHandler = ^(GCControllerButtonInput * _Nonnull button, float value, BOOL pressed)
        {
            TrackpadModule::EmitTrackpadDpadEvent(TrackpadModule::Direction::Right, pressed);
        };
    }
}

@end

static TrackpadGesture* pGestureRecognizer = nil;

void TrackpadModule::StartObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadMove, this);

    TrackpadModule::EmitTrackpadEvent.Connect(*this, &TrackpadModule::OnEmitTrackpadEvent);
    TrackpadModule::EmitTrackpadDpadEvent.Connect(*this, &TrackpadModule::OnEmitTrackpadDpadEvent);

    if (pGestureRecognizer == nil)
    {
        pGestureRecognizer = [[TrackpadGesture alloc] init];
    }
}

void TrackpadModule::StopObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadMove, this);

    TrackpadModule::EmitTrackpadEvent.Disconnect(*this, &TrackpadModule::OnEmitTrackpadEvent);
    TrackpadModule::EmitTrackpadDpadEvent.Disconnect(*this, &TrackpadModule::OnEmitTrackpadDpadEvent);

    if (pGestureRecognizer)
    {
        pGestureRecognizer = nil;
    }
}

#endif

