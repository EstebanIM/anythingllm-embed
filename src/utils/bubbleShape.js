// Bubble shape: a full pill for one-line messages, 16px corners with a 6px
// tail toward the speaker for longer ones.

/**
 * True when the bubble's content is a single line. Half a line of tolerance
 * absorbs sub-pixel rounding and inline elements (code, bold) that grow the
 * line box slightly. Anything we cannot measure keeps the multi-line shape.
 */
export function isSingleLine({ contentHeight, lineHeight }) {
  if (!(contentHeight > 0) || !(lineHeight > 0)) return false;
  return contentHeight < lineHeight * 1.5;
}

// Static strings so Tailwind generates every class.
const PILL = "allm-rounded-full";
const USER_CORNERS =
  "allm-rounded-t-[16px] allm-rounded-bl-[16px] allm-rounded-br-[6px]";
const ASSISTANT_CORNERS =
  "allm-rounded-t-[16px] allm-rounded-br-[16px] allm-rounded-bl-[6px]";

export function bubbleRadiusClass(role, singleLine) {
  if (singleLine) return PILL;
  return role === "user" ? USER_CORNERS : ASSISTANT_CORNERS;
}
