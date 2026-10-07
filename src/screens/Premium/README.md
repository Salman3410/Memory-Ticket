# Memento Premium billing setup

Memento uses RevenueCat for App Store / Google Play subscriptions.

## Local Expo environment

Set these public RevenueCat SDK keys in the environment used to build Memento:

- EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
- EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY

Never put a RevenueCat secret API key in the mobile app.

## RevenueCat dashboard

Create one entitlement:

- Identifier: premium

Create two subscription products and attach both to the premium entitlement:

- Monthly: PKR 200/month
- Annual: PKR 1,700/year

Put both products in the current/default offering. The app selects monthly/annual from that offering.

## Native development build

RevenueCat uses native code for real in-app purchases. Expo Go can preview the integration logic, but real purchases require a development build.

Install the dependencies:

```bash
npx expo install expo-dev-client react-native-purchases
```

Then build the native app:

```bash
npx expo prebuild
npx expo run:android
```

or:

```bash
npx expo prebuild
npx expo run:ios
```

For EAS, create/use a development build profile and build the app with EAS.

## Important

The app source now contains the purchase, restore, entitlement, and Premium UI flow. Store-side product creation, prices, and RevenueCat public API keys still have to be configured in Apple/Google and RevenueCat before a real transaction can complete.

