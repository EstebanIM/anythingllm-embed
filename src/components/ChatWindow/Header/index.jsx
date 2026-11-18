import ChatService from "@/models/chatService";
import { RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// 44px touch target around a 32px round chip; each button's hover and
// keyboard-focus colors are drawn on the chip (Head.jsx).
const HEADER_BUTTON =
  "allm-header-btn allm-w-[44px] allm-h-[44px] allm-p-0 allm-flex allm-items-center allm-justify-center allm-bg-transparent allm-border-none hover:allm-cursor-pointer focus-visible:allm-outline-none";
const HEADER_CHIP =
  "allm-chip allm-w-8 allm-h-8 allm-rounded-full allm-flex allm-items-center allm-justify-center allm-text-[#5F6368]";

export default function ChatWindowHeader({
  sessionId,
  settings = {},
  iconUrl = null,
  closeChat,
  setChatHistory,
}) {
  const { t } = useTranslation();

  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
  };

  const resetLabel = settings.resetChatText || t("chat.reset-chat");
  const closeLabel = t("chat.close-chat");

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
            type="button"
            onClick={handleChatReset}
            className={`${HEADER_BUTTON} allm-header-btn--reset`}
            aria-label={resetLabel}
            title={resetLabel}
          >
            <span className={HEADER_CHIP}>
              <RotateCcw size={18} />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={closeChat}
          className={`${HEADER_BUTTON} allm-header-btn--close`}
          aria-label={closeLabel}
          title={closeLabel}
        >
          <span className={HEADER_CHIP}>
            <X size={20} />
          </span>
        </button>
      </div>
    </div>
  );
}
