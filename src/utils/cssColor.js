// Browser-only: lets the browser parse any CSS color (named, hsl(), ...)
// into the #rrggbb / rgba() forms that utils/color.js reads.
let ctx = null;

export function normalizeCssColor(value) {
  if (typeof value !== "string" || typeof document === "undefined")
    return value;
  ctx = ctx || document.createElement("canvas").getContext("2d");
  if (!ctx) return value;
  // fillStyle ignores invalid colors, so two different sentinels tell a
  // rejected value apart from one that happens to equal the sentinel.
  for (const sentinel of ["#000001", "#000002"]) {
    ctx.fillStyle = sentinel;
    ctx.fillStyle = value;
    if (ctx.fillStyle !== sentinel) return ctx.fillStyle;
  }
  return value;
}
