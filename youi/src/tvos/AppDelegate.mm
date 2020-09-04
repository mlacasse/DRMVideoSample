#ifdef YI_TVOS

#import "AppDelegate.h"

#import <apple/YiRootViewController.h>

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

#include <logging/YiLogger.h>

#define LOG_TAG "AppDelegate"

@interface AppDelegate()
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary<UIApplicationLaunchOptionsKey, id> *)launchOptions
{
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end

#endif // YI_TVOS
