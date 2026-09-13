import { defaultConfig } from "@/config/default-config";
import type { AppConfig } from "@/types/app-config";
import { supabase } from "@/lib/supabase";

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item && typeof item === "object" && !Array.isArray(item));
}

function mergeDeep<T>(target: T, source?: unknown): T {
  if (!source || typeof source !== "object") {
    return target;
  }
  if (Array.isArray(source)) {
    return (source.length > 0 ? source : target) as unknown as T;
  }
  const output = { ...(target as Record<string, unknown>) };
  const src = source as Record<string, unknown>;

  for (const key of Object.keys(src)) {
    const srcVal = src[key];
    const tgtVal = output[key];

    if (srcVal === undefined) {
      continue;
    }
    if (key === "navigation" && Array.isArray(srcVal)) {
      const srcNav = srcVal as Array<{
        key: string;
        href: string;
        label: string;
        icon: string;
        enabled: boolean;
      }>;
      const defaultNav = defaultConfig.navigation;
      const mergedNav = [...srcNav];

      defaultNav.forEach((defItem, defIdx) => {
        const exists = mergedNav.some(
          (item) => item.key === defItem.key || item.href === defItem.href
        );
        if (!exists) {
          if (defIdx <= mergedNav.length) {
            mergedNav.splice(defIdx, 0, defItem);
          } else {
            mergedNav.push(defItem);
          }
        }
      });
      // Exclude 'home' from top-level navigation links
      const cleanMerged = mergedNav.filter(
        (item) => item.key !== "home" && item.href !== "/"
      );
      output[key] = cleanMerged;
    } else if (Array.isArray(srcVal)) {
      output[key] = srcVal;
    } else if (isObject(srcVal) && isObject(tgtVal)) {
      output[key] = mergeDeep(tgtVal, srcVal);
    } else {
      output[key] = srcVal;
    }
  }

  return output as T;
}

export async function getAppConfig(): Promise<AppConfig> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("config")
      .eq("id", "main")
      .single();

    if (error || !data?.config) return defaultConfig;

    return mergeDeep(defaultConfig, data.config);
  } catch {
    return defaultConfig;
  }
}
