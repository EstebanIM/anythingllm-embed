import {
  Plus,
  MessageCircleMore,
  Headset,
  Binoculars,
  Search,
  WandSparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { readableTextColor } from "@/utils/color";
import { normalizeCssColor } from "@/utils/cssColor";

// Keys are the public `data-chat-icon` values; keep them stable.
const CHAT_ICONS = {
  plus: Plus,
  chatBubble: MessageCircleMore,
  support: Headset,
  search2: Binoculars,
  search: Search,
  magic: WandSparkles,
};

export default function OpenButton({ settings, isOpen, toggleOpen }) {
  const { t } = useTranslation();
  if (isOpen) return null;
  const ChatIcon = CHAT_ICONS.hasOwnProperty(settings?.chatIcon)
    ? CHAT_ICONS[settings.chatIcon]
    : CHAT_ICONS.plus;
  const label = t("chat.open-chat");
  // A 52px circle at rest; on hover or keyboard focus the label slides in
  // before the icon, so the pill opens toward the page (styles in Head.jsx).
  return (
    <button
      style={{
        backgroundColor: settings.buttonColor,
        color: readableTextColor(normalizeCssColor(settings.buttonColor)),
      }}
      id="anything-llm-embed-chat-button"
      onClick={toggleOpen}
      className="hover:allm-cursor-pointer allm-border-none allm-flex allm-items-center allm-justify-center allm-min-w-[52px] allm-h-[52px] allm-px-[14px] allm-py-0 allm-box-border allm-rounded-full allm-font-[family-name:inherit] allm-text-[15px] allm-font-normal allm-leading-5 focus-visible:allm-outline focus-visible:allm-outline-2 focus-visible:allm-outline-offset-2 focus-visible:allm-outline-[#1A73E8]"
      aria-label={label}
    >
      <span className="allm-launcher-label" aria-hidden="true">
        {label}
      </span>
      <ChatIcon size={24} aria-hidden="true" />
    </button>
  );
}
