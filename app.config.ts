import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Blumen Meet",
  slug: "blumen-meet",
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  scheme: "blumenmeet",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.blumenmeet.app",
    infoPlist: {
      UIBackgroundModes: ["audio", "voip", "fetch"],
      NSCameraUsageDescription: "Blumen Meet needs camera access for video meetings.",
      NSMicrophoneUsageDescription: "Blumen Meet needs microphone access for meetings.",
      NSBluetoothAlwaysUsageDescription: "Blumen Meet uses Bluetooth for headsets during calls.",
      NSBluetoothPeripheralUsageDescription: "Blumen Meet uses Bluetooth audio during meetings.",
    },
  },
  android: {
    package: "com.blumenmeet.app",
    adaptiveIcon: {
      backgroundColor: "#09090b",
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
    },
    permissions: [
      "CAMERA",
      "RECORD_AUDIO",
      "MODIFY_AUDIO_SETTINGS",
      "FOREGROUND_SERVICE",
      "FOREGROUND_SERVICE_MICROPHONE",
      "FOREGROUND_SERVICE_CAMERA",
      "FOREGROUND_SERVICE_PHONE_CALL",
      "WAKE_LOCK",
      "POST_NOTIFICATIONS",
      "BLUETOOTH",
      "BLUETOOTH_CONNECT",
      "READ_PHONE_STATE",
      "CALL_PHONE",
    ],
  },
  plugins: [
    "expo-router",
    "expo-dev-client",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#09090b",
        image: "./assets/splash-icon.png",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow Blumen Meet to use your camera for video calls.",
        microphonePermission: "Allow Blumen Meet to use your microphone for calls.",
      },
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/icon.png",
        color: "#7c3aed",
      },
    ],
    "@livekit/react-native-expo-plugin",
  ],
  extra: {
    router: { origin: false },
    eas: {
      projectId: "392ca9a4-b1ef-49d8-b660-b19cdcb2c8fa",
    },
  },
};

export default config;
