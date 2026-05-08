"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import type { FormEvent } from "react";

interface Props {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </div>
    </form>
  );
}
