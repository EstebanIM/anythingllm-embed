import {
  Plus,
  MessageCircleMore,
  Headset,
  Binoculars,
  Search,
  WandSparkles,
} from "lucide-react";

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
      style={{ backgroundColor: settings.buttonColor }}
      id="anything-llm-embed-chat-button"
      onClick={toggleOpen}
      className={`hover:allm-cursor-pointer allm-border-none allm-flex allm-items-center allm-justify-center allm-p-4 allm-rounded-full allm-text-white allm-text-2xl hover:allm-opacity-95`}
      aria-label="Toggle Menu"
    >
      <ChatIcon size={24} aria-hidden="true" />
    </button>
  );
}
