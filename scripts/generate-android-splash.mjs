import { createRequire } from "module";
import { getConfig } from "@expo/config";
import fs from "fs";
import path from "path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const require = createRequire(import.meta.url);
const splashPluginBuild = path.join(
  projectRoot,
  "node_modules/expo-splash-screen/plugin/build"
);
const { getAndroidSplashConfig } = require(path.join(splashPluginBuild, "getAndroidSplashConfig.js"));
const { setSplashImageDrawablesAsync } = require(
  path.join(splashPluginBuild, "withAndroidSplashImages.js")
);
const androidMain = path.join(projectRoot, "android/app/src/main");

if (!fs.existsSync(androidMain)) {
  process.exit(0);
}

const { exp } = getConfig(projectRoot);
const plugin = exp.plugins?.find((p) => Array.isArray(p) && p[0] === "expo-splash-screen");
if (!plugin) {
  process.exit(0);
}

const splash = getAndroidSplashConfig(plugin[1] ?? {});
if (!splash.image && !splash.mdpi) {
  process.exit(0);
}

await setSplashImageDrawablesAsync(splash, projectRoot);
