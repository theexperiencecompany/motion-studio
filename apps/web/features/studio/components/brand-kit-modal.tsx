"use client";

import { Cancel01Icon, Upload04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { BrandKit } from "@workspace/compositions/project";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { FontPicker } from "./font-picker";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brandKit: BrandKit | undefined;
  onPatch: (patch: Partial<BrandKit>) => void;
  onClear: () => void;
};

const MAX_LOGO_BYTES = 500 * 1024; // 500KB

export function BrandKitModal({
  open,
  onOpenChange,
  brandKit,
  onPatch,
  onClear,
}: Props) {
  // Local draft state so edits don't dispatch on every keystroke. Reset
  // each time the modal opens so cancelling discards in-progress edits.
  const [draft, setDraft] = useState<BrandKit>(brandKit ?? {});
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setDraft(brandKit ?? {});
      setLogoError(null);
    }
  }, [open, brandKit]);

  function setField<K extends keyof BrandKit>(key: K, value: BrandKit[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleLogoFile(file: File | null) {
    setLogoError(null);
    if (!file) return;
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(
        `Logo is ${(file.size / 1024).toFixed(0)}KB — max ${MAX_LOGO_BYTES / 1024}KB. Use SVG or compress the PNG.`,
      );
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
    setField("logoUrl", dataUrl);
  }

  function handleSave() {
    // Send the full draft as a patch. Reducer treats empty strings as
    // clears, so blanking a field via the modal removes it.
    onPatch({
      brandName: draft.brandName ?? "",
      logoUrl: draft.logoUrl ?? "",
      primaryColor: draft.primaryColor ?? "",
      secondaryColor: draft.secondaryColor ?? "",
      fontFamily: draft.fontFamily ?? "",
    });
    onOpenChange(false);
  }

  function handleClearAll() {
    onClear();
    setDraft({});
    onOpenChange(false);
  }

  const hasAnyExisting = brandKit && Object.values(brandKit).some(Boolean);
  const logoPreview = draft.logoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Brand kit</DialogTitle>
          <DialogDescription>
            Saved with this project. The agent will prefer these over its
            default design tokens — your colors, your font, your logo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Field label="Brand name" htmlFor="brand-name">
            <Input
              id="brand-name"
              value={draft.brandName ?? ""}
              onChange={(e) => setField("brandName", e.target.value)}
              placeholder="Acme"
            />
          </Field>

          <Field label="Logo" htmlFor="brand-logo">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex size-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 transition-colors hover:bg-muted/60",
                )}
              >
                {logoPreview ? (
                  // biome-ignore lint/performance/noImgElement: data-URL preview
                  <img
                    alt="Brand logo preview"
                    src={logoPreview}
                    className="size-full rounded-md object-contain p-1"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Upload04Icon}
                    className="size-5 text-muted-foreground"
                  />
                )}
              </button>
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  {logoPreview ? "Replace logo" : "Upload logo"}
                </Button>
                {logoPreview ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setField("logoUrl", "")}
                    type="button"
                    className="text-muted-foreground"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
                    Remove
                  </Button>
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                id="brand-logo"
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => handleLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              SVG recommended. Max 500KB.
            </p>
            {logoError ? (
              <p className="mt-1 text-[11px] text-destructive">{logoError}</p>
            ) : null}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary color" htmlFor="brand-primary">
              <ColorInput
                id="brand-primary"
                value={draft.primaryColor ?? ""}
                onChange={(v) => setField("primaryColor", v)}
              />
            </Field>
            <Field label="Secondary color" htmlFor="brand-secondary">
              <ColorInput
                id="brand-secondary"
                value={draft.secondaryColor ?? ""}
                onChange={(v) => setField("secondaryColor", v)}
              />
            </Field>
          </div>

          <Field label="Font family" htmlFor="brand-font">
            <FontPicker
              value={draft.fontFamily ?? ""}
              onChange={(v) => setField("fontFamily", v)}
              placeholder="System default"
            />
          </Field>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {hasAnyExisting ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground"
            >
              Clear brand kit
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-[12px]">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ColorInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const looksHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
  const swatch = looksHex ? value : "#ffffff";
  return (
    <div className="flex items-center gap-2">
      <label
        className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border"
        style={{ background: swatch }}
      >
        <input
          type="color"
          aria-label="Color picker"
          value={swatch}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
      <Input
        id={id}
        value={value}
        placeholder="#000000"
        onChange={(e) => onChange(e.target.value)}
        className="font-mono"
        spellCheck={false}
      />
    </div>
  );
}
