"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

export type TerminalLineKind = "comment" | "command" | "output" | "success";

export type TerminalLineItem = {
  kind: TerminalLineKind;
  text: string;
};

type Props = {
  label: string;
  value: TerminalLineItem[];
  onChange: (next: TerminalLineItem[]) => void;
};

const KIND_LABEL: Record<TerminalLineKind, string> = {
  comment: "# comment",
  command: "❯ command",
  output: "output",
  success: "✓ success",
};

const KIND_BADGE: Record<TerminalLineKind, string> = {
  comment: "bg-muted text-muted-foreground",
  command: "bg-blue-500/15 text-blue-300",
  output: "bg-zinc-500/15 text-zinc-300",
  success: "bg-emerald-500/15 text-emerald-300",
};

export function TerminalLinesEditor({ label, value, onChange }: Props) {
  const items = Array.isArray(value) ? value : [];

  function update(index: number, patch: Partial<TerminalLineItem>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }
  function add(kind: TerminalLineKind) {
    onChange([...items, { kind, text: "" }]);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-medium">{label}</div>
        <div className="text-[10px] text-muted-foreground">
          {items.length} lines
        </div>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="rounded-md border border-border/60 bg-muted/20 p-2 space-y-1.5"
          >
            <div className="flex items-center gap-1.5">
              <Select
                value={item.kind}
                onValueChange={(v) =>
                  update(i, { kind: v as TerminalLineKind })
                }
              >
                <SelectTrigger className="h-7 flex-1 text-[11px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(KIND_LABEL) as TerminalLineKind[]).map((k) => (
                    <SelectItem key={k} value={k} className="text-[11px]">
                      <span
                        className={`mr-2 inline-block rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${KIND_BADGE[k]}`}
                      >
                        {k}
                      </span>
                      {KIND_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move down"
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(i)}
                title="Remove"
              >
                ×
              </Button>
            </div>
            <Input
              value={item.text}
              placeholder={
                item.kind === "command"
                  ? "echo hello"
                  : item.kind === "comment"
                    ? "# describe what's happening"
                    : item.kind === "success"
                      ? "ready"
                      : "output text"
              }
              className="h-8 font-mono text-[12px]"
              onChange={(e) => update(i, { text: e.target.value })}
            />
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => add("command")}
        >
          + Command
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => add("output")}
        >
          + Output
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => add("comment")}
        >
          + Comment
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => add("success")}
        >
          + Success
        </Button>
      </div>
    </div>
  );
}
