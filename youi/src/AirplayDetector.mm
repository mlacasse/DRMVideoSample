#ifdef YI_IOS

#import "AirplayDetector.h"

#include "AirplayService.h"
#include "AppDelegate.h"

#import <AVFoundation/AVAudioSession.h>
#import <MediaPlayer/MediaPlayer.h>

#import <apple/YiRootViewController.h>

@interface AirplayDetector()

@property (nonatomic) MPVolumeView *airplayView;
@property (nonatomic, assign) BOOL bIsObserverActive;
@end

@implementation AirplayDetector

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        _airplayView = [[MPVolumeView alloc] init];
        _airplayView.showsRouteButton = NO;
        _airplayView.showsVolumeSlider = NO;
        
        // Place an airplay button out of the window and then add it to our view, we will be able to receive the notifications without seeing it.
        CGRect frame = CGRectMake(-100, -100, 1, 1);
        _airplayView.frame = frame;
        
        _bIsObserverActive = FALSE;
    }
    
    return self;
}

+ (instancetype)getSharedAirplayDetector
{
    static AirplayDetector *sharedAirplayDetector = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedAirplayDetector = [[self alloc] init];
    });
    return sharedAirplayDetector;
}

- (void)dealloc
{
    [self stopAirplayObserver];
    _airplayView = nil;
}

- (void)startAirplayObserver
{
    if (!_bIsObserverActive)
    {
        UIView *parentView = [[YiRootViewController sharedInstance] view];
        [parentView addSubview: _airplayView];
        
        AppDelegate *delegate = static_cast<AppDelegate *>([[UIApplication sharedApplication] delegate]);
        // To monitor airplay activity, the native airplay view must be added (sub-viewed) for callbacks to properly
        // register with the native implementations.
        [delegate addAirplayView];
        
        NSNotificationCenter *center = [NSNotificationCenter defaultCenter];

        [center addObserver:self selector:@selector(wirelessRouteActive:)
                       name:MPVolumeViewWirelessRouteActiveDidChangeNotification object:nil];

        [center addObserver:self selector:@selector(wirelessAvailable:)
                       name:MPVolumeViewWirelessRoutesAvailableDidChangeNotification object:nil];
        
        _bIsObserverActive = TRUE;
    }
}

- (void)stopAirplayObserver
{
    if (_bIsObserverActive)
    {
        [_airplayView removeFromSuperview];
        
        // No longer monitoring airplay, remove the native airplay view.
        AppDelegate *delegate = static_cast<AppDelegate *>([[UIApplication sharedApplication] delegate]);
        [delegate removeAirplayView];
        
        NSNotificationCenter *center = [NSNotificationCenter defaultCenter];

        [center removeObserver:self name:MPVolumeViewWirelessRouteActiveDidChangeNotification object:nil];
        [center removeObserver:self name:MPVolumeViewWirelessRoutesAvailableDidChangeNotification object:nil];
            
        _bIsObserverActive = FALSE;
    }
}

// Selectors for both notification events
- (void)wirelessRouteActive:(NSNotification*)aNotification
{
    NSLog(@"%s: %@",__FUNCTION__, aNotification);
    AirplayService::GetInstance().AirplayConnectionStatusChanged([self isAirplayConnected]);
}

- (void)wirelessAvailable:(NSNotification*)aNotification
{
    NSLog(@"%s: %@",__FUNCTION__, aNotification);
    AirplayService::GetInstance().AirplayAvailabilityStatusChanged([_airplayView areWirelessRoutesAvailable]);
}

- (BOOL)isAirplayAvailable
{
    return [_airplayView areWirelessRoutesAvailable];
}

- (BOOL)isAirplayConnected
{
    BOOL bIsAirplayConnected = NO;
    AVAudioSession* audioSession = [AVAudioSession sharedInstance];
    AVAudioSessionRouteDescription* currentRoute = audioSession.currentRoute;
    for (AVAudioSessionPortDescription* outputPort in currentRoute.outputs)
    {
        if ([outputPort.portType isEqualToString:AVAudioSessionPortAirPlay])
        {
            bIsAirplayConnected = YES;
            break;
        }
    }
    return bIsAirplayConnected;
}

- (BOOL)isAirplayMirroring
{
    return [self isAirplayConnected] && [UIScreen screens].count > 1;
}

- (BOOL)isAirplayObserverActive
{
    return _bIsObserverActive;
}
@end

#endif // YI_IOS
