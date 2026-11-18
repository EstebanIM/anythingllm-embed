// Shared classes for the chat bubbles, so HistoricalMessage and PromptReply
// stay visually identical. Values come from the Portal GC design system.
// Bubble backgrounds and shapes live in main.jsx (USER_STYLES /
// ASSISTANT_STYLES) because they depend on the branding.
import { readableTextColor, linkColor, indicatorColor } from "@/utils/color";
import { normalizeCssColor } from "@/utils/cssColor";

/**
 * Inline style for a bubble on `background`: the text color plus the link
 * and typing-dot colors (CSS variables read by Head.jsx), all derived from
 * the same background so they stay legible on any brand color.
 */
export function bubbleColorStyle(background) {
  const bg = normalizeCssColor(background);
  return {
    backgroundColor: background,
    color: readableTextColor(bg),
    "--allm-link": linkColor(bg),
    "--allm-indicator": indicatorColor(bg),
  };
}

// Inherit the host page's font: inside the Portal that is its local Inter.
export const BUBBLE_FONT = "allm-font-[family-name:inherit]";
export const BUBBLE_ROW = "allm-py-[6px]";
export const BUBBLE_PADDING = "allm-py-[10px] allm-px-[14px]";
export const ASSISTANT_NAME = `${BUBBLE_FONT} allm-text-[12px] allm-font-normal allm-text-[#5F6368] allm-ml-4 allm-mb-1 allm-text-left`;
const TIMESTAMP = `${BUBBLE_FONT} allm-text-[11px] allm-text-[#5F6368] allm-mt-1`;
export const TIMESTAMP_ASSISTANT = `${TIMESTAMP} allm-ml-4 allm-text-left`;
export const TIMESTAMP_USER = `${TIMESTAMP} allm-mr-4 allm-text-right`;
export const ERROR_BUBBLE =
  "allm-bg-[#FEF2F2] allm-rounded-t-[16px] allm-rounded-br-[16px] allm-rounded-bl-[6px] allm-mr-[48px] allm-ml-3";
export const ERROR_TEXT = "allm-text-[#B91C1C] allm-text-sm";
