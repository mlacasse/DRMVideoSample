#if defined(YI_IOS) || defined(YI_TVOS) || defined(YI_OSX)

#include "FollyUtils.h"
#include <folly/dynamic.h>

@implementation FollyUtils

// From https://github.com/facebook/react-native/blob/master/React/CxxUtils/RCTFollyConvert.mm
id convertFollyDynamic(const folly::dynamic &dyn) {
    switch (dyn.type()) {
        case folly::dynamic::NULLT:
            return (id)kCFNull;
        case folly::dynamic::BOOL:
            return dyn.asBool() ? @YES : @NO;
        case folly::dynamic::INT64:
            return @(dyn.asInt());
        case folly::dynamic::DOUBLE:
            return @(dyn.asDouble());
        case folly::dynamic::STRING:
            return [[NSString alloc] initWithBytes:dyn.c_str() length:dyn.size()
                                          encoding:NSUTF8StringEncoding];
        case folly::dynamic::ARRAY: {
            NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:dyn.size()];
            for (auto &elem : dyn) {
                [array addObject:convertFollyDynamic(elem)];
            }
            return array[0];
        }
        case folly::dynamic::OBJECT: {
            NSMutableDictionary *dict = [[NSMutableDictionary alloc] initWithCapacity:dyn.size()];
            for (auto &elem : dyn.items()) {
                dict[convertFollyDynamic(elem.first)] = convertFollyDynamic(elem.second);
            }
            return dict;
        }
    }
}

@end

#endif
