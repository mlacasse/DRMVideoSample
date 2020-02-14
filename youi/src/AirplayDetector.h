#ifdef YI_IOS

#ifndef AirplayDetector_h
#define AirplayDetector_h

#import <Foundation/NSObject.h>

@interface  AirplayDetector : NSObject

+ (id)getSharedAirplayDetector;
- (void)startAirplayObserver;
- (void)stopAirplayObserver;
- (BOOL)isAirplayAvailable;
- (BOOL)isAirplayConnected;
- (BOOL)isAirplayObserverActive;

@end

#endif /* AirplayDetector_h */

#endif // YI_IOS
