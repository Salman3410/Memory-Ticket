import { getDeviceInfo } from "../utils/deviceInfo";
import { getNetworkInfo } from "./networkService";

export const getAppEnvironmentInfo = async () => {
  const [device, network] = await Promise.all([getDeviceInfo(), getNetworkInfo()]);

  return {
    device,
    network,
  }
};
