"use client";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ChatMessage } from "../../editors/types";
import { ChatDemo, type ChatMessageItem } from "../_chat-demo/ChatDemo";

export type TelegramMessagesProps = {
  contactName: string;
  contactAvatar?: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

function buildItems(messages: ChatMessage[], frame: number): ChatMessageItem[] {
  const out: ChatMessageItem[] = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (frame < m.delay) continue;
    const local = frame - m.delay;
    const isTyping = local < m.typingFrames;
    out.push({
      id: i,
      from: m.side === "right" ? "me" : "them",
      text: m.text,
      typing: isTyping,
    });
  }
  return out;
}

export const TelegramMessages: React.FC<TelegramMessagesProps> = ({
  contactName,
  contactAvatar = "https://github.com/aryanranderiya.png",
  messages,
  theme: _theme,
}) => {
  const frame = useCurrentFrame();
  const items = buildItems(messages, frame);

  return (
    <AbsoluteFill style={{ background: "#F6F6F6" }}>
      <ChatDemo
        platform="telegram"
        title={contactName}
        headerAvatar={contactAvatar}
        messages={items}
      />
    </AbsoluteFill>
  );
};
