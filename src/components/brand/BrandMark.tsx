import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  size?: number;
};

/** Vector-style brand mark: bloom petals + video lens (matches generated PNG assets). */
export function BrandMark({ size = 76 }: Props) {
  const petalW = size * 0.22;
  const petalH = size * 0.42;
  const center = size / 2;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.petalSlot,
            {
              width: size,
              height: size,
              transform: [{ rotate: `${i * 60}deg` }],
            },
          ]}
        >
          <LinearGradient
            colors={["#3b82f6", "#6366f1", "#7c3aed"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.petal,
              {
                width: petalW,
                height: petalH,
                borderRadius: petalW,
                top: size * 0.04,
                left: center - petalW / 2,
              },
            ]}
          />
        </View>
      ))}

      <View
        style={[
          styles.lensOuter,
          {
            width: size * 0.52,
            height: size * 0.52,
            borderRadius: size * 0.26,
          },
        ]}
      />
      <LinearGradient
        colors={["#2563eb", "#7c3aed"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.lensMid,
          {
            width: size * 0.38,
            height: size * 0.38,
            borderRadius: size * 0.19,
          },
        ]}
      />
      <View
        style={[
          styles.lensInner,
          {
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
          },
        ]}
      />
      <LinearGradient
        colors={["#60a5fa", "#a78bfa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.lensCore,
          {
            width: size * 0.13,
            height: size * 0.13,
            borderRadius: size * 0.065,
          },
        ]}
      />
      <View
        style={[
          styles.highlight,
          {
            width: size * 0.11,
            height: size * 0.06,
            borderRadius: size * 0.05,
            top: size * 0.33,
            left: size * 0.28,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  petalSlot: {
    position: "absolute",
  },
  petal: {
    position: "absolute",
    opacity: 0.92,
  },
  lensOuter: {
    position: "absolute",
    backgroundColor: "#12121a",
  },
  lensMid: {
    position: "absolute",
  },
  lensInner: {
    position: "absolute",
    backgroundColor: "#09090b",
  },
  lensCore: {
    position: "absolute",
  },
  highlight: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.28)",
    transform: [{ rotate: "-24deg" }],
  },
});
