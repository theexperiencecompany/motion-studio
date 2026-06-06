"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Compositions can render chat-ui inside the web studio preview. chat-ui has
  // internal integration queries whose real backend does not exist here, so
  // seed the same inert data shape the Remotion renderer uses.
  queryClient.setQueryDefaults(["integrations"], {
    queryFn: async () => null,
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
  queryClient.setQueryData(["integrations", "config"], {
    configurations: [],
  });
  queryClient.setQueryData(["integrations", "user"], { integrations: [] });
  queryClient.setQueryData(["integrations", "status"], { status: {} });

  return queryClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
