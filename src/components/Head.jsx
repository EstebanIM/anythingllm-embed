import { embedderSettings } from "@/main";

const hljsCss = `
pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}/*!
  Theme: GitHub Dark Dimmed
  Description: Dark dimmed theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Colors taken from GitHub's CSS
*/.hljs{color:#adbac7;background:#22272e}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#f47067}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#dcbdfb}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#6cb6ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#96d0ff}.hljs-built_in,.hljs-symbol{color:#f69d50}.hljs-code,.hljs-comment,.hljs-formula{color:#768390}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#8ddb8c}.hljs-subst{color:#adbac7}.hljs-section{color:#316dca;font-weight:700}.hljs-bullet{color:#eac55f}.hljs-emphasis{color:#adbac7;font-style:italic}.hljs-strong{color:#adbac7;font-weight:700}.hljs-addition{color:#b4f1b4;background-color:#1b4721}.hljs-deletion{color:#ffd8d3;background-color:#78191b}
`;

const customCss = `
  /**
   * ==============================================
   * Dot Falling
   * ==============================================
   */
  .allm-dot-falling {
    position: relative;
    left: -9999px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--allm-indicator, #5F6368);
    color: #5fa4fa;
    box-shadow: 9999px 0 0 0 var(--allm-indicator, #5F6368);
    animation: dot-falling 1.5s infinite linear;
    animation-delay: 0.1s;
  }

  .allm-dot-falling::before,
  .allm-dot-falling::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 0;
  }

  .allm-dot-falling::before {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--allm-indicator, #5F6368);
    color: var(--allm-indicator, #5F6368);
    animation: dot-falling-before 1.5s infinite linear;
    animation-delay: 0s;
  }

  .allm-dot-falling::after {
    width: 10px;
    height: 10px;
    border-radius: 5px;
    background-color: var(--allm-indicator, #5F6368);
    color: var(--allm-indicator, #5F6368);
    animation: dot-falling-after 1.5s infinite linear;
    animation-delay: 0.2s;
  }

  @keyframes dot-falling {
    0% {
      box-shadow: 9999px -15px 0 0 rgba(152, 128, 255, 0);
    }
    25%,
    50%,
    75% {
      box-shadow: 9999px 0 0 0 var(--allm-indicator, #5F6368);
    }
    100% {
      box-shadow: 9999px 15px 0 0 rgba(152, 128, 255, 0);
    }
  }

  @keyframes dot-falling-before {
    0% {
      box-shadow: 9984px -15px 0 0 rgba(152, 128, 255, 0);
    }
    25%,
    50%,
    75% {
      box-shadow: 9984px 0 0 0 var(--allm-indicator, #5F6368);
    }
    100% {
      box-shadow: 9984px 15px 0 0 rgba(152, 128, 255, 0);
    }
  }

  @keyframes dot-falling-after {
    0% {
      box-shadow: 10014px -15px 0 0 rgba(152, 128, 255, 0);
    }
    25%,
    50%,
    75% {
      box-shadow: 10014px 0 0 0 var(--allm-indicator, #5F6368);
    }
    100% {
      box-shadow: 10014px 15px 0 0 rgba(152, 128, 255, 0);
    }
  }

  #chat-history::-webkit-scrollbar,
  #chat-container::-webkit-scrollbar,
  .allm-no-scroll::-webkit-scrollbar {
    display: none !important;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  #chat-history,
  #chat-container,
  .allm-no-scroll {
    -ms-overflow-style: none !important; /* IE and Edge */
    scrollbar-width: none !important; /* Firefox */
  }

  span.allm-whitespace-pre-line>p {
    margin: 0px;
  }

  /* Links in bubbles. Assistant: the Portal's --action blue, or the text
     color when the bubble is too dark for it (--allm-link, set per bubble).
     User: the bubble is already blue, so the link keeps the text color. */
  .allm-anything-llm-assistant-message a {
    color: var(--allm-link, #155FC4);
    text-decoration: underline;
  }
  .allm-anything-llm-user-message a {
    color: inherit;
    text-decoration: underline;
  }

  /* Opening the chat: a short fade and lift from the launcher's corner, so
     the eye follows where the window came from. Portal overlay timing. */
  @keyframes allm-chat-in {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to { opacity: 1; transform: none; }
  }
  .allm-chat-enter {
    animation: allm-chat-in 240ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Launcher: on hover or keyboard focus it opens toward the page and shows
     its label, so the icon alone is never the only explanation. */
  /* The pill grows to the label's measured width (--allm-label-w), so the
     motion lasts its whole duration instead of stopping early. The text
     fades in a beat after the pill starts opening and leaves quickly. */
  #anything-llm-embed-chat-button .allm-launcher-label {
    max-width: 0;
    opacity: 0;
    transform: translateX(6px);
    overflow: hidden;
    white-space: nowrap;
    transition: max-width 360ms cubic-bezier(0.2, 0, 0, 1),
      margin 360ms cubic-bezier(0.2, 0, 0, 1),
      transform 360ms cubic-bezier(0.2, 0, 0, 1),
      opacity 120ms ease-out;
  }
  #anything-llm-embed-chat-button:hover .allm-launcher-label,
  #anything-llm-embed-chat-button:focus-visible .allm-launcher-label {
    max-width: var(--allm-label-w, 240px);
    opacity: 1;
    transform: none;
    margin-inline: 6px 12px;
    transition: max-width 360ms cubic-bezier(0.2, 0, 0, 1),
      margin 360ms cubic-bezier(0.2, 0, 0, 1),
      transform 360ms cubic-bezier(0.2, 0, 0, 1),
      opacity 240ms ease-out 80ms;
  }

  /* Options menu: a quick fade and drop from the ⋮ button. */
  @keyframes allm-menu-in {
    from { opacity: 0; transform: translateY(-4px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
  .allm-menu-enter {
    transform-origin: top right;
    animation: allm-menu-in 160ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Header icon buttons: 44px hit area, 32px round chip that tints on
     hover and stays tinted while its menu is open. */
  .allm-header-btn .allm-chip {
    transition: background-color 120ms ease-out, color 120ms ease-out;
  }
  .allm-header-btn:hover .allm-chip,
  .allm-header-btn[aria-expanded="true"] .allm-chip {
    background-color: #F4F5F6;
    color: #1B2A41;
  }
  .allm-header-btn:focus-visible .allm-chip {
    outline: 2px solid #1A73E8;
    outline-offset: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    .allm-chat-enter, .allm-menu-enter { animation: none; }
    #anything-llm-embed-chat-button .allm-launcher-label,
    #anything-llm-embed-chat-button:hover .allm-launcher-label,
    #anything-llm-embed-chat-button:focus-visible .allm-launcher-label,
    .allm-header-btn .allm-chip { transition: none; }
  }
`;

export default function Head() {
  return (
    <head>
      <style>{hljsCss}</style>
      <style>{customCss}</style>
      <link rel="stylesheet" href={embedderSettings.stylesSrc} />
    </head>
  );
}
