import * as Device from "expo-device";

export const getDeviceInfo = () => {
    return {
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName, 
        modelId: Device.modelId,
        deviceType: Device.deviceType,
        osName: Device.osName,
        osVersion: Device.osVersion,
        totalMemory: Device.totalMemory,
        supportedCpuArchitectures: Device.supportedCpuArchitectures,
    }
} 