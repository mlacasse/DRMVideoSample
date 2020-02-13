#ifdef YI_IOS

#import "AirplayView.h"

@implementation AirplayView

- (instancetype)init
{
    self = [super init];
    if (self)
    {
        self.showsRouteButton = YES;
        self.showsVolumeSlider = NO;
    }
    return self;
}
@end

#endif // YI_IOS
