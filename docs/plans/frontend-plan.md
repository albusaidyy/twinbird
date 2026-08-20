# Frontend Plan — Configurable UI System

## Overview

Build a fully configurable UI shell where all branding, navigation, feature flags, layout, and copy are driven by a single `AppConfig` object. The config source is abstracted behind one function so the backend can be plugged in later without touching any UI code.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Icons | Lucide React |
| Config source (now) | Local TypeScript file |
| Config source (later) | Supabase (see `backend-plan.md`) |

---

## Install Commands

> Run these once before implementation starts.

```bash
npx shadcn@latest init

npx shadcn@latest add button card input label switch separator \
  avatar badge skeleton sheet tabs scroll-area sonner
```

---

## Config Shape

Defined once in `types/app-config.ts`. All components read from this — no hardcoded strings anywhere in the UI.

```typescript
interface AppConfig {
  branding: {
    appName: string;        // displayed in sidebar + title tag
    primaryColor: string;   // hex — applied as CSS var --color-primary
    accentColor: string;    // hex — applied as CSS var --color-accent
    font: string;           // Google Font name
    logoUrl: string | null; // null = use text fallback
    darkMode: boolean;
  };
  navigation: Array<{
    key: string;
    label: string;
    href: string;
    icon: string;      // Lucide icon name (resolved dynamically at runtime)
    enabled: boolean;  // false = hidden from sidebar
  }>;
  features: Record<string, boolean>; // e.g. { bookings: true, reports: false }
  layout: {
    sidebarCollapsed: boolean;
    dashboardWidgets: string[]; // ordered list of widget keys to render
  };
  labels: {
    welcomeMessage: string;
    entityName: string;
    entityNamePlural: string;
    primaryActionLabel: string;
  };
}
```

---

## Architecture

```
app/layout.tsx  (Server Component)
  └─ calls getAppConfig()              ← abstraction layer (reads local file today)
  └─ <AppConfigProvider config={…}>    ← hydrates React context client-side
       └─ <AppShell>
            ├─ <AppSidebar>            ← reads navigation + branding from context
            ├─ <AppHeader>             ← reads appName + darkMode from context
            └─ {children}
                 └─ page.tsx (dashboard) ← reads labels + layout.dashboardWidgets
```

---

## Files to Create / Modify

### Types

#### [NEW] `types/app-config.ts`
Full TypeScript types for `AppConfig` and all sub-interfaces.

---

### Config Layer

#### [NEW] `config/default-config.ts`
Default Tourism/Safari config object. **Only this file changes per deployment** until the backend is connected.

```typescript
export const defaultConfig: AppConfig = {
  branding: {
    appName: "Safari & Tourism",
    primaryColor: "#2D6A4F",
    accentColor: "#B7E4C7",
    font: "Inter",
    logoUrl: null,
    darkMode: false,
  },
  navigation: [
    { key: "dashboard", label: "Dashboard", href: "/",         icon: "LayoutDashboard", enabled: true },
    { key: "tours",     label: "Tours",     href: "/tours",    icon: "MapPin",           enabled: true },
    { key: "bookings",  label: "Bookings",  href: "/bookings", icon: "CalendarCheck",    enabled: true },
    { key: "clients",   label: "Clients",   href: "/clients",  icon: "Users",            enabled: true },
    { key: "reports",   label: "Reports",   href: "/reports",  icon: "BarChart3",        enabled: true },
  ],
  features: {
    bookings: true, tours: true, reports: true,
    clientPortal: false, notifications: true,
  },
  layout: {
    sidebarCollapsed: false,
    dashboardWidgets: ["stats", "recent_bookings", "revenue", "map"],
  },
  labels: {
    welcomeMessage: "Welcome to Safari & Tourism",
    entityName: "Tour",
    entityNamePlural: "Tours",
    primaryActionLabel: "Create Tour",
  },
};
```

#### [NEW] `lib/config/getAppConfig.ts`
**THE read swap point.** Only this function is replaced when Supabase arrives.

```typescript
// TODAY — reads from local file
export async function getAppConfig(): Promise<AppConfig> {
  return defaultConfig;
  // LATER: replace with Supabase fetch (see backend-plan.md)
}
```

#### [NEW] `lib/config/saveAppConfig.ts`
**THE write swap point.** Currently writes to `localStorage`.

```typescript
// TODAY — persists to localStorage
export async function saveAppConfig(config: AppConfig): Promise<void> {
  localStorage.setItem('app_config_override', JSON.stringify(config));
  // LATER: replace with Supabase upsert (see backend-plan.md)
}
```

---

### Context / Provider

#### [NEW] `components/providers/AppConfigProvider.tsx`
Client component that:
- Receives server-fetched `AppConfig` as a prop
- On mount, merges with `localStorage` override (admin edits survive refresh)
- Applies CSS custom properties to `:root`:
  - `--color-primary` ← `branding.primaryColor`
  - `--color-accent`  ← `branding.accentColor`
- Exposes `useAppConfig()` hook for all child components

---

### App Shell

#### [NEW] `components/shell/AppSidebar.tsx`
- Reads `navigation` + `branding` from `useAppConfig()`
- Renders items where `enabled: true` AND `features[item.key] !== false`
- Collapsible to icon-only mode (persists preference)
- App name / logo in top slot

#### [NEW] `components/shell/AppHeader.tsx`
- App name, breadcrumb
- Dark/light mode toggle (reads + sets `branding.darkMode`)
- User avatar placeholder (wired to Supabase Auth later)
- Admin config link (`/admin/config`)

#### [NEW] `components/shell/AppShell.tsx`
Composes `AppSidebar` + `AppHeader` + `{children}` into responsive layout.

---

### Layout & Global Styles

#### [MODIFY] `app/layout.tsx`
```typescript
const config = await getAppConfig(); // server-side
return (
  <AppConfigProvider config={config}>
    <AppShell>{children}</AppShell>
  </AppConfigProvider>
);
```

#### [MODIFY] `app/globals.css`
```css
:root {
  --color-primary: #2D6A4F;  /* overridden at runtime by AppConfigProvider */
  --color-accent:  #B7E4C7;
}
```

---

### Pages

#### [MODIFY] `app/page.tsx` — Dashboard
- Welcome heading from `labels.welcomeMessage`
- Stat cards using shadcn `Card`
- Renders only widgets in `layout.dashboardWidgets` (ordered)
- Zero hardcoded copy — all strings from `useAppConfig()`

#### [NEW] `app/admin/config/page.tsx` — Config Editor

Full tabbed UI to edit the app config live:

| Tab | Editable fields |
|-----|----------------|
| **Branding** | App name, primary color (color picker), accent color, dark mode toggle |
| **Navigation** | Per-item: enabled toggle, label rename |
| **Features** | Per-flag: on/off toggle |
| **Layout** | Sidebar default state, dashboard widget visibility + order |
| **Labels** | Welcome message, entity name/plural, CTA button copy |

Behaviour:
- Loads from `localStorage` override (falls back to `defaultConfig`)
- Changes update `AppConfigProvider` state → live preview in sidebar/header
- **Save** → calls `saveAppConfig()` (localStorage write today)
- Clear comment: `// TODO: replace saveAppConfig() with Supabase write`

---

## Final File Tree

```
safari-app/
├── app/
│   ├── admin/config/page.tsx          [NEW — config editor]
│   ├── globals.css                    [MODIFY — CSS custom props]
│   ├── layout.tsx                     [MODIFY — wrap with provider]
│   └── page.tsx                       [MODIFY — real dashboard]
├── components/
│   ├── providers/
│   │   └── AppConfigProvider.tsx      [NEW]
│   ├── shell/
│   │   ├── AppShell.tsx               [NEW]
│   │   ├── AppSidebar.tsx             [NEW]
│   │   └── AppHeader.tsx              [NEW]
│   └── ui/                            [shadcn — generated]
├── config/
│   └── default-config.ts              [NEW — per-deployment seed]
├── lib/
│   ├── config/
│   │   ├── getAppConfig.ts            [NEW — READ swap point ⚡]
│   │   └── saveAppConfig.ts           [NEW — WRITE swap point ⚡]
│   └── utils.ts                       [shadcn — generated]
└── types/
    └── app-config.ts                  [NEW]
```

---

## Verification

```bash
npm run build   # zero TypeScript/lint errors
```

Manual checks:
1. `npm run dev` → dashboard loads with Tourism branding and green palette
2. `/admin/config` → all 5 tabs render correctly
3. Change app name in Branding tab → sidebar updates **live** (no refresh)
4. Disable "Reports" nav item → disappears from sidebar immediately
5. Refresh page → admin changes survive (localStorage)
6. Toggle dark mode → theme switches across entire shell
