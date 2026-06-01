export function BrandGlyph({ size = 36, color = "#1C1B17" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: "block" }}>
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M20 7 C 21 14, 21 18, 27 19 C 21 20, 21 24, 20 33" />
        <path d="M8 14 C 14 18, 17 19, 20 19 C 17 19, 14 20, 8 25" />
        <path d="M28 11 C 24 16, 22 18, 20 19 C 22 20, 24 22, 28 28" />
      </g>
    </svg>
  );
}
