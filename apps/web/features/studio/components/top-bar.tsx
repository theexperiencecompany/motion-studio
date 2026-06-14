"use client";

import { PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { BrandKit } from "@workspace/compositions/project";
import type { SceneTransition } from "@workspace/compositions/transitions";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useRef, useState } from "react";
import { BrandLink } from "@/components/brand-link";
import { BrandKitModal } from "./brand-kit-modal";
import { ProjectTransitionControl } from "./project-transition-control";

/**
 * Canvas formats the studio stage/export can switch between. All are based on a
 * 1080p short edge so the export stays Full-HD-class in every orientation. The
 * preview Player and the MP4 export both read project.width/height, so picking
 * one here reshapes both — letting a portrait composition (e.g. Message
 * Bubbles, 9:16) fill the frame instead of being cropped by the 16:9 stage.
 */
const PROJECT_FORMATS = [
  { id: "16:9", label: "16:9 · Landscape", width: 1920, height: 1080 },
  { id: "9:16", label: "9:16 · Portrait", width: 1080, height: 1920 },
  { id: "1:1", label: "1:1 · Square", width: 1080, height: 1080 },
  { id: "4:5", label: "4:5 · Portrait", width: 1080, height: 1350 },
] as const;

type Props = {
  clipCount: number;
  totalSeconds: number;
  exporting: boolean;
  canExport: boolean;
  canSave: boolean;
  fps: number;
  width: number;
  height: number;
  onChangeFormat: (width: number, height: number) => void;
  projectDefaultTransition: SceneTransition | undefined;
  onUpdateProjectTransition: (transition: SceneTransition | undefined) => void;
  onExport: () => void;
  onSaveProject: () => void;
  onLoadProjectFile: (file: File) => void;
  brandKit: BrandKit | undefined;
  onUpdateBrandKit: (patch: Partial<BrandKit>) => void;
  onClearBrandKit: () => void;
};

export function TopBar({
  clipCount,
  totalSeconds,
  exporting,
  canExport,
  canSave,
  fps,
  width,
  height,
  onChangeFormat,
  projectDefaultTransition,
  onUpdateProjectTransition,
  onExport,
  onSaveProject,
  onLoadProjectFile,
  brandKit,
  onUpdateBrandKit,
  onClearBrandKit,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const brandKitActive = Boolean(
    brandKit && Object.values(brandKit).some(Boolean),
  );
  // Match the current dims to a known format; fall back to the custom WxH so a
  // hand-edited/imported project doesn't show an empty selector.
  const activeFormat = PROJECT_FORMATS.find(
    (f) => f.width === width && f.height === height,
  );
  const formatValue = activeFormat?.id ?? `${width}x${height}`;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onLoadProjectFile(file);
    // Reset so loading the same file twice still triggers onChange.
    e.target.value = "";
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-dashed border-border bg-background/95 px-8 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center gap-3">
        <BrandLink />
        <span className="text-muted-foreground/50">·</span>
        <span className="text-[12px] tabular-nums text-muted-foreground">
          {clipCount} clip{clipCount === 1 ? "" : "s"} ·{" "}
          {totalSeconds.toFixed(2)}s
        </span>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFileChange}
        />
        <Select
          value={formatValue}
          onValueChange={(id) => {
            const fmt = PROJECT_FORMATS.find((f) => f.id === id);
            if (fmt) onChangeFormat(fmt.width, fmt.height);
          }}
        >
          <SelectTrigger
            size="sm"
            className="h-8 w-[150px]"
            title="Canvas format"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_FORMATS.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.label}
              </SelectItem>
            ))}
            {!activeFormat && (
              <SelectItem value={formatValue} disabled>
                {width}×{height} · Custom
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <ProjectTransitionControl
          transition={projectDefaultTransition}
          fps={fps}
          onChange={onUpdateProjectTransition}
        />
        <Button
          variant={brandKitActive ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setBrandKitOpen(true)}
          title={
            brandKitActive
              ? `Brand kit: ${brandKit?.brandName ?? "active"}`
              : "Set up brand kit"
          }
        >
          <HugeiconsIcon icon={PaintBoardIcon} className="size-3.5" />
          Brand
          {brandKitActive ? (
            <span
              className="ml-1 inline-block size-2 rounded-full"
              style={{ background: brandKit?.primaryColor ?? "#666" }}
              aria-hidden
            />
          ) : null}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveProject}
          disabled={!canSave}
        >
          Save
        </Button>
        <Button size="sm" onClick={onExport} disabled={exporting || !canExport}>
          {exporting ? "Rendering…" : "Export"}
        </Button>
      </div>
      <BrandKitModal
        open={brandKitOpen}
        onOpenChange={setBrandKitOpen}
        brandKit={brandKit}
        onPatch={onUpdateBrandKit}
        onClear={onClearBrandKit}
      />
    </header>
  );
}
