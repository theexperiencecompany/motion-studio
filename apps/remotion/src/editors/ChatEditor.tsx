"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Delete02Icon,
  ArrowReloadHorizontalIcon,
  Sent02Icon,
} from "@hugeicons/core-free-icons";
import type { EditorProps } from "../schema";
import type { ChatMessage } from "./types";

const FIRST_DELAY = 30;
const GAP_FRAMES = 90;

function computeTypingFrames(text: string): number {
  return Math.max(45, Math.min(90, Math.round(text.length * 3.5)));
}

function recomputeTimings(messages: ChatMessage[]): ChatMessage[] {
  let cursor = FIRST_DELAY;
  return messages.map((m) => {
    const typingFrames = computeTypingFrames(m.text);
    const delay = cursor;
    cursor = delay + typingFrames + GAP_FRAMES;
    return { ...m, typingFrames, delay };
  });
}

export function ChatEditor({ value, onChange }: EditorProps<ChatMessage[]>) {
  const [draft, setDraft] = useState("");
  const lastSide = value[value.length - 1]?.side ?? "right";
  const [side, setSide] = useState<ChatMessage["side"]>(
    lastSide === "left" ? "right" : "left",
  );

  function setMessages(next: ChatMessage[]) {
    onChange(recomputeTimings(next));
  }

  function addMessage(text: string, sendAs: ChatMessage["side"]) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages([
      ...value,
      { text: trimmed, side: sendAs, typingFrames: 0, delay: 0 },
    ]);
    setDraft("");
    setSide(sendAs === "left" ? "right" : "left");
  }

  function patchMessage(i: number, patch: Partial<ChatMessage>) {
    const next = value.slice();
    next[i] = { ...next[i]!, ...patch };
    setMessages(next);
  }

  function deleteMessage(i: number) {
    const next = value.slice();
    next.splice(i, 1);
    setMessages(next);
  }

  function flipSide(i: number) {
    const cur = value[i]!;
    patchMessage(i, { side: cur.side === "left" ? "right" : "left" });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto">
        {value.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2.5 px-4 py-5">
            {value.map((m, i) => (
              <BubbleRow
                key={i}
                msg={m}
                onText={(text) => patchMessage(i, { text })}
                onFlip={() => flipSide(i)}
                onDelete={() => deleteMessage(i)}
              />
            ))}
          </div>
        )}
      </div>

      <Composer
        draft={draft}
        side={side}
        onDraftChange={setDraft}
        onSideChange={setSide}
        onSend={() => addMessage(draft, side)}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <HugeiconsIcon
          icon={BubbleChatIcon}
          size={22}
          className="text-muted-foreground"
        />
      </div>
      <div>
        <p className="text-sm font-medium">No messages yet</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Type below and pick who said it.
        </p>
      </div>
    </div>
  );
}

function BubbleRow({
  msg,
  onText,
  onFlip,
  onDelete,
}: {
  msg: ChatMessage;
  onText: (t: string) => void;
  onFlip: () => void;
  onDelete: () => void;
}) {
  const isRight = msg.side === "right";
  return (
    <div
      className={`group flex items-end gap-1.5 ${
        isRight ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`relative max-w-[78%] rounded-[20px] ${
          isRight
            ? "bg-blue-500 text-white"
            : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
        }`}
        style={{
          borderBottomRightRadius: isRight ? 6 : 20,
          borderBottomLeftRadius: !isRight ? 6 : 20,
        }}
      >
        <input
          value={msg.text}
          onChange={(e) => onText(e.target.value)}
          className="w-full resize-none bg-transparent px-3.5 py-2 text-[14px] leading-snug outline-none placeholder:opacity-60"
          placeholder="Empty message"
        />
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          onClick={onFlip}
          icon={ArrowReloadHorizontalIcon}
          title="Flip side"
        />
        <IconButton
          onClick={onDelete}
          icon={Delete02Icon}
          title="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  icon,
  title,
  variant,
}: {
  onClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  variant?: "danger";
}) {
  const danger = variant === "danger";
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors ${
        danger
          ? "hover:bg-red-500/10 hover:text-red-500"
          : "hover:bg-muted hover:text-foreground"
      }`}
    >
      <HugeiconsIcon icon={icon} size={14} />
    </button>
  );
}

function Composer({
  draft,
  side,
  onDraftChange,
  onSideChange,
  onSend,
}: {
  draft: string;
  side: ChatMessage["side"];
  onDraftChange: (v: string) => void;
  onSideChange: (s: ChatMessage["side"]) => void;
  onSend: () => void;
}) {
  const canSend = draft.trim().length > 0;
  return (
    <div className="shrink-0 space-y-2.5 border-t border-border bg-background/95 px-4 py-4 backdrop-blur">
      <div className="inline-flex rounded-full border border-border bg-muted/40 p-0.5 text-[12px] font-medium">
        <SideTab
          active={side === "left"}
          onClick={() => onSideChange("left")}
          label="Them"
          dotColor="bg-zinc-400"
        />
        <SideTab
          active={side === "right"}
          onClick={() => onSideChange("right")}
          label="You"
          dotColor="bg-blue-500"
        />
      </div>
      <div className="flex items-end gap-2">
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={`Message as ${side === "right" ? "you" : "them"}…`}
          className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/30"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          aria-label="Send message"
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-all ${
            canSend
              ? side === "right"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-zinc-500 hover:bg-zinc-600"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          }`}
        >
          <HugeiconsIcon icon={Sent02Icon} size={18} />
        </button>
      </div>
    </div>
  );
}

function SideTab({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <span className={`size-1.5 rounded-full ${dotColor}`} />
      {label}
    </button>
  );
}
