import type { PlayerRef } from "@remotion/player";
import { type RefObject, useCallback, useRef } from "react";

/**
 * Wraps the imperative `PlayerRef` API in stable callbacks. Builder hands the
 * ref down to PreviewStage; everything else (timeline scrub, playback bar,
 * keyboard shortcuts) goes through these.
 */
export function usePlayerControls(
  playerRef: RefObject<PlayerRef | null>,
  totalDuration: number,
) {
  // Remembers whether playback was running when a scrub started, so we can
  // resume after the user releases the playhead.
  const wasPlayingBeforeScrubRef = useRef(false);

  const handleSeek = useCallback(
    (frame: number) => {
      playerRef.current?.seekTo(frame);
    },
    [playerRef],
  );

  const handleScrubStart = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    wasPlayingBeforeScrubRef.current = player.isPlaying();
    if (wasPlayingBeforeScrubRef.current) player.pause();
  }, [playerRef]);

  const handleScrubEnd = useCallback(() => {
    if (wasPlayingBeforeScrubRef.current) playerRef.current?.play();
    wasPlayingBeforeScrubRef.current = false;
  }, [playerRef]);

  const handlePlayPause = useCallback(() => {
    playerRef.current?.toggle();
  }, [playerRef]);

  const handleSkipToStart = useCallback(() => {
    playerRef.current?.seekTo(0);
  }, [playerRef]);

  const handleSkipToEnd = useCallback(() => {
    playerRef.current?.seekTo(Math.max(0, totalDuration - 1));
  }, [playerRef, totalDuration]);

  return {
    handleSeek,
    handleScrubStart,
    handleScrubEnd,
    handlePlayPause,
    handleSkipToStart,
    handleSkipToEnd,
  };
}
