import { useTheme } from '../theme/ThemeContext';

export function LangPill({ lang, onToggle }) {
  const { T } = useTheme();
  const isAr = lang === "ar";
  const cell = { w: 34, h: 28 };
  const pad = 3;
  const indicatorLeft = isAr ? (cell.w + pad) : pad;

  return (
    <div
      onClick={onToggle}
      dir="ltr"
      style={{
        position: "relative",
        display: "inline-flex",
        background: T.card,
        border: `1px solid ${T.line2}`,
        borderRadius: 100,
        padding: pad,
        gap: 0,
        cursor: "pointer",
        userSelect: "none",
        boxShadow: T.shadow,
      }}
    >
      <div style={{
        position: "absolute", top: pad, left: indicatorLeft,
        width: cell.w, height: cell.h,
        background: T.ink, borderRadius: 100,
        transition: "left 220ms cubic-bezier(.4,1.4,.5,1)",
      }} />
      <div style={{
        position: "relative", width: cell.w, height: cell.h,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 600, letterSpacing: 0.4,
        color: !isAr ? T.inkOn : T.ink2,
        fontFamily: T.sans, transition: "color 160ms",
      }}>EN</div>
      <div style={{
        position: "relative", width: cell.w, height: cell.h,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 600,
        color: isAr ? T.inkOn : T.ink2,
        fontFamily: "'IBM Plex Sans Arabic', 'Geist', system-ui, sans-serif",
        transition: "color 160ms",
      }}>ع</div>
    </div>
  );
}
