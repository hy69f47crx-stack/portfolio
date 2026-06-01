import { useTheme } from '../theme/ThemeContext';

export function TopBar({ back, title, right }) {
  const { T } = useTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 0", height: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: T.ink2, minWidth: 80 }}>
        {back && <span>{back}</span>}
      </div>
      {title && <div style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{title}</div>}
      <div style={{ display: "flex", gap: 8, minWidth: 80, justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}
