import { Platform } from "react-native";
import {
  LevelPlay,
  LevelPlayInitRequest,
  LevelPlayInterstitialAd,
  LevelPlayRewardedAd,
} from "unity-levelplay-mediation";

const LEVELPLAY_APP_KEY = "293fd5edd";

const INTERSTITIAL_AD_UNIT_ID = "cf0648nxjnuh0rx8";
const REWARDED_AD_UNIT_ID = "khh276svsaums90f";

let initializationPromise = null;
let isInitialized = false;

let interstitialAd = null;
let rewardedAd = null;

let pendingRewardCallback = null;

const loadAdSafely = (ad, name) => {
  if (!ad) return;

  Promise.resolve()
    .then(() => ad.loadAd())
    .catch((error) => {
      console.warn(`${name} load error:`, error);
    });
};

function createInterstitialAd() {
  interstitialAd = new LevelPlayInterstitialAd(
    INTERSTITIAL_AD_UNIT_ID
  );

  interstitialAd.setListener({
    onAdLoaded: () => {
      console.log("LevelPlay: Interstitial loaded");
    },

    onAdLoadFailed: (error) => {
      console.warn("LevelPlay: Interstitial load failed:", error);
    },

    onAdDisplayed: () => {
      console.log("LevelPlay: Interstitial displayed");
    },

    onAdDisplayFailed: (error) => {
      console.warn("LevelPlay: Interstitial display failed:", error);
      loadAdSafely(interstitialAd, "Interstitial");
    },

    onAdClicked: () => {
      console.log("LevelPlay: Interstitial clicked");
    },

    onAdClosed: () => {
      console.log("LevelPlay: Interstitial closed");
      loadAdSafely(interstitialAd, "Interstitial");
    },

    onAdInfoChanged: () => {},
  });

  loadAdSafely(interstitialAd, "Interstitial");
}

function createRewardedAd() {
  rewardedAd = new LevelPlayRewardedAd(
    REWARDED_AD_UNIT_ID
  );

  rewardedAd.setListener({
    onAdLoaded: () => {
      console.log("LevelPlay: Rewarded ad loaded");
    },

    onAdLoadFailed: (error) => {
      console.warn("LevelPlay: Rewarded load failed:", error);
    },

    onAdDisplayed: () => {
      console.log("LevelPlay: Rewarded ad displayed");
    },

    onAdDisplayFailed: (error) => {
      console.warn("LevelPlay: Rewarded display failed:", error);
      pendingRewardCallback = null;
      loadAdSafely(rewardedAd, "Rewarded");
    },

    onAdRewarded: (reward, adInfo) => {
      console.log("LevelPlay: Reward earned:", reward);

      if (pendingRewardCallback) {
        pendingRewardCallback(reward, adInfo);
        pendingRewardCallback = null;
      }
    },

    onAdClosed: () => {
      console.log("LevelPlay: Rewarded ad closed");

      loadAdSafely(rewardedAd, "Rewarded");
    },

    onAdClicked: () => {
      console.log("LevelPlay: Rewarded ad clicked");
    },

    onAdInfoChanged: () => {},
  });

  loadAdSafely(rewardedAd, "Rewarded");
}

export function initializeLevelPlay() {
  if (Platform.OS !== "android") {
    return Promise.resolve(false);
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise((resolve) => {
    if (__DEV__) {
      LevelPlay.setAdaptersDebug(true);
    }

    const initRequest = LevelPlayInitRequest
      .builder(LEVELPLAY_APP_KEY)
      .build();

    LevelPlay.setMetaData("UnityAds_coppa", ["true"]);

    LevelPlay.init(initRequest, {
      onInitSuccess: () => {
        console.log("LevelPlay initialized successfully");

        isInitialized = true;

        createInterstitialAd();
        createRewardedAd();

        resolve(true);
      },

      onInitFailed: (error) => {
        console.warn("LevelPlay initialization failed:", error);

        isInitialized = false;
        initializationPromise = null;

        resolve(false);
      },
    });
  });

  return initializationPromise;
}

export async function showInterstitialAd() {
  if (!isInitialized || !interstitialAd) {
    console.warn("LevelPlay is not initialized.");
    return false;
  }

  try {
    const ready = await interstitialAd.isAdReady();

    if (!ready) {
      loadAdSafely(interstitialAd, "Interstitial");
      return false;
    }

    await interstitialAd.showAd();
    return true;
  } catch (error) {
    console.warn("Unable to show interstitial:", error);
    return false;
  }
}

export async function showRewardedAd(onReward) {
  if (!isInitialized || !rewardedAd) {
    console.warn("LevelPlay is not initialized.");
    return false;
  }

  try {
    const ready = await rewardedAd.isAdReady();

    if (!ready) {
      loadAdSafely(rewardedAd, "Rewarded");
      return false;
    }

    pendingRewardCallback =
      typeof onReward === "function" ? onReward : null;

    await rewardedAd.showAd();
    return true;
  } catch (error) {
    pendingRewardCallback = null;
    console.warn("Unable to show rewarded ad:", error);
    return false;
  }
}

export function isLevelPlayInitialized() {
  return isInitialized;
}
