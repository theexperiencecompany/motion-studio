"use client";

import { ArrowUp02Icon, StopIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@workspace/ui/lib/utils";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ComposerProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Callback when message is submitted */
  onSubmit?: (message: string) => void;
  /** Callback when input value changes */
  onChange?: (value: string) => void;
  /** Whether the composer is disabled */
  disabled?: boolean;
  /** Whether to auto-focus the input */
  autoFocus?: boolean;
  /** Maximum rows for the textarea before it scrolls */
  maxRows?: number;
  /** Initial value (uncontrolled) */
  defaultValue?: string;
  /** Controlled value */
  value?: string;
  /** Additional className for the container */
  className?: string;
  /**
   * Whether the composer is in a loading/busy state. The send button turns
   * into a stop button and `onStop` fires instead of `onSubmit`.
   */
  isLoading?: boolean;
  /** Callback when the stop button is pressed while loading */
  onStop?: () => void;
}

const LINE_HEIGHT = 24;

/**
 * Chat message input adapted from the heygaia "composer" component
 * (https://ui.heygaia.io/docs/components/composer), trimmed to a plain
 * auto-growing text input + send/stop control. The attach-files and
 * slash-command tool affordances from the upstream component are omitted —
 * the studio agent only handles plain text messages.
 */
export const Composer: FC<ComposerProps> = ({
  placeholder = "What can I do for you today?",
  onSubmit,
  onChange,
  disabled = false,
  autoFocus = false,
  maxRows = 8,
  defaultValue = "",
  value,
  className,
  isLoading = false,
  onStop,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use controlled or uncontrolled value
  const currentValue = value !== undefined ? value : inputValue;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (value === undefined) setInputValue(newValue);
      onChange?.(newValue);
    },
    [onChange, value],
  );

  // Auto-resize textarea to fit content, capped at `maxRows`.
  // biome-ignore lint/correctness/useExhaustiveDependencies: currentValue triggers resize when content changes
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const maxHeight = LINE_HEIGHT * maxRows;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [currentValue, maxRows]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isLoading) {
        onStop?.();
        return;
      }
      if (currentValue.trim()) {
        onSubmit?.(currentValue);
        if (value === undefined) setInputValue("");
      }
    },
    [currentValue, onSubmit, onStop, value, isLoading],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !disabled && !isLoading) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, disabled, isLoading],
  );

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const canSubmit = currentValue.trim().length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative rounded-3xl border border-border bg-muted/40 px-1 pt-1 pb-2 focus-within:border-ring/60">
        <form onSubmit={handleSubmit}>
          <div className="relative px-3">
            <textarea
              ref={textareaRef}
              value={currentValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent py-3 text-sm font-light transition-all",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              style={{
                minHeight: `${LINE_HEIGHT}px`,
                maxHeight: `${LINE_HEIGHT * maxRows}px`,
              }}
            />
          </div>
        </form>

        <div className="flex items-center justify-end px-2 pt-1">
          {isLoading ? (
            <button
              type="button"
              onClick={() => onStop?.()}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer",
                "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
              aria-label="Stop"
            >
              <HugeiconsIcon icon={StopIcon} size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={disabled || !canSubmit}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors cursor-pointer",
                "disabled:cursor-not-allowed",
                canSubmit
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground",
              )}
              aria-label="Send message"
            >
              <HugeiconsIcon icon={ArrowUp02Icon} size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Composer;
