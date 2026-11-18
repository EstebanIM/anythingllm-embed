import { LoaderCircle, ArrowUp } from "lucide-react";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { embedderSettings } from "@/main";
import { readableTextColor } from "@/utils/color";
import { normalizeCssColor } from "@/utils/cssColor";
import { fieldRadiusClass, isSingleLine } from "@/utils/bubbleShape";

export default function PromptInput({
  settings,
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);
  const [singleLine, setSingleLine] = useState(true);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        // Never send an empty or whitespace-only message.
        if (!message?.trim()) {
          event.preventDefault();
          return;
        }
        submit(event);
      }
    }
  };

  // Grow the field with its content (typing, pasting or clearing after send)
  // and switch its shape once the text wraps, like the bubbles do.
  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    if (message) element.style.height = element.scrollHeight + "px";
    const style = getComputedStyle(element);
    setSingleLine(
      !message ||
        isSingleLine({
          contentHeight:
            element.scrollHeight -
            parseFloat(style.paddingTop) -
            parseFloat(style.paddingBottom),
          lineHeight: parseFloat(style.lineHeight),
        })
    );
  }, [message]);

  const canSend = !buttonDisabled && !!message?.trim();
  const sendBg = embedderSettings.USER_STYLES.msgBg;
  const sendStyle = canSend
    ? {
        backgroundColor: sendBg,
        color: readableTextColor(normalizeCssColor(sendBg)),
      }
    : { backgroundColor: "#F4F5F6", color: "#5F6368" };

  return (
    <div className="allm-w-full allm-sticky allm-bottom-0 allm-z-10 allm-flex allm-justify-center allm-items-center allm-bg-white">
      <form
        onSubmit={handleSubmit}
        className="allm-w-full allm-px-3 allm-pt-2 allm-pb-[14px] allm-box-border"
      >
        <div
          className={`allm-flex allm-items-end allm-gap-x-2 allm-w-full allm-box-border allm-bg-white allm-border allm-border-solid allm-border-[#D5D9DE] allm-py-[6px] allm-pr-[6px] allm-pl-4 focus-within:allm-border-[#1A73E8] focus-within:allm-shadow-[0_0_0_1px_#1A73E8] ${fieldRadiusClass(singleLine)}`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            onKeyDown={captureEnter}
            onChange={onChange}
            required={true}
            disabled={inputDisabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={message}
            className="allm-box-border allm-font-[family-name:inherit] allm-border-none allm-cursor-text allm-max-h-[100px] allm-text-[14px] allm-leading-5 allm-py-[6px] allm-px-0 allm-m-0 allm-w-full allm-text-[#1B2A41] allm-bg-transparent placeholder:allm-text-[#5F6368] allm-resize-none active:allm-outline-none focus:allm-outline-none allm-flex-grow"
            placeholder={settings.sendMessageText || t("chat.send-message")}
            id="message-input"
          />
          <button
            ref={formRef}
            type="submit"
            disabled={!canSend}
            style={sendStyle}
            className="allm-flex-none allm-w-8 allm-h-8 allm-p-0 allm-border-none allm-rounded-full allm-flex allm-items-center allm-justify-center enabled:hover:allm-cursor-pointer enabled:hover:allm-opacity-90 focus-visible:allm-outline focus-visible:allm-outline-2 focus-visible:allm-outline-offset-2 focus-visible:allm-outline-[#1A73E8]"
            id="send-message-button"
            aria-label="Send message"
          >
            {buttonDisabled ? (
              <LoaderCircle size={16} className="allm-animate-spin" />
            ) : (
              <ArrowUp size={16} />
            )}
            <span className="allm-sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}
