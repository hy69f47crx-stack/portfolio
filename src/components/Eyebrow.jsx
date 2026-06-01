import { useTheme } from '../theme/ThemeContext';

export function Eyebrow({ eyebrow, title, sub }) {
  const { T } = useTheme();
  return (
    <div style={{ padding: "8px 24px 0" }}>
      <div style={{ fontSize: 12, color: T.ink3, letterSpacing: 0.4, textTransform: "uppercase" }}>{eyebrow}</div>
      <div style={{ fontFamily: T.serif, fontSize: 32, fontWeight: 400, marginTop: 2, lineHeight: 1.05 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
