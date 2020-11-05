#ifdef YI_TVOS

#ifndef _YOUIREACT_TRACKPAD_GESTURE_H_
#define _YOUIREACT_TRACKPAD_GESTURE_H_

#import <GameController/GameController.h>
#import <UIKit/UIKit.h>

@interface TrackpadGestureRecognizer : UIPanGestureRecognizer

@end

@interface TrackpadGesture : NSObject

@property (nonatomic, strong) TrackpadGestureRecognizer *touchRecognizer;

@end

#endif // _YOUIREACT_TRACKPAD_GESTURE_H_

#endif // YI_TVOS
