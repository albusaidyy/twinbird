import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2, Globe } from "lucide-react";
import { FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";
import type { AppConfig } from "@/types/app-config";
import type { EditorProps } from "../shared/types";
import { FieldRow } from "../shared/FieldRow";
import { ImageUploaderField } from "../shared/ImageUploaderField";

export function BrandingEditor({ draft, set }: EditorProps) {
  const [socialPlatform, setSocialPlatform] = useState<"twitter" | "facebook" | "whatsapp">("twitter");
  const b = draft.branding;
  const upd = <K extends keyof AppConfig["branding"]>(
    k: K,
    v: AppConfig["branding"][K],
  ) => set((p) => ({ ...p, branding: { ...p.branding, [k]: v } }));

  const previewTitle = b.appName || "Twinbird Travel Agency";
  const previewDesc =
    b.metaDescription ||
    "Book domestic & international flight tickets, customized Kenya safari expeditions, and unforgettable travel packages with Twinbird Travel Agency.";
  const previewImage = b.ogImageUrl || b.logoUrl || "/brand/icon.png";
  const siteDomain = "twinbirdtravel.com";

  return (
    <div className="space-y-6">
      <FieldRow label="App Name / Site Title" id="b-name">
        <Input
          id="b-name"
          value={b.appName}
          onChange={(e) => upd("appName", e.target.value)}
        />
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

      {/* ─── SEO & Social Share Preview Section ─── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold tracking-tight">SEO & Social Media Sharing Preview</h3>
        </div>

        <FieldRow label="Site Meta Description (SEO & Socials)" id="b-meta-desc">
          <textarea
            id="b-meta-desc"
            rows={3}
            value={b.metaDescription || ""}
            placeholder="e.g. Book domestic & international flight tickets, customized Kenya safari expeditions, and unforgettable travel packages with Twinbird Travel Agency."
            onChange={(e) => upd("metaDescription", e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Displayed in Google search results and when sharing your website URL on social apps.
          </p>
        </FieldRow>

        <FieldRow label="Social Share Image (Open Graph / og:image)" id="b-og-image">
          <ImageUploaderField
            id="b-og-image"
            value={b.ogImageUrl ?? ""}
            onChange={(val) => upd("ogImageUrl", val || null)}
            folder="brand"
            placeholder="Upload or select social preview banner (1200x630px)..."
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Recommended size: 1200 &times; 630 pixels (1.91:1 ratio). Displayed when your site is shared on WhatsApp, Twitter/X, Facebook, LinkedIn, etc.
          </p>
        </FieldRow>

        {/* Live Interactive Social Preview Simulator */}
        <div className="mt-4 rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              Live Link Share Simulator
            </span>
            <Tabs
              value={socialPlatform}
              onValueChange={(v) => setSocialPlatform(v as "twitter" | "facebook" | "whatsapp")}
              className="h-7"
            >
              <TabsList className="h-7 p-0.5 bg-background border border-border">
                <TabsTrigger value="twitter" className="text-[11px] h-6 px-2.5 flex items-center gap-1.5">
                  <FaTwitter className="h-3 w-3 text-[#1DA1F2]" /> Twitter / X
                </TabsTrigger>
                <TabsTrigger value="facebook" className="text-[11px] h-6 px-2.5 flex items-center gap-1.5">
                  <FaFacebook className="h-3 w-3 text-[#1877F2]" /> Facebook
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="text-[11px] h-6 px-2.5 flex items-center gap-1.5">
                  <FaWhatsapp className="h-3 w-3 text-[#25D366]" /> WhatsApp
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Twitter / X Preview Card */}
          {socialPlatform === "twitter" && (
            <div className="max-w-md mx-auto rounded-2xl border border-border/60 bg-card overflow-hidden shadow-xs text-card-foreground">
              <div className="relative aspect-[1.91/1] w-full bg-muted flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={previewTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image specified</span>
                )}
              </div>
              <div className="p-3 space-y-1 bg-muted/40">
                <p className="text-[11px] text-muted-foreground font-normal lowercase">{siteDomain}</p>
                <p className="text-xs font-semibold leading-snug line-clamp-1">{previewTitle}</p>
                <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">{previewDesc}</p>
              </div>
            </div>
          )}

          {/* Facebook Preview Card */}
          {socialPlatform === "facebook" && (
            <div className="max-w-md mx-auto rounded-none border border-[#dadde1] dark:border-border bg-card overflow-hidden text-card-foreground">
              <div className="relative aspect-[1.91/1] w-full bg-muted flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={previewTitle}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">No image specified</span>
                )}
              </div>
              <div className="p-2.5 bg-[#f0f2f5] dark:bg-muted/60 space-y-0.5">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{siteDomain}</p>
                <p className="text-xs font-bold leading-snug line-clamp-1">{previewTitle}</p>
                <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1">{previewDesc}</p>
              </div>
            </div>
          )}

          {/* WhatsApp Chat Bubble Preview */}
          {socialPlatform === "whatsapp" && (
            <div className="max-w-sm mx-auto bg-[#e1ffc7] dark:bg-[#054640] rounded-xl p-2.5 shadow-xs text-black dark:text-white space-y-2">
              <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-[#0b2420]">
                <div className="relative aspect-[1.91/1] w-full bg-muted overflow-hidden">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={previewTitle}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image specified</span>
                  )}
                </div>
                <div className="p-2 space-y-0.5">
                  <p className="text-xs font-semibold leading-snug line-clamp-1">{previewTitle}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight line-clamp-2">{previewDesc}</p>
                  <p className="text-[10px] text-muted-foreground pt-0.5">{siteDomain}</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 underline break-all px-1">
                https://{siteDomain}
              </p>
            </div>
          )}
        </div>
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
