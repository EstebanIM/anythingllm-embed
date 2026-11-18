import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isSingleLine,
  bubbleRadiusClass,
  fieldRadiusClass,
} from "./bubbleShape.js";

test("fieldRadiusClass is a pill while the message fits on one line", () => {
  assert.equal(fieldRadiusClass(true), "allm-rounded-full");
});

test("fieldRadiusClass uses 20px corners from the second line on", () => {
  assert.equal(fieldRadiusClass(false), "allm-rounded-[20px]");
});

test("isSingleLine is true when the content is one line tall", () => {
  assert.equal(isSingleLine({ contentHeight: 20, lineHeight: 20 }), true);
});

test("isSingleLine tolerates sub-pixel and inline-element growth", () => {
  assert.equal(isSingleLine({ contentHeight: 22.5, lineHeight: 20 }), true);
});

test("isSingleLine is false from the second line on", () => {
  assert.equal(isSingleLine({ contentHeight: 40, lineHeight: 20 }), false);
  assert.equal(isSingleLine({ contentHeight: 84, lineHeight: 20 }), false);
});

test("isSingleLine falls back to the multi-line shape when it cannot measure", () => {
  assert.equal(isSingleLine({ contentHeight: 0, lineHeight: 20 }), false);
  assert.equal(isSingleLine({ contentHeight: 20, lineHeight: NaN }), false);
});

test("bubbleRadiusClass is a full pill for single-line bubbles of both roles", () => {
  assert.equal(bubbleRadiusClass("user", true), "allm-rounded-full");
  assert.equal(bubbleRadiusClass("assistant", true), "allm-rounded-full");
});

test("bubbleRadiusClass keeps 16px corners with a 6px tail toward the speaker", () => {
  assert.equal(
    bubbleRadiusClass("user", false),
    "allm-rounded-t-[16px] allm-rounded-bl-[16px] allm-rounded-br-[6px]"
  );
  assert.equal(
    bubbleRadiusClass("assistant", false),
    "allm-rounded-t-[16px] allm-rounded-br-[16px] allm-rounded-bl-[6px]"
  );
});
