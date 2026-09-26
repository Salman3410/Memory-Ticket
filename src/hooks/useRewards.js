import { useContext } from "react";
import { RewardsContext } from "../context/RewardsContext";

export function useRewards() {
  const context = useContext(RewardsContext);

  if (!context) {
    throw new Error("useRewards must be used inside RewardsProvider");
  }

  return context;
}
