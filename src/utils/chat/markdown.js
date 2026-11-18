import { encode as HTMLEncode } from "he";
import markdownIt from "markdown-it";
import { staticHljs as hljs } from "./hljs";
import { v4 } from "uuid";

// Lucide "copy" (v1.67.0, ISC) as a string: code blocks are rendered to HTML,
// not React, so the lucide-react component cannot be used here.
const COPY_ICON =
  '<svg class="allm-h-3 allm-w-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

const markdown = markdownIt({
  html: false,
  typographer: true,
  highlight: function (code, lang) {
    const uuid = v4();
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<div class="allm-w-full allm-rounded-lg allm-bg-[#1e1e1e] allm-font-mono allm-text-sm allm-text-[#d4d4d4] allm-mb-4 allm-relative">
            <div class="allm-absolute allm-top-0 allm-left-0 allm-right-0 allm-flex allm-items-center allm-justify-between allm-px-4 allm-py-1 allm-text-xs allm-font-sans allm-bg-[#2d2d2d] allm-rounded-t-lg">
              <span class="allm-text-xs allm-text-[#858585] allm-font-medium">${lang}</span>
              <button data-code-snippet data-code="code-${uuid}" class="allm-border-none allm-min-w-[52px] allm-h-[22px] allm-flex allm-items-center allm-justify-center allm-gap-x-1 allm-bg-[#ffffff14] allm-text-[#858585] hover:allm-text-white hover:allm-bg-[#ffffff20] allm-px-1.5 allm-rounded allm-transition-colors allm-cursor-pointer">
                ${COPY_ICON}
                <span class="allm-text-xs">Copy</span>
              </button>
            </div>
            <div class="allm-overflow-x-auto allm-max-w-full">
              <pre class="allm-px-4 -allm-mt-10 allm-whitespace-pre-wrap allm-break-words"><code class="allm-max-w-full allm-inline-block">` +
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
          "</code></pre></div></div>"
        );
      } catch (__) {}
    }

    return (
      `<div class="allm-w-full allm-rounded-lg allm-bg-[#1e1e1e] allm-font-mono allm-text-sm allm-text-[#d4d4d4] allm-mb-4 allm-relative">
        <div class="allm-absolute allm-top-0 allm-left-0 allm-right-0 allm-flex allm-items-center allm-justify-between allm-px-4 allm-py-1 allm-text-xs allm-font-sans allm-bg-[#2d2d2d] allm-rounded-t-lg">
          <span class="allm-text-xs allm-text-[#858585] allm-font-medium">plaintext</span>
          <button data-code-snippet data-code="code-${uuid}" class="allm-border-none allm-min-w-[52px] allm-h-[22px] allm-flex allm-items-center allm-justify-center allm-gap-x-1 allm-bg-[#ffffff14] allm-text-[#858585] hover:allm-text-white hover:allm-bg-[#ffffff20] allm-px-1.5 allm-rounded allm-transition-colors allm-cursor-pointer">
            ${COPY_ICON}
            <span class="allm-text-xs">Copy</span>
          </button>
        </div>
        <div class="allm-overflow-x-auto allm-max-w-full">
          <pre class="allm-px-4 -allm-mt-10 allm-whitespace-pre-wrap allm-break-words"><code class="allm-max-w-full allm-inline-block">` +
      HTMLEncode(code) +
      "</code></pre></div></div>"
    );
  },
})
  // Disabled rules:
  //  - "list":     Render <ol>/<ul> items as plain text so we can keep
  //                numbering from responses without forcing an HTML
  //                structure on them.
  //  - "lheading": Setext headings (`Title\n===` / `Title\n---`) flip
  //                the previous paragraph into <h1>/<h2> the moment a
  //                single `=` or `-` lands in a streaming chunk, then
  //                revert when more chunk content arrives. That round-
  //                trip is the dominant cause of the visible "size jump"
  //                during streaming. ATX headings (`#`, `##`, ...) are
  //                unaffected.
  .disable(["list", "lheading"]);

// Custom renderer rule to make links open in new tab
markdown.renderer.rules.link_open = (tokens, idx) => {
  const token = tokens[idx];
  const href = token.attrs.find((attr) => attr[0] === "href");
  return `<a href="${href[1]}" target="_blank" rel="noopener noreferrer">`;
};

export default function renderMarkdown(text = "") {
  return markdown.render(text);
}
