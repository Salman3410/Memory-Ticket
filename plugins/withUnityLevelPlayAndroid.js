
const {
  withAppBuildGradle,
  withAndroidManifest,
} = require("@expo/config-plugins");

const requiredDependencies = [
  "implementation 'com.unity3d.ads-mediation:unityads-adapter:5.15.0'",
  "implementation 'com.google.android.gms:play-services-ads-identifier:18.0.1'",
  "implementation 'com.google.android.gms:play-services-appset:16.0.2'",
];

function withUnityLevelPlayAndroid(config) {
  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Add Unity Ads native dependencies.
    const missingDependencies = requiredDependencies.filter(
      (dependency) => !contents.includes(dependency)
    );

    if (missingDependencies.length > 0) {
      const match = contents.match(/\bdependencies\s*\{/);

      if (!match || match.index === undefined) {
        throw new Error(
          "Could not find the Android app dependencies block."
        );
      }

      const insertPosition = match.index + match[0].length;

      contents =
        contents.slice(0, insertPosition) +
        "\n    " +
        missingDependencies.join("\n    ") +
        "\n" +
        contents.slice(insertPosition);
    }

    // Align WorkManager versions to prevent duplicate classes.
    const marker = "// MEMENTO_WORKMANAGER_VERSION_ALIGNMENT";

    if (!contents.includes(marker)) {
      contents += `
${marker}
configurations.configureEach {
    resolutionStrategy {
        force 'androidx.work:work-runtime:2.8.1'
        force 'androidx.work:work-runtime-ktx:2.8.1'
    }
}
`;
    }

    config.modResults.contents = contents;

    return config;
  });

  // Add Android advertising ID permission.
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    const permissions = manifest["uses-permission"] || [];

    const adIdPermission =
      "com.google.android.gms.permission.AD_ID";

    const alreadyAdded = permissions.some(
      (permission) =>
        permission.$?.["android:name"] === adIdPermission
    );

    if (!alreadyAdded) {
      permissions.push({
        $: {
          "android:name": adIdPermission,
        },
      });
    }

    manifest["uses-permission"] = permissions;

    return config;
  });

  return config;
}

module.exports = withUnityLevelPlayAndroid;
