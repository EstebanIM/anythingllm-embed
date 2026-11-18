import { useEffect, useState } from "react";
import { embedderSettings } from "../main";

const DEFAULT_SETTINGS = {
  embedId: null, //required
  baseApiUrl: null, // required

  // Override properties that can be defined.
  prompt: null, // override
  model: null, // override
  temperature: null, //override
  showThoughts: false, // show the AI's thought process in responses.

  // style parameters
  chatIcon: "chatBubble",
  brandImageUrl: null, // will be forced into 100x50px container
  greeting: null, // empty chat window greeting.
  buttonColor: "#1A73E8", // Portal GC blue; any CSS color works
  userBgColor: "#2C2F35", // user text bubble color
  assistantBgColor: "#2563eb", // assistant text bubble color
  noSponsor: true, // Hide the sponsor footer unless branding provides one.
  sponsorText: null, // sponsor text (provided by platform branding).
  sponsorLink: null, // sponsor link (provided by platform branding).
  position: "bottom-right", // position of chat button/window
  assistantName: null, // assistant name (provided by platform branding).
  assistantIcon: null, // default assistant icon
  windowHeight: null, // height of chat window in number:css-prefix
  windowWidth: null, // width of chat window in number:css-prefix
  textSize: null, // text size in px (number only)
  noHeader: null, // If set, hide the header above the chatbox
  language: "en", // language of chat interface
  sendMessageText: null, // override text for send message button
  resetChatText: null, // override text for reset chat button

  // behaviors
  openOnLoad: "off", // or "on"
  supportEmail: null, // string of email for contact
  username: null, // The display or readable name set on a script
  defaultMessages: [], // list of strings for default messages.
};

// Branding keys sourced from the platform (Branding & Whitelabeling). They are
// merged UNDER any explicit data-* attribute, so a script tag can still override
// them, but OVER the widget defaults so the stock AnythingLLM branding is gone.
const BRANDING_KEYS = [
  "assistantName",
  "brandImageUrl",
  "assistantIcon",
  "buttonColor",
  "userBgColor",
  "assistantBgColor",
  "sponsorText",
  "sponsorLink",
  "noSponsor",
];

/**
 * Fetches the platform white-label branding for this embed. Never throws:
 * returns {} on any failure so the widget can still boot with neutral defaults.
 * @param {string} baseApiUrl
 * @param {string} embedId
 * @returns {Promise<object>}
 */
async function fetchPlatformBranding(baseApiUrl, embedId) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${baseApiUrl}/${embedId}/branding`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return {};

    const data = await res.json();
    // Keep only known keys with a meaningful value. `null` means "not
    // configured" and must never clobber a default or an explicit data-* value.
    const branding = {};
    for (const key of BRANDING_KEYS) {
      if (!data.hasOwnProperty(key)) continue;
      if (data[key] === null || data[key] === undefined) continue;
      branding[key] = data[key];
    }
    return branding;
  } catch (e) {
    console.error("[AnythingLLM Embed] Failed to load platform branding.", e);
    return {};
  }
}

export default function useGetScriptAttributes() {
  const [settings, setSettings] = useState({
    loaded: false,
    ...DEFAULT_SETTINGS,
  });

  useEffect(() => {
    async function fetchAttribs() {
      if (!document) return false;
      if (
        !embedderSettings.settings.baseApiUrl ||
        !embedderSettings.settings.embedId
      )
        throw new Error(
          "[AnythingLLM Embed Module::Abort] - Invalid script tag setup detected. Missing required parameters for boot!"
        );

      const scriptSettings = parseAndValidateEmbedSettings(
        embedderSettings.settings
      );
      const platformBranding = await fetchPlatformBranding(
        embedderSettings.settings.baseApiUrl,
        embedderSettings.settings.embedId
      );

      // Precedence: widget defaults < platform branding < explicit data-*.
      const merged = {
        ...DEFAULT_SETTINGS,
        ...platformBranding,
        ...scriptSettings,
        loaded: true,
      };

      // Some components (message bubbles, assistant name/icon) read the
      // module-level `embedderSettings` directly instead of React state, so we
      // propagate the resolved branding there too. data-* keeps priority.
      embedderSettings.settings = {
        ...platformBranding,
        ...embedderSettings.settings,
      };
      const branded = { ...platformBranding, ...scriptSettings };
      if (branded.userBgColor)
        embedderSettings.USER_STYLES.msgBg = branded.userBgColor;
      if (branded.assistantBgColor)
        embedderSettings.ASSISTANT_STYLES.msgBg = branded.assistantBgColor;

      setSettings(merged);
    }
    fetchAttribs();
  }, [document]);

  return settings;
}

const validations = {
  _fallbacks: {
    defaultMessages: [],
  },

  defaultMessages: function (value = null) {
    if (typeof value !== "string") return this._fallbacks.defaultMessages;
    try {
      const list = value.split(",");
      if (
        !Array.isArray(list) ||
        list.length === 0 ||
        !list.every((v) => typeof v === "string" && v.length > 0)
      )
        throw new Error(
          "Invalid default-messages attribute value. Must be array of strings"
        );
      return list.map((v) => v.trim());
    } catch (e) {
      console.error("AnythingLLMEmbed", e);
      return this._fallbacks.defaultMessages;
    }
  },
};

function parseAndValidateEmbedSettings(settings = {}) {
  const validated = {};
  for (let [key, value] of Object.entries(settings)) {
    if (!validations.hasOwnProperty(key)) {
      validated[key] = value;
      continue;
    }

    const validatedValue = validations[key](value);
    validated[key] = validatedValue;
  }

  return validated;
}
