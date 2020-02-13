#ifdef YI_IOS

#import "AppDelegate.h"

#import <apple/YiRootViewController.h>

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@interface AppDelegate()

@property (nonatomic, strong) AirplayView *nativeAirPlayView;
@property (nonatomic, strong) UIView *componentKeyWindow;
@property (nonatomic, assign) NSUInteger detectAirplayWindowCount;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary<UIApplicationLaunchOptionsKey, id> *)launchOptions
{
    [[AVAudioSession sharedInstance] setCategory: AVAudioSessionCategoryPlayback error: nil];

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)addAirplayView
{
    if (!_nativeAirPlayView)
    {
        UIView *parentView = [[YiRootViewController sharedInstance] view];

        _nativeAirPlayView = [[AirplayView alloc] init];

        [parentView addSubview: _nativeAirPlayView];
        [parentView sendSubviewToBack: _nativeAirPlayView];
        
        _nativeAirPlayView.alpha = 0.0f;
    }
}

- (void)removeAirplayView
{
    if (_nativeAirPlayView)
    {
        [_nativeAirPlayView removeFromSuperview];
        _nativeAirPlayView = nil;
    }
}

- (void)showAirplayDeviceOptions: (CGRect) airplayFrame
{
    if (_nativeAirPlayView)
    {
        _nativeAirPlayView.frame = airplayFrame;
        
        for(UIView *subView in _nativeAirPlayView.subviews)
        {
            if([subView isKindOfClass:[UIButton class]])
            {
                [UIView animateWithDuration   : 1.0f
                                        delay : 0
                                      options : UIViewAnimationOptionTransitionNone
                                   animations :^{
                                       [(UIButton*)subView setHighlighted:YES];
                                   }
                                   completion : ^(BOOL finished)
                 {
                     if(finished)
                     {
                         // Set up an observer to monitor the status of the Airplay picker
                         [(UIButton*)subView sendActionsForControlEvents:UIControlEventTouchUpInside];
                     }
                 }];
            }
        }
    }
}

@end

#endif
