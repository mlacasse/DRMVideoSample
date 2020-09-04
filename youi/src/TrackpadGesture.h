#ifdef YI_TVOS

#ifndef _YOUIREACT_TRACKPAD_GESTURE_H_
#define _YOUIREACT_TRACKPAD_GESTURE_H_

#import <UIKit/UIKit.h>

@interface TrackpadDownGestureRecognizer : UIGestureRecognizer

@end

@interface TrackpadGesture : NSObject

    @property (nonatomic, strong) TrackpadDownGestureRecognizer *tapRecognizer;

    - (void) addGestureRecognizers;
    - (void) removeGestureRecognizers;

@end

#endif // _YOUIREACT_TRACKPAD_GESTURE_H_

#endif // YI_TVOS
