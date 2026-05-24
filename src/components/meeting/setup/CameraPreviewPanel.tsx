import { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { JoinAvatarFallback } from "./JoinSetupHeader";

type Props = {
  camOn: boolean;
  name: string;
  facing: "front" | "back";
};

export function CameraPreviewPanel({ camOn, name, facing }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const requested = useRef(false);

  useEffect(() => {
    if (camOn && !permission?.granted && !requested.current) {
      requested.current = true;
      requestPermission();
    }
  }, [camOn, permission?.granted, requestPermission]);

  const showCamera = camOn && permission?.granted;

  return (
    <View style={styles.wrap}>
      <View style={styles.frame}>
        {showCamera ? (
          <CameraView style={StyleSheet.absoluteFill} facing={facing} />
        ) : (
          <View style={styles.noVideo}>
            <JoinAvatarFallback name={name || "Guest"} size={80} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", marginVertical: 16 },
  frame: {
    width: "100%",
    aspectRatio: 3 / 4,
    maxHeight: 380,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "#18181b",
  },
  noVideo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18181b",
  },
});
