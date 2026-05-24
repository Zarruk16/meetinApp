/**
 * react-native-callkeep uses overloaded @ReactMethod names that crash under
 * React Native New Architecture (TurboModules) on Android RN 0.85+.
 * iOS CallKit still uses CallKeep; Android uses foreground notifications + InCallManager.
 */
module.exports = {
  dependencies: {
    "react-native-callkeep": {
      platforms: {
        android: null,
      },
    },
  },
};
