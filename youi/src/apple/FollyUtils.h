#if defined(YI_IOS) || defined(YI_TVOS) || defined(YI_OSX)

#ifndef _FOLLY_UTILS_H_
#define _FOLLY_UTILS_H_

#include <folly/dynamic.h>

#import <Foundation/Foundation.h>

@interface FollyUtils : NSObject
id convertFollyDynamic(const folly::dynamic &dyn);
@end

#endif /* _FOLLY_UTILS_H_ */

#endif
