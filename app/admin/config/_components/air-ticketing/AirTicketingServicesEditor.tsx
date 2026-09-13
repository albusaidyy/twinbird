import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowUp, ArrowDown, Plane } from 'lucide-react';
import type { AirlinePartnerItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { FieldRow } from '../shared/FieldRow';
import { SectionToggle } from '../shared/SectionToggle';
import { ImageUploaderField } from '../shared/ImageUploaderField';

export function AirTicketingServicesEditor({ draft, set }: EditorProps) {
  const atp = draft.airTicketingPage || defaultConfig.airTicketingPage!;
  const ss = atp.servicesSection || {
    enabled: true,
    airlinesTitle: 'Partner Airlines & Flight Operators',
    airlinesSubtitle: "We coordinate seamlessly with Kenya's premier safari bush carriers, regional scheduled airlines, and global flag carriers",
    airlines: [],
  };
  const airlines = ss.airlines || defaultConfig.airTicketingPage?.servicesSection?.airlines || [];

  const upd = (k: string, v: unknown) =>
    set((p) => {
      const current = p.airTicketingPage || defaultConfig.airTicketingPage!;
      return {
        ...p,
        airTicketingPage: {
          ...current,
          servicesSection: { ...(current.servicesSection || ss), [k]: v },
        },
      };
    });

  // Airlines Carousel Management
  const updAirline = (index: number, k: string, v: unknown) => {
    const updated = [...airlines];
    updated[index] = { ...updated[index], [k]: v };
    upd('airlines', updated);
  };

  const addAirline = () => {
    const newAirline: AirlinePartnerItem = {
      id: `airline-${Date.now()}`,
      name: 'New Airline Partner',
      category: 'Safari Bush Carrier',
      logoUrl: '',
      imageUrl: '',
      badge: 'Partner Carrier',
      enabled: true,
    };
    upd('airlines', [...airlines, newAirline]);
  };

  const removeAirline = (index: number) => {
    upd('airlines', airlines.filter((_, i) => i !== index));
  };

  const moveAirline = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= airlines.length) return;
    const reordered = [...airlines];
    const [temp] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, temp);
    upd('airlines', reordered);
  };

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Enable Airline Partners Carousel"
        enabled={ss.enabled !== false}
        onChange={(v) => upd('enabled', v)}
      />

      <div className="space-y-4">
        <div className="space-y-3">
          <FieldRow label="Carousel Section Title" id="ata-title">
            <Input
              id="ata-title"
              value={ss.airlinesTitle || ''}
              placeholder="Partner Airlines & Flight Operators"
              onChange={(e) => upd('airlinesTitle', e.target.value)}
              disabled={ss.enabled === false}
            />
          </FieldRow>
          <FieldRow label="Carousel Subtitle" id="ata-sub">
            <Input
              id="ata-sub"
              value={ss.airlinesSubtitle || ''}
              placeholder="We coordinate seamlessly with Kenya's premier safari bush carriers and global airlines"
              onChange={(e) => upd('airlinesSubtitle', e.target.value)}
              disabled={ss.enabled === false}
            />
          </FieldRow>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Plane className="h-4 w-4 text-primary" />
                <span>Airline Partners & Logos ({airlines.length})</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                Manage carrier names, logos, and category tags displayed in the auto-scrolling carousel.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addAirline}
              disabled={ss.enabled === false}
              className="text-xs h-8 gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Airline Logo
            </Button>
          </div>

          <div className="space-y-3">
            {airlines.map((a, idx) => (
              <div
                key={a.id || idx}
                className="rounded-xl border p-4 bg-card space-y-4 shadow-xs"
                style={{ opacity: a.enabled !== false ? 1 : 0.55 }}
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <Switch
                      checked={a.enabled !== false}
                      onCheckedChange={(val) => updAirline(idx, 'enabled', val)}
                      disabled={ss.enabled === false}
                    />
                    <span className="font-semibold text-xs text-foreground">
                      {a.name || `Airline #${idx + 1}`}
                    </span>
                    {a.badge && (
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {a.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === 0 || ss.enabled === false}
                      onClick={() => moveAirline(idx, -1)}
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === airlines.length - 1 || ss.enabled === false}
                      onClick={() => moveAirline(idx, 1)}
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      disabled={ss.enabled === false}
                      onClick={() => removeAirline(idx)}
                      title="Delete airline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Airline Logo */}
                <FieldRow label="Airline Logo (Image / SVG / PNG)" id={`aimg-${idx}`}>
                  <ImageUploaderField
                    id={`aimg-${idx}`}
                    value={a.logoUrl || a.imageUrl || ''}
                    onChange={(url) => {
                      updAirline(idx, 'logoUrl', url);
                      updAirline(idx, 'imageUrl', url);
                    }}
                    folder="airlines"
                    placeholder="Choose or upload airline logo..."
                  />
                </FieldRow>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldRow label="Airline Name" id={`an-${idx}`}>
                    <Input
                      id={`an-${idx}`}
                      value={a.name}
                      placeholder="e.g. Kenya Airways, Safarilink"
                      onChange={(e) => updAirline(idx, 'name', e.target.value)}
                      disabled={ss.enabled === false}
                    />
                  </FieldRow>

                  <FieldRow label="Category / Subtitle" id={`ac-${idx}`}>
                    <Input
                      id={`ac-${idx}`}
                      value={a.category || ''}
                      placeholder="e.g. Safari Bush Airline, National Flag Carrier"
                      onChange={(e) => updAirline(idx, 'category', e.target.value)}
                      disabled={ss.enabled === false}
                    />
                  </FieldRow>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
