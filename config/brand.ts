import { familyPlannerBrand } from "./brands/family-planner";

/**
 * One shadcn/Tailwind color token. Any valid CSS color works (oklch, hsl,
 * hex, ...) — keep a whole theme in the same color space so hues stay
 * consistent when you tweak one value.
 */
export interface BrandColorTokens {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface BrandTheme {
  light: BrandColorTokens;
  dark: BrandColorTokens;
}

export interface BrandConfig {
  /** Machine-readable id, matched against NEXT_PUBLIC_BRAND. */
  id: string;
  /** Human-readable product name, used in metadata and on-screen copy. */
  name: string;
  /** Base corner radius; shadcn derives its --radius-sm..4xl scale from this. */
  radius: string;
  theme: BrandTheme;
}

const brands: Record<string, BrandConfig> = {
  [familyPlannerBrand.id]: familyPlannerBrand,
};

const DEFAULT_BRAND_ID = familyPlannerBrand.id;

/**
 * Picks the active brand for this deployment. Ship the same codebase under a
 * different name/palette by adding a new file under `config/brands/`,
 * registering it above, and setting NEXT_PUBLIC_BRAND at build time — no
 * component changes required.
 */
export function resolveBrand(): BrandConfig {
  const requestedId = process.env.NEXT_PUBLIC_BRAND ?? DEFAULT_BRAND_ID;
  return brands[requestedId] ?? brands[DEFAULT_BRAND_ID];
}
