#ifdef YI_IOS

#ifndef _APP_DELEGATE_H
#define _APP_DELEGATE_H

#import <Apple/youilabsAppDelegate.h>
#import <GoogleCast/GoogleCast.h>

@interface AppDelegate : youilabsAppDelegate <GCKLoggerDelegate>
@end

#endif

#endif
