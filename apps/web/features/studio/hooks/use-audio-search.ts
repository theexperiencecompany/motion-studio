"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useDeferredValue, useState } from "react";

export type AudioTrack = {
  id: string;
  title: string;
  duration: number;
  previewUrl: string;
  downloadUrl: string;
  tags: string[];
  user?: string;
};

type AudioSearchResponse = {
  tracks?: AudioTrack[];
  error?: string;
};

export type AudioSearchState = {
  query: string;
  debouncedQuery: string;
  tracks: AudioTrack[];
  loading: boolean;
  error: string | null;
  missingKey: boolean;
  setQuery: (query: string) => void;
  setError: (error: string | null) => void;
};

const AUDIO_SEARCH_STALE_MS = 5 * 60 * 1000;

function audioSearchQueryKey(query: string) {
  return ["studio", "audio-search", query] as const;
}

async function fetchAudioSearch(
  query: string,
  signal?: AbortSignal,
): Promise<AudioSearchResponse> {
  const url = query
    ? `/api/audio/search?q=${encodeURIComponent(query)}`
    : "/api/audio/search";
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Audio search failed (${res.status})`);
  return (await res.json()) as AudioSearchResponse;
}

export function useAudioSearch(): AudioSearchState {
  const [query, setQuery] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim());
  const search = useQuery({
    queryKey: audioSearchQueryKey(deferredQuery),
    queryFn: ({ signal }) => fetchAudioSearch(deferredQuery, signal),
    staleTime: AUDIO_SEARCH_STALE_MS,
  });

  const updateQuery = useCallback((nextQuery: string) => {
    setLocalError(null);
    setQuery(nextQuery);
  }, []);

  const queryError =
    search.error instanceof Error
      ? search.error.message
      : search.error
        ? "Failed to load"
        : null;
  const apiError = search.data?.error ?? null;
  const error = localError ?? apiError ?? queryError;

  return {
    query,
    debouncedQuery: deferredQuery,
    tracks: search.data?.tracks ?? [],
    loading: search.isFetching && !search.data,
    error,
    missingKey: error === "PIXABAY_API_KEY not set",
    setQuery: updateQuery,
    setError: setLocalError,
  };
}
