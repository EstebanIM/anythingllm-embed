// Colors for chat bubbles, from the Portal GC design system.
export const TEXT_ON_LIGHT = "#1B2A41";
export const TEXT_ON_DARK = "#FFFFFF";
const PORTAL_LINK = "#155FC4";
const PORTAL_MUTED = "#5F6368";

// The chat window behind every bubble is white, so translucent colors are
// composited over it.
const compositeOverWhite = ([r, g, b, a]) =>
  [r, g, b].map((v) => v * a + (1 - a));

function parseHex(color) {
  const match = color.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!match) return null;
  let hex = match[1];
  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join("");
  if (hex.length === 6) hex += "ff";
  return [0, 2, 4, 6].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

// rgb()/rgba() with comma or space syntax and an optional alpha.
function parseRgb(color) {
  const match = color.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*([\d.]+)(%?))?\s*\)$/i
  );
  if (!match) return null;
  const [r, g, b] = match
    .slice(1, 4)
    .map((v) => Math.min(Number(v), 255) / 255);
  let a = match[4] === undefined ? 1 : Number(match[4]);
  if (match[5] === "%") a /= 100;
  return [r, g, b, Math.min(Math.max(a, 0), 1)];
}

/** RGB channels in 0..1, or null when the string is not a color we read. */
function parseColor(color) {
  if (typeof color !== "string") return null;
  const value = color.trim();
  const rgba = parseHex(value) || parseRgb(value);
  return rgba ? compositeOverWhite(rgba) : null;
}

// WCAG 2.x relative luminance.
function luminance(rgb) {
  const [r, g, b] = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(parseColor(a)), luminance(parseColor(b))].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The text color with the higher contrast on `background`. A background we
 * cannot read is treated as the white chat window (an invalid CSS color is
 * dropped by the browser), so it gets the dark text. Named and hsl() colors
 * must be normalized first (see cssColor.js).
 */
export function readableTextColor(background) {
  if (!parseColor(background)) return TEXT_ON_LIGHT;
  return contrastRatio(TEXT_ON_DARK, background) >=
    contrastRatio(TEXT_ON_LIGHT, background)
    ? TEXT_ON_DARK
    : TEXT_ON_LIGHT;
}

const backgroundOrWhite = (background) =>
  parseColor(background) ? background : "#FFFFFF";

/** Portal action blue when it reaches AA (4.5:1), otherwise the text color. */
export function linkColor(background) {
  const bg = backgroundOrWhite(background);
  return contrastRatio(PORTAL_LINK, bg) >= 4.5
    ? PORTAL_LINK
    : readableTextColor(bg);
}

/** Portal grey for graphics such as the typing dots when it reaches 3:1. */
export function indicatorColor(background) {
  const bg = backgroundOrWhite(background);
  return contrastRatio(PORTAL_MUTED, bg) >= 3
    ? PORTAL_MUTED
    : readableTextColor(bg);
}
