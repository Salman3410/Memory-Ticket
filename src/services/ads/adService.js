import mobileAds from "react-native-google-mobile-ads";

let initialized = false;

export async function initializeAds() {
  if (initialized) {
    return;
  }

  try {
    await mobileAds().initialize();

    initialized = true;
  } catch (error) {
    console.error("Failed to initialize AdMob:", error);
  }
}
