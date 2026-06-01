/**
 * Generates Blumen Meet app icon, splash, Android adaptive icons, and web favicons from SVG.
 * Run: npm run generate:brand
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");
const webPublicDir = path.join(__dirname, "..", "..", "blumen_meet", "public");
const webAppDir = path.join(__dirname, "..", "..", "blumen_meet", "src", "app");

const BRAND = {
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#7c3aed",
  dark: "#09090b",
  darkMid: "#12121a",
};

function logoSvg({ size, monochrome = false, showBackground = false }) {
  const cx = size / 2;
  const cy = size / 2;
  const grad = monochrome
    ? `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#ffffff"/></linearGradient>`
    : `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${BRAND.blue}"/><stop offset="55%" stop-color="${BRAND.indigo}"/><stop offset="100%" stop-color="${BRAND.violet}"/></linearGradient>`;

  const petals = Array.from({ length: 6 })
    .map((_, i) => {
      const rot = i * 60;
      return `<ellipse cx="${cx}" cy="${size * 0.22}" rx="${size * 0.095}" ry="${size * 0.19}" fill="url(#g)" opacity="0.94" transform="rotate(${rot} ${cx} ${cy})"/>`;
    })
    .join("\n");

  const bg = showBackground
    ? `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${BRAND.dark}"/>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${grad}</defs>
  ${bg}
  ${petals}
  <circle cx="${cx}" cy="${cy}" r="${size * 0.26}" fill="${BRAND.darkMid}"/>
  <circle cx="${cx}" cy="${cy}" r="${size * 0.19}" fill="url(#g)"/>
  <circle cx="${cx}" cy="${cy}" r="${size * 0.11}" fill="${BRAND.dark}"/>
  <circle cx="${cx}" cy="${cy}" r="${size * 0.065}" fill="url(#g)" opacity="0.9"/>
  <ellipse cx="${cx - size * 0.04}" cy="${cy - size * 0.04}" rx="${size * 0.055}" ry="${size * 0.03}" fill="white" opacity="0.22" transform="rotate(-24 ${cx - size * 0.04} ${cy - size * 0.04})"/>
</svg>`;
}

/** Matches Android adaptive icon background layer. */
function androidBackgroundSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c1222"/>
      <stop offset="100%" stop-color="#1e1033"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" fill="url(#glow)"/>
</svg>`;
}

/** Flatten Android adaptive foreground + background for iOS / web square icons. */
function composedAppIconSvg(size) {
  const fg = logoSvg({ size, showBackground: false });
  const bg = androidBackgroundSvg(size);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <foreignObject width="${size}" height="${size}">${bg.replace(/<\?xml[^>]*>/, "")}</foreignObject>
  <foreignObject width="${size}" height="${size}">${fg.replace(/<\?xml[^>]*>/, "")}</foreignObject>
</svg>`;
}

async function renderPng(svg, outPath, width, height = width) {
  const sharp = (await import("sharp")).default;
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(outPath);
  console.log("wrote", path.relative(process.cwd(), outPath));
}

async function writeWebIcons(appIconSvg) {
  if (!fs.existsSync(path.dirname(webPublicDir))) {
    console.warn("skip web icons — blumen_meet/public not found");
    return;
  }

  fs.mkdirSync(webPublicDir, { recursive: true });
  fs.mkdirSync(webAppDir, { recursive: true });

  const sizes = [
    { file: "favicon.png", w: 32 },
    { file: "favicon-16x16.png", w: 16 },
    { file: "favicon-32x32.png", w: 32 },
    { file: "apple-touch-icon.png", w: 180 },
    { file: "android-chrome-192x192.png", w: 192 },
    { file: "android-chrome-512x512.png", w: 512 },
  ];

  for (const { file, w } of sizes) {
    await renderPng(appIconSvg, path.join(webPublicDir, file), w);
  }

  // Next.js App Router file-based metadata (same asset as mobile launcher)
  await renderPng(appIconSvg, path.join(webAppDir, "icon.png"), 512);
  await renderPng(appIconSvg, path.join(webAppDir, "apple-icon.png"), 180);
}

async function main() {
  fs.mkdirSync(assetsDir, { recursive: true });

  const appIcon1024 = logoSvg({ size: 1024, showBackground: true });
  const composed1024 = composedAppIconSvg(1024);

  // iOS + legacy single icon (dark rounded square + bloom)
  await renderPng(appIcon1024, path.join(assetsDir, "icon.png"), 1024);
  // Same look as Android adaptive (gradient bg + logo) — used for web composed icons
  await renderPng(composed1024, path.join(assetsDir, "icon-composed.png"), 1024);

  await renderPng(logoSvg({ size: 512 }), path.join(assetsDir, "splash-icon.png"), 512);
  await renderPng(logoSvg({ size: 432 }), path.join(assetsDir, "android-icon-foreground.png"), 432);
  await renderPng(androidBackgroundSvg(432), path.join(assetsDir, "android-icon-background.png"), 432);
  await renderPng(logoSvg({ size: 432, monochrome: true }), path.join(assetsDir, "android-icon-monochrome.png"), 432);
  await renderPng(appIcon1024, path.join(assetsDir, "favicon.png"), 96);

  await writeWebIcons(composed1024);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
