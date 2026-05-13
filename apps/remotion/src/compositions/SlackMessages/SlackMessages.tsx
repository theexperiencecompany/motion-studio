"use client";
import { useCurrentFrame } from "remotion";
import type { ChatMessage } from "../../editors/types";
import { ChatDemo, type ChatMessageItem } from "../_chat-demo/ChatDemo";
import { ChatStage } from "../_chat-demo/ChatStage";

export type SlackMessagesProps = {
  contactName: string;
  messages: ChatMessage[];
  theme: "light" | "dark";
};

const LEFT_AVATAR = "https://github.com/aryanranderiya.png";
const RIGHT_AVATAR = "/gaia-glow.png";

function buildItems(messages: ChatMessage[], frame: number): ChatMessageItem[] {
  const out: ChatMessageItem[] = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i]!;
    if (frame < m.delay) continue;
    const local = frame - m.delay;
    const isTyping = local < m.typingFrames;
    const isMe = m.side === "right";
    out.push({
      id: i,
      from: isMe ? "me" : "them",
      author: isMe ? "GAIA" : "Aryan",
      avatar: isMe ? RIGHT_AVATAR : LEFT_AVATAR,
      text: m.text,
      typing: isTyping,
    });
  }
  return out;
}

export const SlackMessages: React.FC<SlackMessagesProps> = ({
  contactName,
  messages,
  theme,
}) => {
  const frame = useCurrentFrame();
  const items = buildItems(messages, frame);

  return (
    <ChatStage
      variant="desktop"
      backdrop="linear-gradient(135deg, #f5f3ee 0%, #eee6d8 100%)"
    >
      <ChatDemo
        platform="slack"
        title={contactName}
        theme={theme}
        messages={items}
      />
    </ChatStage>
  );
};
