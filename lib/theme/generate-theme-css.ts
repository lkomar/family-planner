import type { BrandColorTokens, BrandConfig } from "@/config/brand";

const TOKEN_TO_CSS_VAR: Record<keyof BrandColorTokens, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  border: "--border",
  input: "--input",
  ring: "--ring",
  chart1: "--chart-1",
  chart2: "--chart-2",
  chart3: "--chart-3",
  chart4: "--chart-4",
  chart5: "--chart-5",
  sidebar: "--sidebar",
  sidebarForeground: "--sidebar-foreground",
  sidebarPrimary: "--sidebar-primary",
  sidebarPrimaryForeground: "--sidebar-primary-foreground",
  sidebarAccent: "--sidebar-accent",
  sidebarAccentForeground: "--sidebar-accent-foreground",
  sidebarBorder: "--sidebar-border",
  sidebarRing: "--sidebar-ring",
};

function tokensToDeclarations(tokens: BrandColorTokens): string {
  return (Object.keys(TOKEN_TO_CSS_VAR) as Array<keyof BrandColorTokens>)
    .map((token) => `  ${TOKEN_TO_CSS_VAR[token]}: ${tokens[token]};`)
    .join("\n");
}

/**
 * Renders a brand config into the `:root` / `.dark` custom-property blocks
 * that `app/globals.css`'s `@theme inline` mapping reads from. The root
 * layout injects the result as an inline <style>, so swapping which brand
 * `config/brand.ts` resolves is enough to reskin the whole app — no
 * component or Tailwind config changes needed.
 */
export function generateThemeCss(brand: BrandConfig): string {
  return `:root {
${tokensToDeclarations(brand.theme.light)}
  --radius: ${brand.radius};
}

.dark {
${tokensToDeclarations(brand.theme.dark)}
}`;
}
