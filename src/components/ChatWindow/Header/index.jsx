import ChatService from "@/models/chatService";
import {
  RotateCcw,
  Check,
  Copy,
  EllipsisVertical,
  Mail,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// 44px touch target, Portal grey icon, visible keyboard focus.
const HEADER_BUTTON =
  "allm-w-[44px] allm-h-[44px] allm-flex allm-items-center allm-justify-center allm-bg-transparent allm-border-none allm-rounded-lg allm-text-[#5F6368] hover:allm-cursor-pointer hover:allm-bg-[#F4F5F6] focus-visible:allm-outline focus-visible:allm-outline-2 focus-visible:allm-outline-[#1A73E8]";

export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
}) {
  const [showingOptions, setShowOptions] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
    setShowOptions(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div
      style={{ borderBottom: "1px solid #E3E5E8" }}
      className="allm-flex allm-items-center allm-gap-x-1 allm-relative allm-rounded-t-2xl allm-h-[56px] allm-box-border allm-pl-4 allm-pr-[6px] allm-font-[family-name:inherit]"
      id="anything-llm-header"
    >
      {/* Platform logo only when one was uploaded (no AnythingLLM fallback). */}
      {iconUrl && (
        <img
          style={{ maxHeight: 24, maxWidth: 72 }}
          className="allm-mr-1"
          src={iconUrl}
          alt=""
        />
      )}
      <p className="allm-m-0 allm-flex-1 allm-min-w-0 allm-truncate allm-text-[14px] allm-font-semibold allm-text-[#1B2A41]">
        {settings.assistantName || "Chat Assistant"}
      </p>
      <div className="allm-flex allm-items-center allm-flex-none">
        {settings.loaded && (
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setShowOptions(!showingOptions)}
            className={HEADER_BUTTON}
            aria-label="Options"
          >
            <EllipsisVertical size={20} />
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className={HEADER_BUTTON}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      <OptionsMenu
        settings={settings}
        showing={showingOptions}
        resetChat={handleChatReset}
        sessionId={sessionId}
        menuRef={menuRef}
      />
    </div>
  );
}

function OptionsMenu({ settings, showing, resetChat, sessionId, menuRef }) {
  if (!showing) return null;
  const { t } = useTranslation();

  return (
    <div
      ref={menuRef}
      className="allm-bg-white allm-absolute allm-z-10 allm-flex allm-flex-col allm-gap-y-1 allm-rounded-xl allm-shadow-lg allm-top-[60px] allm-right-[46px]"
    >
      <button
        onClick={resetChat}
        className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
      >
        <RotateCcw size={24} />
        <p className="allm-text-[14px]">{t("chat.reset-chat")}</p>
      </button>
      <ContactSupport email={settings.supportEmail} />
      <SessionID sessionId={sessionId} />
    </div>
  );
}

function SessionID({ sessionId }) {
  if (!sessionId) return null;
  const { t } = useTranslation();
  const [sessionIdCopied, setSessionIdCopied] = useState(false);

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setSessionIdCopied(true);
    setTimeout(() => setSessionIdCopied(false), 1000);
  };

  if (sessionIdCopied) {
    return (
      <div className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4">
        <Check size={24} />
        <p className="allm-text-[14px] allm-font-sans">
          {t("chat.message-copied")}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={copySessionId}
      className="hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
    >
      <Copy size={24} />
      <p className="allm-text-[14px]">{t("chat.session-id")}</p>
    </button>
  );
}

function ContactSupport({ email = null }) {
  if (!email) return null;
  const { t } = useTranslation();
  const subject = `Inquiry from ${window.location.origin}`;
  return (
    <a
      href={`mailto:${email}?Subject=${encodeURIComponent(subject)}`}
      className="allm-no-underline hover:allm-underline hover:allm-cursor-pointer allm-bg-white allm-gap-x-[12px] hover:allm-bg-gray-100 allm-rounded-lg allm-border-none allm-flex allm-items-center allm-text-base allm-text-[#7A7D7E] allm-font-bold allm-px-4"
    >
      <Mail size={24} />
      <p className="allm-text-[14px] allm-font-sans">
        {t("chat.email-support")}
      </p>
    </a>
  );
}
