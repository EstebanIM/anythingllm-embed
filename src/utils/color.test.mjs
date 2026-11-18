import { test } from "node:test";
import assert from "node:assert/strict";
import { contrastRatio, readableTextColor } from "./color.js";

const round2 = (n) => Math.round(n * 100) / 100;

test("contrastRatio matches the WCAG values used by the Portal", () => {
  assert.equal(round2(contrastRatio("#FFFFFF", "#1A73E8")), 4.51);
  assert.equal(round2(contrastRatio("#1B2A41", "#F4F5F6")), 13.23);
});

test("contrastRatio does not depend on argument order", () => {
  assert.equal(
    contrastRatio("#1A73E8", "#FFFFFF"),
    contrastRatio("#FFFFFF", "#1A73E8")
  );
});

test("readableTextColor picks navy on the Portal's light grey", () => {
  assert.equal(readableTextColor("#F4F5F6"), "#1B2A41");
});

test("readableTextColor picks white on dark and brand backgrounds", () => {
  assert.equal(readableTextColor("#1B2B44"), "#FFFFFF");
  assert.equal(readableTextColor("#1A73E8"), "#FFFFFF");
  assert.equal(readableTextColor("#0b1f3a"), "#FFFFFF");
});

test("readableTextColor accepts short hex in any case", () => {
  assert.equal(readableTextColor("#09F"), readableTextColor("#0099ff"));
});

test("readableTextColor falls back to navy for invalid backgrounds", () => {
  // An invalid background is ignored by the browser, so the bubble sits on white.
  assert.equal(readableTextColor("azul"), "#1B2A41");
  assert.equal(readableTextColor(""), "#1B2A41");
  assert.equal(readableTextColor(undefined), "#1B2A41");
});
