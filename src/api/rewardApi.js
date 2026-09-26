import { apiRequest } from "./apiClient";

export async function getWallet(token) {
  return apiRequest("/rewards/wallet", {
    method: "GET",
    token,
  });
}

export async function getRewardCatalog(token) {
  return apiRequest("/rewards/catalog", {
    method: "GET",
    token,
  });
}

export async function getCoinHistory(token, page = 1, limit = 20) {
  const safePage = Math.max(1, Number.parseInt(page, 10) || 1);

  const safeLimit = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 20));

  return apiRequest(`/rewards/history?page=${safePage}&limit=${safeLimit}`, {
    method: "GET",
    token,
  });
}

export async function redeemReward(token, rewardId, requestId = null) {
  if (!rewardId) {
    return {
      success: false,
      message: "Reward ID is required.",
      code: "INVALID_REWARD_ID",
    };
  }

  const body = {
    rewardId,
  };

  if (typeof requestId === "string" && requestId.trim()) {
    body.requestId = requestId.trim();
  }

  return apiRequest("/rewards/redeem", {
    method: "POST",
    token,
    body,
  });
}

export async function createAdSession(token) {
  return apiRequest("/ads/session", {
    method: "POST",
    token,
  });
}
