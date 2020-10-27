#ifdef YI_TVOS

#include "TrackpadModule.h"

#include <event/YiEvent.h>
#include <event/YiTrackpadEvent.h>
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
        _panRecognizer = [[TrackpadGestureRecognizer alloc] initWithTarget:self action:@selector(respondToPanRecognizer:)];

        _gestureView = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
        [_gestureView addGestureRecognizer:_panRecognizer];

        UIView *parentView = [[YiRootViewController sharedInstance] view];
        [parentView addSubview:_gestureView];

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

- (IBAction)respondToPanRecognizer:(UIPanGestureRecognizer *)recognizer
{
    const UIGestureRecognizerState state = [recognizer state];
    if (state == UIGestureRecognizerStateChanged)
    {
        // Get the data from the gesture recogniser
        const CGPoint translation = [recognizer translationInView:[YiRootViewController sharedInstance].view];
        const CGPoint velocity = [recognizer velocityInView:[YiRootViewController sharedInstance].view];

        // Create a trackpad event and populate it
        std::shared_ptr<CYITrackpadEvent> pEvent = std::make_shared<CYITrackpadEvent>(CYIEvent::Type::TrackpadMove);
        pEvent->m_eventTimeMs = YiGetTimeuS() / 1000;

        // Normalizing the translation and velocity by the screen bounds allows us to work independently of the device aspect ratio and resolution.
        CGRect screenBounds = [UIScreen mainScreen].bounds;
        pEvent->m_Translation.x = translation.x / screenBounds.size.width;
        pEvent->m_Translation.y = translation.y / screenBounds.size.height;
        pEvent->m_Velocity.x = velocity.x / screenBounds.size.width;
        pEvent->m_Velocity.y = velocity.y / screenBounds.size.height;

        // Emit the event
        TrackpadModule::EmitTrackpadEvent.Emit(pEvent);
    }
}

@end

static TrackpadGesture* pGestureRecognizer = nil;

void TrackpadModule::StartObserving()
{
    TrackpadModule::EmitTrackpadEvent.Connect(*this, &TrackpadModule::OnEmitTrackpadEvent);
    TrackpadModule::EmitTrackpadDpadEvent.Connect(*this, &TrackpadModule::OnEmitTrackpadDpadEvent);

    if (pGestureRecognizer == nil)
    {
        pGestureRecognizer = [[TrackpadGesture alloc] init];
    }
}

void TrackpadModule::StopObserving()
{
    TrackpadModule::EmitTrackpadEvent.Disconnect(*this, &TrackpadModule::OnEmitTrackpadEvent);
    TrackpadModule::EmitTrackpadDpadEvent.Disconnect(*this, &TrackpadModule::OnEmitTrackpadDpadEvent);

    if (pGestureRecognizer)
    {
        pGestureRecognizer = nil;
    }
}

#endif

