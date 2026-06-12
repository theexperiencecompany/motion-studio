"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Player } from "@remotion/player";
import { compositionModulePath } from "@workspace/compositions/registry";
import type { AnyCompositionInfo } from "@workspace/compositions/schema";
import { Skeleton } from "@workspace/ui/components/skeleton";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type ComponentType, useMemo } from "react";

type Props = {
  // `calculateMetadata` is stripped server-side before this is passed because
  // it's a function and can't cross the RSC → Client boundary.
  info: Omit<AnyCompositionInfo, "calculateMetadata">;
};

export function CreatorPreviewCard({ info }: Props) {
  // Lazy-load the composition into its own chunk so this page doesn't ship
  // the JS for every other composition just to render these few previews.
  const Component = useMemo(() => {
    return dynamic<Record<string, unknown>>(
      () =>
        import(
          `@workspace/compositions/compositions/${compositionModulePath(info)}`
        ).then((mod) => ({
          default: (
            mod as Record<string, ComponentType<Record<string, unknown>>>
          )[info.id]!,
        })),
      {
        ssr: false,
        loading: () => <Skeleton className="h-full w-full rounded-none" />,
      },
    );
  }, [info.id]);

  const isPortrait = info.height > info.width;

  return (
    <Link
      href={`/docs/${info.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-muted/20 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-center justify-center bg-background p-4">
        <div
          className="w-full overflow-hidden rounded-md"
          style={{
            aspectRatio: `${info.width} / ${info.height}`,
            ...(isPortrait
              ? {
                  maxHeight: 360,
                  maxWidth: `${(info.width / info.height) * 360}px`,
                }
              : { maxWidth: "100%" }),
          }}
        >
          <Player
            component={Component}
            inputProps={info.defaultProps}
            durationInFrames={info.durationInFrames}
            fps={info.fps}
            compositionWidth={info.width}
            compositionHeight={info.height}
            style={{ width: "100%", height: "100%" }}
            autoPlay
            loop
            initiallyMuted
            acknowledgeRemotionLicense
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background/60 px-5 py-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{info.title}</div>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {info.description}
          </p>
        </div>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={16}
          className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        />
      </div>
    </Link>
  );
}
