import { useTheme } from '../theme/ThemeContext';
import { DIGEST } from '../data/extended';
import { fmtCurrency } from '../utils/format';

export function DigestScreen({ tweaks }) {
  const { T } = useTheme();
  const cur = tweaks?.currency || '$';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{DIGEST.weekOf}</div>
          <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>Weekly Digest</div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>A short read while your coffee cools.</div>
        </div>

        {/* Hero returns card */}
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '32px 36px', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 14 }}>Week's Total Return</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
            <span style={{ fontFamily: T.serif, fontSize: 64, fontWeight: 400, color: T.sage, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>+{DIGEST.totals.perfPct}%</span>
            <span style={{ fontSize: 20, color: T.ink2, fontVariantNumeric: 'tabular-nums' }}>+{fmtCurrency(DIGEST.totals.perfAbs, { sym: cur })}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Best performer', sym: DIGEST.totals.bestSym, val: `+${DIGEST.totals.bestPct}%`, color: T.sage, bg: T.sageBg },
              { label: 'Worst performer', sym: DIGEST.totals.worstSym, val: `${DIGEST.totals.worstPct}%`, color: T.rust, bg: T.rustBg },
              { label: 'Transactions', sym: DIGEST.totals.txns, val: 'trades', color: T.ink, bg: T.bg },
              { label: 'Dividends received', sym: `+${fmtCurrency(DIGEST.totals.dividends, { sym: cur })}`, val: 'income', color: T.sage, bg: T.sageBg },
            ].map((item, i) => (
              <div key={i} style={{ padding: '18px 20px', background: item.bg, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: T.ink3, marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontFamily: T.serif, fontSize: 26, color: item.color, fontVariantNumeric: 'tabular-nums' }}>{item.sym}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two columns: Highlights + Upcoming */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>Week Highlights</div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {DIGEST.highlights.map((h, i) => (
                <div key={i} style={{ padding: '18px 24px', borderBottom: i < DIGEST.highlights.length - 1 ? `1px solid ${T.line}` : 'none', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink3, minWidth: 24, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                  <span style={{ fontSize: 14, lineHeight: 1.5 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>Upcoming This Week</div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {DIGEST.upcoming.map((u, i) => (
                <div key={i} style={{ padding: '18px 24px', borderBottom: i < DIGEST.upcoming.length - 1 ? `1px solid ${T.line}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 14 }}>{u.what}</span>
                  <span style={{ fontSize: 12, color: T.ink3, whiteSpace: 'nowrap', background: T.bg, padding: '4px 10px', borderRadius: 6 }}>{u.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
