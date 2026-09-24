import { useCallback, useState } from "react";

function useRefresh(refreshFunction) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (refreshing) {
      return;
    }

    try {
      setRefreshing(true);

      await refreshFunction();
    } catch (error) {
      console.warn("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshFunction, refreshing]);

  return {
    refreshing,
    onRefresh,
  };
}

export default useRefresh;
