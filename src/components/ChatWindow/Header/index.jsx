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

// 44px touch target around a 32px round chip; hover tint, open state and
// keyboard focus are drawn on the chip (Head.jsx).
const HEADER_BUTTON =
  "allm-header-btn allm-w-[44px] allm-h-[44px] allm-p-0 allm-flex allm-items-center allm-justify-center allm-bg-transparent allm-border-none hover:allm-cursor-pointer focus-visible:allm-outline-none";
const HEADER_CHIP =
  "allm-chip allm-w-8 allm-h-8 allm-rounded-full allm-flex allm-items-center allm-justify-center allm-text-[#5F6368]";

const MENU_ICON = "allm-flex-none allm-text-[#5F6368]";
// Options menu rows: Portal text sizes, regular weight, grey icons.
const MENU_ITEM =
  "allm-w-full allm-h-10 allm-px-3 allm-flex allm-items-center allm-gap-x-[10px] allm-bg-white allm-border-none allm-rounded-lg allm-text-[14px] allm-font-normal allm-text-[#1B2A41] allm-no-underline allm-font-[family-name:inherit] allm-whitespace-nowrap hover:allm-cursor-pointer hover:allm-bg-[#F4F5F6] focus-visible:allm-outline focus-visible:allm-outline-2 focus-visible:allm-outline-[#1A73E8]";

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
      className="allm-flex allm-flex-none allm-items-center allm-gap-x-1 allm-relative allm-rounded-t-2xl allm-h-[56px] allm-box-border allm-pl-4 allm-pr-[10px] allm-font-[family-name:inherit]"
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
            aria-haspopup="menu"
            aria-expanded={showingOptions}
          >
            <span className={HEADER_CHIP}>
              <EllipsisVertical size={20} />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className={HEADER_BUTTON}
          aria-label="Close"
        >
          <span className={HEADER_CHIP}>
            <X size={20} />
          </span>
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
      className="allm-menu-enter allm-bg-white allm-absolute allm-z-10 allm-flex allm-flex-col allm-p-1 allm-box-border allm-rounded-xl allm-border allm-border-solid allm-border-[#E3E5E8] allm-shadow-[0_8px_24px_rgba(8,36,63,0.12)] allm-top-[60px] allm-right-[60px]"
    >
      <button onClick={resetChat} className={MENU_ITEM}>
        <RotateCcw size={18} className={MENU_ICON} />
        <span>{t("chat.reset-chat")}</span>
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
      <div className={MENU_ITEM} role="status">
        <Check size={18} className={MENU_ICON} />
        <span>{t("chat.message-copied")}</span>
      </div>
    );
  }

  return (
    <button onClick={copySessionId} className={MENU_ITEM}>
      <Copy size={18} className={MENU_ICON} />
      <span>{t("chat.session-id")}</span>
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
      className={`${MENU_ITEM} allm-box-border`}
    >
      <Mail size={18} className={MENU_ICON} />
      <span>{t("chat.email-support")}</span>
    </a>
  );
}
