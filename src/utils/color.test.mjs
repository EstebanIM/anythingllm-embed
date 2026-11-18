import { test } from "node:test";
import assert from "node:assert/strict";
import {
  contrastRatio,
  readableTextColor,
  linkColor,
  indicatorColor,
} from "./color.js";

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

test("readableTextColor reads rgb() and rgba() backgrounds", () => {
  assert.equal(readableTextColor("rgb(27, 43, 68)"), "#FFFFFF");
  assert.equal(readableTextColor("rgb(27 43 68)"), "#FFFFFF");
  assert.equal(readableTextColor("rgba(244, 245, 246, 1)"), "#1B2A41");
});

test("readableTextColor reads 4- and 8-digit hex, compositing alpha over white", () => {
  assert.equal(readableTextColor("#1b2b44ff"), "#FFFFFF");
  assert.equal(readableTextColor("#000a"), "#FFFFFF");
  // Nearly transparent black over the white window is still light.
  assert.equal(readableTextColor("#0000000d"), "#1B2A41");
});

test("linkColor keeps the Portal action blue on light bubbles", () => {
  assert.equal(linkColor("#F4F5F6"), "#155FC4");
});

test("linkColor falls back to the bubble text color on dark bubbles", () => {
  assert.equal(linkColor("#1B2B44"), "#FFFFFF");
});

test("indicatorColor keeps the Portal grey where it reaches 3:1", () => {
  assert.equal(indicatorColor("#F4F5F6"), "#5F6368");
});

test("indicatorColor switches to the bubble text color on dark bubbles", () => {
  assert.equal(indicatorColor("#1B2B44"), "#FFFFFF");
});
