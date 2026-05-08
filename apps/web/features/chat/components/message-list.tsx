"use client";

import type { ChatStatus, UIMessage } from "ai";
import { isTextUIPart, isToolOrDynamicToolUIPart } from "ai";
import { Streamdown } from "streamdown";

interface Props {
  messages: UIMessage[];
  isLoading: boolean;
  status: ChatStatus;
}

export function MessageList({ messages, isLoading, status }: Props) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
              m.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {m.parts.map((part, i) => {
              const partKey = `${m.id}-${i}`;
              if (isTextUIPart(part)) {
                if (m.role === "assistant") {
                  return (
                    <Streamdown
                      key={partKey}
                      isAnimating={status === "streaming"}
                      animated={{ animation: "blurIn", duration: 150 }}
                    >
                      {part.text}
                    </Streamdown>
                  );
                }
                return <span key={partKey}>{part.text}</span>;
              }
              if (isToolOrDynamicToolUIPart(part)) {
                const toolName =
                  "toolName" in part
                    ? part.toolName
                    : part.type.replace("tool-", "");
                return (
                  <span key={partKey} className="italic opacity-60">
                    Using tool: {toolName}…
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-2xl px-4 py-2 text-sm opacity-60">
            Thinking…
          </div>
        </div>
      )}
    </div>
  );
}
