import { useLayoutEffect, useRef, useState } from "react";
import { isSingleLine } from "@/utils/bubbleShape";

/**
 * Watches a bubble and reports whether its content fits on one line. It
 * measures the element marked `data-bubble-content` (the text, or the typing
 * indicator) and re-checks on resize, so a streaming reply turns from a pill
 * into the multi-line shape as soon as it wraps.
 */
export default function useSingleLine() {
  const ref = useRef(null);
  const [singleLine, setSingleLine] = useState(false);

  useLayoutEffect(() => {
    const bubble = ref.current;
    const content = bubble?.querySelector("[data-bubble-content]");
    if (!content) return;

    const measure = () => {
      const style = getComputedStyle(content);
      const lineHeight =
        parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
      setSingleLine(
        isSingleLine({
          contentHeight: content.getBoundingClientRect().height,
          lineHeight,
        })
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  });

  return [ref, singleLine];
}
