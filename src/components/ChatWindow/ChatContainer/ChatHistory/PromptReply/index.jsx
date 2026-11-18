import { forwardRef, memo, useState } from "react";
import { TriangleAlert, LoaderCircle, ChevronDown } from "lucide-react";
import useSingleLine from "@/hooks/useSingleLine";
import { bubbleRadiusClass } from "@/utils/bubbleShape";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import { formatDate } from "@/utils/date";
import { useTranslation } from "react-i18next";
import {
  bubbleColorStyle,
  BUBBLE_FONT,
  BUBBLE_ROW,
  BUBBLE_PADDING,
  ASSISTANT_NAME,
  TIMESTAMP_ASSISTANT,
  ERROR_BUBBLE,
  ERROR_TEXT,
} from "../bubbleStyles";

const assistantBubbleStyle = () => ({
  wordBreak: "break-word",
  ...bubbleColorStyle(embedderSettings.ASSISTANT_STYLES.msgBg),
});
const assistantBubbleClass = (singleLine) =>
  `${BUBBLE_PADDING} allm-flex allm-flex-col ${BUBBLE_FONT} ${bubbleRadiusClass("assistant", singleLine)} ${embedderSettings.ASSISTANT_STYLES.base} allm-anything-llm-assistant-message`;
// The measured box: text and typing indicator share one line height.
const CONTENT = "allm-flex allm-flex-col allm-leading-[20px]";

const ThinkingIndicator = ({ hasThought }) => {
  if (hasThought) {
    return (
      <div className="allm-flex allm-items-center allm-gap-x-2 allm-text-gray-500">
        <LoaderCircle size={16} className="allm-animate-spin" />
        <span className="allm-text-sm">Thinking...</span>
      </div>
    );
  }
  return <div className="allm-mx-4 allm-my-1 allm-dot-falling"></div>;
};

const ThoughtBubble = ({ thought }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!thought || !embedderSettings.settings.showThoughts) return null;

  const cleanThought = thought.replace(/<\/?think>/g, "").trim();

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
            {cleanThought}
          </div>
        </div>
      )}
    </div>
  );
};

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [], sentAt }, ref) => {
    const { t } = useTranslation();
    const [bubbleRef, singleLine] = useSingleLine();
    if (!reply && sources.length === 0 && !pending && !error) return null;
    if (error) console.error(`ANYTHING_LLM_CHAT_WIDGET_ERROR: ${error}`);

    // Extract content between think tags if they exist
    const thinkMatches = reply?.match(/<think>([\s\S]*?)<\/think>/g) || [];
    const thoughts = thinkMatches.map((match) =>
      match.replace(/<\/?think>/g, "").trim()
    );

    const hasIncompleteThinkTag =
      reply?.includes("<think>") && !reply?.includes("</think>");

    // For incomplete think tags during streaming, extract the content after the opening tag
    const streamingThought = hasIncompleteThinkTag
      ? reply
          ?.split("<think>")
          .pop()
          ?.replace(/<\/?think>/g, "")
          .trim()
      : null;

    const lastThought = streamingThought || thoughts[thoughts.length - 1];
    const isThinking = hasIncompleteThinkTag || pending;

    // Get the response content without the think tags - clean more aggressively
    const responseContent = reply
      ?.replace(/<think>[\s\S]*?<\/think>/g, "") // Remove complete think blocks
      .replace(/<think>.*$/g, "") // Remove any incomplete think blocks at the end
      .replace(/<\/?think>/g, "") // Remove any stray think tags
      .trim();

    if (isThinking) {
      return (
        <div className={BUBBLE_ROW}>
          <div className={ASSISTANT_NAME}>
            {embedderSettings.settings.assistantName || "Chat Assistant"}
          </div>
          <div className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start">
            <div
              ref={bubbleRef}
              style={assistantBubbleStyle()}
              className={assistantBubbleClass(singleLine)}
            >
              <div data-bubble-content className={CONTENT}>
                {hasIncompleteThinkTag && streamingThought && (
                  <ThoughtBubble thought={streamingThought} />
                )}
                <ThinkingIndicator hasThought={hasIncompleteThinkTag} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={BUBBLE_ROW}>
          <div className={ASSISTANT_NAME}>
            {embedderSettings.settings.assistantName || "Chat Assistant"}
          </div>
          <div className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start">
            <div
              className={`${BUBBLE_PADDING} allm-flex allm-flex-col ${BUBBLE_FONT} ${ERROR_BUBBLE} allm-anything-llm-assistant-message`}
            >
              <div className={ERROR_TEXT}>
                <span className="allm-inline-flex allm-items-center allm-gap-x-1.5 allm-font-medium">
                  <TriangleAlert className="allm-h-4 allm-w-4" />
                  {t("chat.error-title")}
                </span>
                <p className="allm-text-xs allm-font-mono allm-mt-2 allm-mb-0">
                  {t("chat.error-detail")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={BUBBLE_ROW}>
        <div className={ASSISTANT_NAME}>
          {embedderSettings.settings.assistantName || "Chat Assistant"}
        </div>
        <div
          key={uuid}
          ref={ref}
          className="allm-flex allm-items-start allm-w-full allm-h-fit allm-justify-start"
        >
          <div
            ref={bubbleRef}
            style={assistantBubbleStyle()}
            className={assistantBubbleClass(singleLine)}
          >
            <div data-bubble-content className={CONTENT}>
              {thoughts.length > 0 && (
                <ThoughtBubble thought={thoughts.join("\n\n")} />
              )}
              <div className="allm-flex allm-gap-x-5">
                <span
                  className="allm-reply allm-whitespace-pre-line allm-font-normal allm-text-sm allm-md:text-sm allm-flex allm-flex-col allm-gap-y-1"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(responseContent || ""),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {sentAt && (
          <div className={TIMESTAMP_ASSISTANT}>{formatDate(sentAt)}</div>
        )}
      </div>
    );
  }
);

export default memo(PromptReply);
