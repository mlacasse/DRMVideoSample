#if defined(YI_IOS) || defined(YI_TVOS) || defined(YI_OSX)

#ifndef FOLLY_UTILS_H
#define FOLLY_UTILS_H

#include <folly/dynamic.h>

#import <Foundation/Foundation.h>

@interface FollyUtils : NSObject
id convertFollyDynamic(const folly::dynamic &dyn);
@end

#endif /* FOLLY_UTILS_H */

#endif
