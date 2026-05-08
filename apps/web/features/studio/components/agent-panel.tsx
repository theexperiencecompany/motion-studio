"use client";

import {
  ArrowUp01Icon,
  Cancel01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "agent";
  text: string;
};

type Props = {
  onClose: () => void;
};

const SUGGESTIONS = [
  "Make a 20s product launch video",
  "Show a tweet, then a Slack reaction",
  "Intro title → browser walkthrough → outro",
];

export function AgentPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
      {
        id: crypto.randomUUID(),
        role: "agent",
        text: "Agent isn't wired up yet — your message is queued. Once the LLM endpoint lands, this is where scene suggestions will appear.",
      },
    ]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Agent</p>
            <p className="text-[11px] text-muted-foreground">
              Brief it, get a video
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="size-6"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
        </Button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <EmptyState onPick={send} />
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border p-3"
      >
        <div className="flex items-end gap-2 rounded-lg border border-border bg-muted/40 p-2 focus-within:border-ring/60">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the video you want…"
            rows={1}
            className="min-h-0 flex-1 resize-none border-0 bg-transparent p-1 text-[13px] focus-visible:ring-0 focus-visible:outline-none"
          />
          <Button
            type="submit"
            size="icon"
            disabled={input.trim().length === 0}
            className="size-7 shrink-0 rounded-md"
            title="Send"
          >
            <HugeiconsIcon icon={ArrowUp01Icon} className="size-3.5" />
          </Button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground/70">
          Enter to send · Shift+Enter for newline
        </p>
      </form>
    </aside>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-2 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HugeiconsIcon icon={SparklesIcon} className="size-5" />
      </div>
      <div>
        <p className="text-sm font-medium">Stitch a video from a brief</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Tell the agent what you want and it will pick scenes from the library,
          set props, and lay them out on the timeline.
        </p>
      </div>
      <ul className="w-full space-y-1.5">
        {SUGGESTIONS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="w-full rounded-md border border-border bg-muted/30 px-3 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted hover:text-foreground"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-muted/40 text-foreground"
        }`}
      >
        {message.text}
      </div>
    </li>
  );
}
