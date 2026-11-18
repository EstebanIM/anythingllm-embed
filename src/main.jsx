import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { parseStylesSrc } from "./utils/constants.js";
import { initI18n } from "./i18n.js";

const appElement = document.createElement("div");
document.body.appendChild(appElement);

const scriptSettings = Object.assign(
  {},
  document?.currentScript?.dataset || {}
);

export const embedderSettings = {
  settings: scriptSettings,
  stylesSrc: parseStylesSrc(document?.currentScript?.src),
  USER_STYLES: {
    // Defaults follow the Portal GC palette. Text color is not set here: the
    // bubbles derive it from msgBg (utils/color.js) so any brand stays legible.
    msgBg: scriptSettings?.userBgColor ?? "#1A73E8",
    base: `allm-rounded-t-[16px] allm-rounded-bl-[16px] allm-rounded-br-[6px] allm-ml-[48px] allm-mr-3`,
  },
  ASSISTANT_STYLES: {
    msgBg: scriptSettings?.assistantBgColor ?? "#F4F5F6",
    base: `allm-rounded-t-[16px] allm-rounded-br-[16px] allm-rounded-bl-[6px] allm-mr-[48px] allm-ml-3`,
  },
};

// Initialize i18n after settings are available
initI18n(scriptSettings);

const root = ReactDOM.createRoot(appElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
