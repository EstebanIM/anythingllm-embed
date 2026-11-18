import React, { memo, forwardRef, useState } from "react";
import { TriangleAlert, ChevronDown } from "lucide-react";
import useSingleLine from "@/hooks/useSingleLine";
import { bubbleRadiusClass } from "@/utils/bubbleShape";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { embedderSettings } from "@/main";
import { v4 } from "uuid";
import { formatDate } from "@/utils/date";
import { useTranslation } from "react-i18next";
import {
  bubbleColorStyle,
  BUBBLE_FONT,
  BUBBLE_ROW,
  BUBBLE_PADDING,
  ASSISTANT_NAME,
  TIMESTAMP_ASSISTANT,
  TIMESTAMP_USER,
  ERROR_BUBBLE,
  ERROR_TEXT,
} from "../bubbleStyles";

const ThoughtBubble = ({ thought }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!thought || !embedderSettings.settings.showThoughts) return null;

  return (
    <div className="allm-mb-2">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="allm-cursor-pointer allm-flex allm-items-center allm-gap-x-1.5 allm-text-gray-400 hover:allm-text-gray-500"
      >
        <ChevronDown
          size={14}
          className={`allm-transition-transform ${isExpanded ? "allm-rotate-180" : ""}`}
        />
        <span className="allm-text-xs allm-font-medium">View thoughts</span>
      </div>
      {isExpanded && (
        <div className="allm-mt-2 allm-mb-3 allm-pl-0 allm-border-l-2 allm-border-gray-200">
          <div className="allm-text-xs allm-text-gray-600 allm-font-mono allm-whitespace-pre-wrap">
            {thought.trim()}
          </div>
        </div>
      )}
    </div>
  );
};

const HistoricalMessage = forwardRef(
  (
    {
      uuid = v4(),
      message,
      role,
      sources = [],
      error = false,
      errorMsg = null,
      sentAt,
    },
    ref
  ) => {
    const textSize = !!embedderSettings.settings.textSize
      ? `allm-text-[${embedderSettings.settings.textSize}px]`
      : "allm-text-sm";
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    // Extract content between think tags if they exist
    const thinkMatches = message?.match(/<think>([\s\S]*?)<\/think>/g) || [];
    const thoughts = thinkMatches.map((match) =>
      match.replace(/<think>|<\/think>/g, "").trim()
    );

    // Get the response content without the think tags
    const responseContent = message
      ?.replace(/<think>[\s\S]*?<\/think>/g, "")
      .trim();

    const { t } = useTranslation();
    const [bubbleRef, singleLine] = useSingleLine();
    const msgBg =
      role === "user"
        ? embedderSettings.USER_STYLES.msgBg
        : embedderSettings.ASSISTANT_STYLES.msgBg;

    return (
      <div className={BUBBLE_ROW}>
        {role === "assistant" && (
          <div className={ASSISTANT_NAME}>
            {embedderSettings.settings.assistantName || "Chat Assistant"}
          </div>
        )}
        <div
          key={uuid}
          ref={ref}
          className={`allm-flex allm-items-start allm-w-full allm-h-fit ${
            role === "user" ? "allm-justify-end" : "allm-justify-start"
          }`}
        >
          <div
            ref={bubbleRef}
            style={{
              wordBreak: "break-word",
              ...(error ? {} : bubbleColorStyle(msgBg)),
            }}
            className={`${BUBBLE_PADDING} allm-flex allm-flex-col ${BUBBLE_FONT} ${
              error
                ? ERROR_BUBBLE
                : `${bubbleRadiusClass(role, singleLine)} ${
                    role === "user"
                      ? `${embedderSettings.USER_STYLES.base} allm-anything-llm-user-message`
                      : `${embedderSettings.ASSISTANT_STYLES.base} allm-anything-llm-assistant-message`
                  }`
            }`}
          >
            <div
              data-bubble-content
              className="allm-flex allm-flex-col allm-leading-[20px]"
            >
              {error ? (
                <div className={ERROR_TEXT}>
                  <span className="allm-inline-flex allm-items-center allm-gap-x-1.5 allm-font-medium">
                    <TriangleAlert className="allm-h-4 allm-w-4" />
                    {t("chat.error-title")}
                  </span>
                  <p className="allm-text-xs allm-font-mono allm-mt-2 allm-mb-0">
                    {errorMsg || t("chat.error-detail")}
                  </p>
                </div>
              ) : (
                <>
                  {role === "assistant" && thoughts.length > 0 && (
                    <ThoughtBubble thought={thoughts.join("\n\n")} />
                  )}
                  <span
                    className={`allm-whitespace-pre-line allm-flex allm-flex-col allm-gap-y-1 ${textSize} allm-leading-[20px]`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        renderMarkdown(responseContent || message)
                      ),
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {sentAt && (
          <div
            className={role === "user" ? TIMESTAMP_USER : TIMESTAMP_ASSISTANT}
          >
            {formatDate(sentAt)}
          </div>
        )}
      </div>
    );
  }
);

export default memo(HistoricalMessage);
