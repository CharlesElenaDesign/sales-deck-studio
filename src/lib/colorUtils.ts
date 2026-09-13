export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexA) + 0.05;
  const lB = relativeLuminance(hexB) + 0.05;
  return lA > lB ? lA / lB : lB / lA;
}

/** Returns hex unchanged if it has enough contrast against background, otherwise the fallback. */
export function ensureAccessible(hex: string, backgroundHex: string, fallback: string, minRatio = 4.5): string {
  return contrastRatio(hex, backgroundHex) >= minRatio ? hex : fallback;
}

export function isValidHex(hex: string | undefined): hex is string {
  return !!hex && /^#[0-9a-fA-F]{6}$/.test(hex);
}

export function readableTextOn(backgroundHex: string): string {
  return contrastRatio("#ffffff", backgroundHex) >= contrastRatio("#0f0f0f", backgroundHex) ? "#ffffff" : "#0f0f0f";
}

function componentToHex(c: number): string {
  return Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0");
}

/** Lightens a hex color toward white by `amount` (0-1). Used to derive tint surfaces from an
 * arbitrary brand color without hand-picking a matching pastel. */
export function mixWithWhite(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => c + (255 - c) * amount;
  return `#${componentToHex(mix(r))}${componentToHex(mix(g))}${componentToHex(mix(b))}`;
}

/** Darkens a hex color toward black by `amount` (0-1). */
export function mixWithBlack(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => c * (1 - amount);
  return `#${componentToHex(mix(r))}${componentToHex(mix(g))}${componentToHex(mix(b))}`;
}

/** Hue angle (0-360) of a hex color, ignoring saturation/lightness. Used as a lightweight,
 * honest proxy for a brand color's "energy" (warm vs. cool vs. green) — not a real brand
 * voice analysis, just a nod to the client's own visual identity when picking story tone. */
export function hexToHue(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  return hue < 0 ? hue + 360 : hue;
}

/** Saturation (0-1) and lightness (0-1) of a hex colour, HSL model. */
function hexToSaturationLightness(hex: string): { s: number; l: number } {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { s, l };
}

/**
 * Plain-language name for a hex colour ("deep navy", "bright orange", "charcoal").
 * Image generators respond far better to words than to hex codes, so prompts carry both.
 */
export function describeColor(hex: string): string {
  if (!isValidHex(hex)) return "neutral grey";
  const { s, l } = hexToSaturationLightness(hex);
  const h = hexToHue(hex);

  if (l < 0.08) return "black";
  if (l > 0.94) return "white";
  if (s < 0.12) {
    if (l < 0.25) return "charcoal";
    if (l < 0.5) return "dark grey";
    if (l < 0.75) return "mid grey";
    return "silver grey";
  }

  let name: string;
  if (h < 12 || h >= 345) name = "red";
  else if (h < 40) name = "orange";
  else if (h < 65) name = "yellow";
  else if (h < 100) name = "lime green";
  else if (h < 160) name = "green";
  else if (h < 190) name = "teal";
  else if (h < 205) name = "cyan";
  else if (h < 250) name = "blue";
  else if (h < 275) name = "indigo";
  else if (h < 300) name = "purple";
  else if (h < 330) name = "magenta";
  else name = "crimson";

  if (name === "blue" && l < 0.3) return "deep navy";
  if (name === "indigo" && l < 0.3) return "deep indigo";
  if (name === "purple" && l < 0.3) return "deep purple";
  if (name === "green" && l < 0.3) return "forest green";
  if (name === "teal" && l < 0.3) return "petrol teal";

  const tone = l < 0.3 ? "deep " : l > 0.7 ? "pale " : s > 0.75 && l > 0.4 ? "bright " : "";
  return `${tone}${name}`;
}
