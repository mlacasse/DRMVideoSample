#include "DevicePowerManagementBridgeModule.h"

#include <platform/YiDeviceBridgeLocator.h>
#include <platform/YiDevicePowerManagementBridge.h>

YI_RN_INSTANTIATE_MODULE(DevicePowerManagementBridgeModule);

YI_RN_DEFINE_EXPORT_METHOD(DevicePowerManagementBridgeModule, keepDeviceScreenOn)
(bool bKeepOn)
{
  CYIDevicePowerManagementBridge *pPowerBridge = CYIDeviceBridgeLocator::GetDevicePowerManagementBridge();
  if (pPowerBridge)
  {
    pPowerBridge->KeepDeviceScreenOn(bKeepOn);
  }
}