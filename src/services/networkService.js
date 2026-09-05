import * as Network from "expo-network";

export const getNetworkInfo = async () => {
  const [networkState, ipAddress] = await Promise.all([
    Network.getNetworkStateAsync(),
    Network.getIpAddressAsync(),
  ])

  const activeType = networkState.type ?? Network.NetworkStateType.UNKNOWN;

  return {
    isConnected: networkState.isConnected ?? false,
    isInternetReachable: networkState.isInternetReachable ?? false,
    type: activeType,
    ipAddress: ipAddress ?? null,

    isWifi: activeType === Network.NetworkStateType.WIFI,
    isCellular: activeType === Network.NetworkStateType.CELLULAR,
    isBluetooth: activeType === Network.NetworkStateType.BLUETOOTH,
    isEthernet: activeType === Network.NetworkStateType.ETHERNET,
    isVpn: activeType === Network.NetworkStateType.VPN,
  };
};
