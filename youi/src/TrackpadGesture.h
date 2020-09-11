#ifdef YI_TVOS

#ifndef _YOUIREACT_TRACKPAD_GESTURE_H_
#define _YOUIREACT_TRACKPAD_GESTURE_H_

#import <UIKit/UIKit.h>

@interface TrackpadGestureRecognizer : UIGestureRecognizer

@end

@interface TrackpadGesture : NSObject

    @property (nonatomic, strong) TrackpadGestureRecognizer *touchRecognizer;

    - (void) addGestureRecognizers;
    - (void) removeGestureRecognizers;

@end

#endif // _YOUIREACT_TRACKPAD_GESTURE_H_

#endif // YI_TVOS
