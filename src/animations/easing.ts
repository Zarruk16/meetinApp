import { Easing } from "react-native-reanimated";

/** Premium motion curves — smooth deceleration like native iOS. */
export const premiumEasing = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.25, 0.1, 0.25, 1),
  cinematic: Easing.bezier(0.16, 1, 0.3, 1),
};

export const introTiming = {
  bgFade: 800,
  logoReveal: 900,
  nameReveal: 600,
  taglineReveal: 500,
  loaderStart: 400,
  minHold: 3200,
  exitFade: 700,
} as const;
