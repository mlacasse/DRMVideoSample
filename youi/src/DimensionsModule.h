#ifndef _DIMENSIONS_MODULE_H_
#define _DIMENSIONS_MODULE_H_

#include <signal/YiSignalHandler.h>
#include <youireact/NativeModule.h>

class YI_RN_MODULE(DimensionsModule)
{
public:
    YI_RN_EXPORT_NAME(Dimensions);
    DimensionsModule();

private:
    float ratio;

    void InitReactNativeView();
    void OnSurfaceSizeChanged(int32_t width, int32_t height);
};

#endif
