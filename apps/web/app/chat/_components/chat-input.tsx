"use client"

import type { FormEvent } from "react"

interface Props {
  input: string
  isLoading: boolean
  onInputChange: (value: string) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export function ChatInput({ input, isLoading, onInputChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="border-t p-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ask anything…"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  )
}
