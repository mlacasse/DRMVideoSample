#ifdef YI_IOS

#import "AppDelegate.h"

#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>
#import <GoogleCast/GoogleCast.h>

#include <logging/YiLogger.h>
#include <logging/YiLoggerHelper.h>

#define LOG_TAG "AppDelegate"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary<UIApplicationLaunchOptionsKey, id> *)launchOptions {
    NSError *error = nil;
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:&error];
    if (error) {
        YI_LOGD(LOG_TAG, "Error setting AVAudioSessionCategory");
    }

    // Enable logger.
    [GCKLogger sharedInstance].delegate = self;
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

#pragma mark - GCKLoggerDelegate

- (void)logMessage:(NSString *)message
           atLevel:(GCKLoggerLevel)level
      fromFunction:(NSString *)function
          location:(NSString *)location {
    NSLog(@"%@ - %@, %@", function, message, location);
}

@end

#endif
