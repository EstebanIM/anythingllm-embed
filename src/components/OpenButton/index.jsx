import {
  Plus,
  MessageCircleMore,
  Headset,
  Binoculars,
  Search,
  WandSparkles,
} from "lucide-react";
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
  if (isOpen) return null;
  const ChatIcon = CHAT_ICONS.hasOwnProperty(settings?.chatIcon)
    ? CHAT_ICONS[settings.chatIcon]
    : CHAT_ICONS.plus;
  return (
    <button
      style={{
        backgroundColor: settings.buttonColor,
        color: readableTextColor(normalizeCssColor(settings.buttonColor)),
      }}
      id="anything-llm-embed-chat-button"
      onClick={toggleOpen}
      className="hover:allm-cursor-pointer allm-border-none allm-flex allm-items-center allm-justify-center allm-w-[52px] allm-h-[52px] allm-p-0 allm-rounded-full hover:allm-opacity-95 focus-visible:allm-outline focus-visible:allm-outline-2 focus-visible:allm-outline-offset-2 focus-visible:allm-outline-[#1A73E8]"
      aria-label="Toggle Menu"
    >
      <ChatIcon size={24} aria-hidden="true" />
    </button>
  );
}
