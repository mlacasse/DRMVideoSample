#ifndef _DEVICE_POWER_MANAGEMENT_BRIDGE_MODULE_H_
#define _DEVICE_POWER_MANAGEMENT_BRIDGE_MODULE_H_

#include "youireact/NativeModule.h"

class YI_RN_MODULE(DevicePowerManagementBridgeModule)
{
public:
  YI_RN_EXPORT_NAME(DevicePowerManagementBridge);

  YI_RN_EXPORT_METHOD(keepDeviceScreenOn)
  (bool bKeepOn);
};

#endif // _DEVICE_POWER_MANAGEMENT_BRIDGE_MODULE_H_