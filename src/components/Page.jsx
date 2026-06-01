import { useTheme } from '../theme/ThemeContext';

export function Page({ children, maxWidth = 1280 }) {
  const { T } = useTheme();
  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      paddingTop: 60,
      fontFamily: T.sans,
      color: T.ink,
    }}>
      <div style={{
        maxWidth,
        margin: '0 auto',
        padding: '40px 32px 80px',
      }}>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, right }) {
  const { T } = useTheme();
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
      <div>
        {eyebrow && (
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
            {eyebrow}
          </div>
        )}
        <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400, lineHeight: 1.05, color: T.ink }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{sub}</div>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

export function Card({ children, style = {} }) {
  const { T } = useTheme();
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.line}`,
      borderRadius: 16,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, subColor, accent }) {
  const { T } = useTheme();
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.line}`,
      borderRadius: 16,
      padding: '20px 22px',
      flex: 1,
    }}>
      <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10 }}>
        {label}
      </div>
      <div style={{
        fontFamily: T.serif, fontSize: 32, fontWeight: 400,
        lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        color: accent || T.ink,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: subColor || T.ink3, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
          {sub}
        </div>
      )}
    </div>
  );
}
