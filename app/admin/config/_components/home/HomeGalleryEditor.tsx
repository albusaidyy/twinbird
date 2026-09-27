import React from 'react';
import type { GalleryItem } from '@/types/app-config';
import { defaultConfig } from '@/config/default-config';
import type { EditorProps } from '../shared/types';
import { SectionToggle } from '../shared/SectionToggle';
import { BackgroundColorPicker } from '../shared/BackgroundColorPicker';
import { SectionHeaderFields } from '../shared/SectionHeaderFields';
import { CarouselPhotosManager } from '../shared/CarouselPhotosManager';

export function HomeGalleryEditor({ draft, set }: EditorProps) {
  const data = draft.homepage.gallery || defaultConfig.homepage.gallery;

  const updEnabled = (v: boolean) =>
    set((p) => ({
      ...p,
      homepage: {
        ...p.homepage,
        gallery: {
          ...(p.homepage.gallery || defaultConfig.homepage.gallery),
          enabled: v,
        },
      },
    }));

  const handlePhotosChange = (newImages: string[]) => {
    set((p) => {
      const currentGallery = p.homepage.gallery || defaultConfig.homepage.gallery;
      const prevMap = new Map(
        (currentGallery.items || []).map((item) => [item.imageUrl, item])
      );
      const nextItems: GalleryItem[] = newImages.map((url, idx) => {
        const existing = prevMap.get(url);
        return {
          imageUrl: url,
          caption: existing?.caption || `Gallery Photo ${idx + 1}`,
          enabled: existing?.enabled !== undefined ? existing.enabled : true,
        };
      });

      return {
        ...p,
        homepage: {
          ...p.homepage,
          gallery: {
            ...currentGallery,
            items: nextItems,
          },
        },
      };
    });
  };

  const galleryImages = (data.items || [])
    .map((it) => it.imageUrl)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <SectionToggle
        title="Catch Gallery"
        enabled={data.enabled}
        onChange={updEnabled}
      />

      <BackgroundColorPicker
        value={data.backgroundColor}
        onChange={(v) =>
          set((p) => ({
            ...p,
            homepage: {
              ...p.homepage,
              gallery: {
                ...(p.homepage.gallery || defaultConfig.homepage.gallery),
                backgroundColor: v,
              },
            },
          }))
        }
      />

      <BackgroundColorPicker
        label="Indicator Color"
        desc="Pick a custom color for the carousel indicator dots and buttons."
        value={data.indicatorColor}
        onChange={(v) =>
          set((p) => ({
            ...p,
            homepage: {
              ...p.homepage,
              gallery: {
                ...(p.homepage.gallery || defaultConfig.homepage.gallery),
                indicatorColor: v,
              },
            },
          }))
        }
      />

      <SectionHeaderFields
        data={data}
        onChange={(k, v) =>
          set((p) => {
            const currentGallery =
              p.homepage.gallery || defaultConfig.homepage.gallery;
            return {
              ...p,
              homepage: {
                ...p.homepage,
                gallery: { ...currentGallery, [k]: v },
              },
            };
          })
        }
      />

      <CarouselPhotosManager
        id="home-gallery-photos"
        title="Catch Gallery Photos"
        description="Manage photos displayed in the homepage auto-scrolling gallery carousel. Drag or use arrows to reorder, replace, or add multiple photos at once from your device or media library."
        images={galleryImages}
        fallbackImage="/images/hero/hero.jpg"
        folder="gallery"
        disabled={!data.enabled}
        onChange={handlePhotosChange}
      />
    </div>
  );
}
