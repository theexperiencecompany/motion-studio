"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@workspace/ui/lib/utils"
import { useIsPlaying, usePlayerFrame } from "../state/player-context"

type Props = {
  totalDuration: number
  fps: number
  disabled: boolean
  onPlayPause: () => void
  onSkipToStart: () => void
  onSkipToEnd: () => void
}

export function PlaybackControls({
  totalDuration,
  fps,
  disabled,
  onPlayPause,
  onSkipToStart,
  onSkipToEnd,
}: Props) {
  return (
    <div className="flex shrink-0 items-center justify-center gap-3 bg-background px-4 py-2">
      <div className="flex items-center gap-1">
        <ControlButton
          onClick={onSkipToStart}
          disabled={disabled}
          title="Skip to start"
          icon={BackwardIcon}
        />
        <PlayPauseButton onClick={onPlayPause} disabled={disabled} />
        <ControlButton
          onClick={onSkipToEnd}
          disabled={disabled}
          title="Skip to end"
          icon={ForwardIcon}
        />
      </div>

      <TimeReadout fps={fps} totalDuration={totalDuration} />
    </div>
  )
}

function PlayPauseButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled: boolean
}) {
  const isPlaying = useIsPlaying()
  return (
    <ControlButton
      onClick={onClick}
      disabled={disabled}
      title={isPlaying ? "Pause" : "Play"}
      icon={isPlaying ? PauseIcon : PlayIcon}
    />
  )
}

function TimeReadout({
  fps,
  totalDuration,
}: {
  fps: number
  totalDuration: number
}) {
  const currentFrame = usePlayerFrame()
  const currentSeconds = currentFrame / fps
  const totalSeconds = totalDuration / fps
  return (
    <p className="text-[11px] tabular-nums text-muted-foreground">
      <span className="text-foreground">{formatClock(currentSeconds)}</span>
      <span className="mx-1 opacity-50">/</span>
      <span>{formatClock(totalSeconds)}</span>
    </p>
  )
}

function ControlButton({
  onClick,
  disabled,
  title,
  icon,
}: {
  onClick: () => void
  disabled: boolean
  title: string
  icon: unknown
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground",
      )}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <HugeiconsIcon icon={icon as any} size={16} strokeWidth={2} />
    </button>
  )
}

function formatClock(s: number): string {
  const safe = Math.max(0, s)
  const mm = Math.floor(safe / 60)
  const ss = Math.floor(safe % 60)
  const cs = Math.floor((safe - Math.floor(safe)) * 100)
  return `${mm}:${ss.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`
}
