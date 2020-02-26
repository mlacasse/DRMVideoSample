#ifdef YI_IOS

#ifndef AppDelegate_h
#define AppDelegate_h

#import <Apple/youilabsAppDelegate.h>
#import <UIKit/UIKit.h>

#import <GoogleCast/GCKLogger.h>
#include "AirplayView.h"

@interface AppDelegate : youilabsAppDelegate <GCKLoggerDelegate>

- (void)addAirplayView;
- (void)removeAirplayView;
- (void)showAirplayDeviceOptions: (CGRect) airplayFrame;

@end

#endif /* AppDelegate_h */

#endif // YI_IOS
