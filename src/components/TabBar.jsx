import { useTheme } from '../theme/ThemeContext';

function TabIcon({ id, active, color }) {
  const sw = 1.6;
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };

  if (id === "portfolio") {
    return active ? (
      <svg {...common} fill={color} stroke="none">
        <path d="M12 3a9 9 0 0 1 8.49 6H12V3Z" />
        <path d="M21 12a9 9 0 0 1-4.5 7.79l-4.5-7.79H21Z" opacity=".55" />
        <path d="M11.13 20.96A9 9 0 0 1 3.51 9H12l-.87 11.96Z" opacity=".28" />
      </svg>
    ) : (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5V12l7.5 4.2" />
      </svg>
    );
  }

  if (id === "ratings") {
    return active ? (
      <svg {...common} fill={color} stroke={color} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M12 3.2 13.1 9.6 19 7.1l-3.2 5.4 5.6 2.9-6.3.8 1.4 6.2L12 17.3 7.5 22.4l1.4-6.2-6.3-.8 5.6-2.9L5 7.1l5.9 2.5L12 3.2Z" />
      </svg>
    ) : (
      <svg {...common}>
        <path d="M12 4v16" />
        <path d="M4.5 8.2l15 7.6" />
        <path d="M19.5 8.2l-15 7.6" />
      </svg>
    );
  }

  if (id === "watch") {
    return active ? (
      <svg {...common} fill={color} stroke="none">
        <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-3.6L5.5 21V4.5a1 1 0 0 1 1-1Z" />
      </svg>
    ) : (
      <svg {...common}>
        <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-3.6L5.5 21V4.5a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  if (id === "more") {
    const dot = (cx, cy) => active
      ? <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="2" fill={color} />
      : <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="1.7" fill="none" stroke={color} strokeWidth={sw} />;
    return (
      <svg width="22" height="22" viewBox="0 0 24 24">
        {dot(8, 8)}{dot(16, 8)}{dot(8, 16)}{dot(16, 16)}
      </svg>
    );
  }
  return null;
}

export function TabBar({ active, onTabChange, labels }) {
  const { T } = useTheme();
  const isDark = T.bg === "#0E0E0C" || T.bg.startsWith("#0") || T.bg.startsWith("#1");
  const barBg  = isDark ? "rgba(20,20,18,0.88)" : "rgba(250,250,247,0.86)";

  const items = [
    { id: "portfolio", label: labels?.portfolio || "Portfolio" },
    { id: "ratings",   label: labels?.ratings   || "Ratings"   },
    { id: "watch",     label: labels?.watch      || "Watchlist" },
    { id: "more",      label: labels?.more        || "More"      },
  ];

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 84,
      background: barBg, backdropFilter: "blur(24px) saturate(140%)",
      WebkitBackdropFilter: "blur(24px) saturate(140%)",
      borderTop: `1px solid ${T.line}`,
      display: "flex", padding: "8px 10px 24px", fontFamily: T.sans,
    }}>
      {items.map(it => {
        const on = it.id === active;
        return (
          <button key={it.id} onClick={() => onTabChange && onTabChange(it.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            gap: 3, padding: "6px 2px 4px", border: "none", background: "transparent",
            cursor: "pointer", fontFamily: "inherit",
          }}>
            <div style={{
              width: 44, height: 30, borderRadius: 999,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: on ? (isDark ? "rgba(242,239,231,0.10)" : "rgba(28,27,23,0.06)") : "transparent",
              transition: "background 160ms ease",
            }}>
              <TabIcon id={it.id} active={on} color={on ? T.ink : T.ink3} />
            </div>
            <div style={{
              fontSize: 10.5, letterSpacing: 0.1,
              color: on ? T.ink : T.ink3,
              fontWeight: on ? 600 : 500,
            }}>{it.label}</div>
          </button>
        );
      })}
    </div>
  );
}
