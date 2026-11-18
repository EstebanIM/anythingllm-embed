// Text colors for chat bubbles, from the Portal GC design system.
export const TEXT_ON_LIGHT = "#1B2A41";
export const TEXT_ON_DARK = "#FFFFFF";

function parseHex(color) {
  if (typeof color !== "string") return null;
  const match = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const hex =
    match[1].length === 3
      ? [...match[1]].map((c) => c + c).join("")
      : match[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

// WCAG 2.x relative luminance.
function luminance(rgb) {
  const [r, g, b] = rgb.map((v) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(parseHex(a)), luminance(parseHex(b))].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The text color with the higher contrast on `background`. An invalid
 * background is dropped by the browser and the bubble shows on the white
 * chat window, so it gets the dark text.
 */
export function readableTextColor(background) {
  if (!parseHex(background)) return TEXT_ON_LIGHT;
  return contrastRatio(TEXT_ON_DARK, background) >=
    contrastRatio(TEXT_ON_LIGHT, background)
    ? TEXT_ON_DARK
    : TEXT_ON_LIGHT;
}
