export const LIGHT = {
  bg:    "#FAFAF7",
  bg2:   "#F2F0EA",
  card:  "#FFFFFF",
  ink:   "#1C1B17",
  ink2:  "#5B594F",
  ink3:  "#8F8C7F",
  line:  "rgba(28,27,23,0.08)",
  line2: "rgba(28,27,23,0.14)",
  sage:    "oklch(0.55 0.07 155)",
  sageBg:  "oklch(0.97 0.02 155)",
  sageDeep:"oklch(0.40 0.08 155)",
  rust:    "oklch(0.58 0.13 35)",
  rustBg:  "oklch(0.97 0.02 35)",
  amber:   "#8a7430",
  amberBg: "oklch(0.97 0.04 90)",
  inkOn:   "#FFFFFF",
  shadow:  "0 1px 3px rgba(28,27,23,0.04), 0 12px 32px -16px rgba(28,27,23,0.10)",
  serif: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
  sans:  "-apple-system, 'SF Pro Text', 'Geist', system-ui, sans-serif",
  mono:  "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
};

export const DARK = {
  bg:    "#0E0E0C",
  bg2:   "#161614",
  card:  "#1A1A18",
  ink:   "#F2EFE7",
  ink2:  "#B5B1A3",
  ink3:  "#76736A",
  line:  "rgba(242,239,231,0.08)",
  line2: "rgba(242,239,231,0.14)",
  sage:    "oklch(0.70 0.10 155)",
  sageBg:  "oklch(0.26 0.05 155)",
  sageDeep:"oklch(0.45 0.10 155)",
  rust:    "oklch(0.72 0.13 35)",
  rustBg:  "oklch(0.28 0.06 35)",
  amber:   "oklch(0.75 0.12 90)",
  amberBg: "oklch(0.28 0.05 90)",
  inkOn:   "#0E0E0C",
  shadow:  "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px -16px rgba(0,0,0,0.50)",
  serif: LIGHT.serif,
  sans:  LIGHT.sans,
  mono:  LIGHT.mono,
};

export function getTokens(mode) {
  return mode === "dark" ? DARK : LIGHT;
}

export function calmPos(n, tokens)   { return n >= 0 ? tokens.sage : tokens.rust; }
export function calmPosBg(n, tokens) { return n >= 0 ? tokens.sageBg : tokens.rustBg; }
