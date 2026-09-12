import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { AppConfig } from "@/types/app-config";
import type { EditorProps } from "../shared/types";
import { FieldRow } from "../shared/FieldRow";
import { ImageUploaderField } from "../shared/ImageUploaderField";

export function BrandingEditor({ draft, set }: EditorProps) {
  const b = draft.branding;
  const upd = <K extends keyof AppConfig["branding"]>(
    k: K,
    v: AppConfig["branding"][K],
  ) => set((p) => ({ ...p, branding: { ...p.branding, [k]: v } }));

  return (
    <div className="space-y-6">
      <FieldRow label="App Name" id="b-name">
        <Input
          id="b-name"
          value={b.appName}
          onChange={(e) => upd("appName", e.target.value)}
        />
      </FieldRow>
      <FieldRow label="Site Meta Description (SEO)" id="b-meta-desc">
        <textarea
          id="b-meta-desc"
          rows={3}
          value={b.metaDescription || ""}
          placeholder="e.g. Premier African wildlife safaris, Big Five game drives, and luxury bush expeditions in Kenya."
          onChange={(e) => upd("metaDescription", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Used by search engines, social media previews, and browser metadata.
        </p>
      </FieldRow>
      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Primary Color" id="b-primary">
          <div className="flex gap-2">
            <Input
              type="color"
              className="w-12 p-1 h-9"
              value={b.primaryColor}
              onChange={(e) => upd("primaryColor", e.target.value)}
            />
            <Input
              id="b-primary"
              value={b.primaryColor}
              onChange={(e) => upd("primaryColor", e.target.value)}
            />
          </div>
        </FieldRow>
        <FieldRow label="Accent Color" id="b-accent">
          <div className="flex gap-2">
            <Input
              type="color"
              className="w-12 p-1 h-9"
              value={b.accentColor}
              onChange={(e) => upd("accentColor", e.target.value)}
            />
            <Input
              id="b-accent"
              value={b.accentColor}
              onChange={(e) => upd("accentColor", e.target.value)}
            />
          </div>
        </FieldRow>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="b-dark">Dark Mode Default</Label>
          <div className="text-sm text-muted-foreground">
            Start app in dark mode
          </div>
        </div>
        <Switch
          id="b-dark"
          checked={b.darkMode}
          onCheckedChange={(v) => upd("darkMode", v)}
        />
      </div>
      <Separator />

      <FieldRow label="Main Logo (Light Backgrounds)" id="b-logo">
        <ImageUploaderField
          id="b-logo"
          value={b.logoUrl ?? ""}
          onChange={(val) => {
            const nextLogo = val || null;
            set((p) => {
              let nextFavicon = p.branding.faviconUrl;
              if (nextLogo && nextLogo.includes("logo")) {
                const suffix = nextLogo
                  .replace(/^.*logo/i, "")
                  .replace(/\.(png|jpg|jpeg|svg|webp|ico)$/i, "");
                if (suffix)
                  nextFavicon = `/brand/favicons/favicon${suffix}.ico`;
              }
              return {
                ...p,
                branding: {
                  ...p.branding,
                  logoUrl: nextLogo,
                  faviconUrl: nextFavicon,
                },
              };
            });
          }}
          folder="brand/logos"
          placeholder="Upload or choose logo..."
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Recommended: 512x512px transparent PNG or SVG with dark text. Used in
          light navigation bar.
        </p>
      </FieldRow>

      <FieldRow label="Dark / Footer Logo (Dark Backgrounds)" id="b-logo-dark">
        <ImageUploaderField
          id="b-logo-dark"
          value={b.logoDarkUrl ?? ""}
          onChange={(val) => upd("logoDarkUrl", val || null)}
          folder="brand/logos"
          placeholder="Upload or choose dark mode / footer logo..."
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Recommended: Transparent PNG or SVG with white text. Used in dark
          footer and dark mode.
        </p>
      </FieldRow>

      <FieldRow label="Favicon" id="b-favicon">
        <ImageUploaderField
          id="b-favicon"
          value={b.faviconUrl ?? ""}
          onChange={(val) => upd("faviconUrl", val || null)}
          folder="brand/favicons"
          placeholder="Upload or choose favicon..."
        />
        <p className="text-[11px] text-muted-foreground mt-1">
          Recommended: 32x32px or 16x16px (PNG or ICO). Used in browser tab.
        </p>
      </FieldRow>
    </div>
  );
}
