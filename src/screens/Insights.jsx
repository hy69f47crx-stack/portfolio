import { useTheme } from '../theme/ThemeContext';
import { INSIGHTS, DIVERSIFICATION } from '../data/extended';
import { fmtCurrency } from '../utils/format';

function sevColor(s, T) {
  if (s === 'good') return T.sage;
  if (s === 'warn') return T.amber;
  return T.ink2;
}
function sevBg(s, T) {
  if (s === 'good') return T.sageBg;
  if (s === 'warn') return T.amberBg;
  return T.bg2;
}

const INSIGHT_NAV = {
  'Rebalance':        (nav) => nav('diversify'),
  'Review position':  (nav) => nav('asset', { sym: 'NVDA' }),
  'Open TSLA':        (nav) => nav('asset', { sym: 'TSLA' }),
  'See suggestions':  (nav) => nav('diversify'),
};

export function InsightsScreen({ tweaks, onNavigate }) {
  const { T, t } = useTheme();
  const cur = tweaks?.currency || '$';

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('insights.eyebrow')}</div>
          <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('insights.title')}</div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>
            Down {fmtCurrency(530, { sym: cur })} (−0.41%) today. Stratos identified {INSIGHTS.length} things worth knowing.
          </div>
        </div>

        {/* Hero insight card */}
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 200, height: 200, borderRadius: 100, background: T.sageBg, opacity: 0.6 }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, color: T.sageDeep, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>{t('insights.todayHeadline')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 28, lineHeight: 1.2, maxWidth: 640, marginBottom: 14 }}>
              Your portfolio moved with crypto today — not with the broad market.
            </div>
            <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.6, maxWidth: 580, marginBottom: 24 }}>
              BTC fell 2.1% on weaker ETF inflows. Because crypto is 43.5% of your NAV, this masked gains in NVDA (+1.8%) and AAPL (+0.4%).
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['Crypto impact', '−$410', T.rust], ['Stocks impact', '+$210', T.sage], ['Bonds & other', '+$12', T.ink2]].map(([k, v, c]) => (
                <div key={k} style={{ padding: '14px 20px', background: T.bg, borderRadius: 12, minWidth: 140 }}>
                  <div style={{ fontSize: 11, color: T.ink3, marginBottom: 6 }}>{k}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 24, color: c, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two column: Insights + Diversification */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>

          {/* Insight cards */}
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>{t('insights.moreInsights')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {INSIGHTS.map((ins, i) => (
                <div key={i} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: '22px 24px', display: 'flex', gap: 18 }}>
                  <div style={{ width: 4, borderRadius: 2, background: sevColor(ins.severity, T), flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 10, color: sevColor(ins.severity, T), background: sevBg(ins.severity, T), padding: '3px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>{ins.kind}</span>
                    </div>
                    <div style={{ fontFamily: T.serif, fontSize: 18, lineHeight: 1.3, marginBottom: 8 }}>{ins.title}</div>
                    <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.5, marginBottom: 14 }}>{ins.body}</div>
                    <button
                      onClick={() => { const fn = INSIGHT_NAV[ins.action]; fn ? fn(onNavigate) : onNavigate?.('insights'); }}
                      style={{ fontSize: 13, color: T.sage, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>
                      {ins.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diversification summary */}
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>{t('insights.diversif')}</div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: '24px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke={T.bg} strokeWidth="8" />
                    <circle cx="40" cy="40" r="32" fill="none" stroke={T.sage} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 32 * DIVERSIFICATION.score / 100} ${2 * Math.PI * 32}`}
                      strokeDashoffset={2 * Math.PI * 32 * 0.25}
                      strokeLinecap="round"
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 20 }}>
                    {DIVERSIFICATION.score}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t('insights.score')} {DIVERSIFICATION.score}/100</div>
                  <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{t('insights.concentrated')}</div>
                  <div style={{ fontSize: 12, color: T.ink2, marginTop: 6 }}>{t('insights.beta')} {DIVERSIFICATION.beta} · {t('insights.betaTarget')} {DIVERSIFICATION.betaTarget}</div>
                </div>
              </div>
              {DIVERSIFICATION.sectors.map((s, i) => {
                const over = s.pct - s.target;
                return (
                  <div key={s.name} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                        {s.name}
                      </span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ fontWeight: 600 }}>{s.pct}%</span>
                        <span style={{ color: T.ink3 }}> / {s.target}%</span>
                      </span>
                    </div>
                    <div style={{ height: 5, background: T.bg, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: `${s.target / 50 * 100}%`, top: -1, width: 2, height: 7, background: T.ink3 }} />
                      <div style={{ width: `${Math.min(100, s.pct / 50 * 100)}%`, height: '100%', background: Math.abs(over) > 6 ? T.amber : s.color, opacity: 0.75 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gap fills */}
            <div style={{ fontFamily: T.serif, fontSize: 18, marginBottom: 12 }}>{t('insights.suggested')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DIVERSIFICATION.gaps.map(g => (
                <div key={g.sym} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 12 }}>{g.sym.slice(0, 2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{g.sym} <span style={{ color: T.ink3, fontWeight: 400 }}>· {g.name}</span></div>
                    <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{t('insights.fills')} <span style={{ color: T.sageDeep, fontWeight: 500 }}>{g.fill}</span> · {g.alloc}</div>
                  </div>
                  <button
                    onClick={() => onNavigate?.('add-holding', { prefill: { sym: g.sym, name: g.name, type: 'ETF' } })}
                    style={{ padding: '7px 14px', borderRadius: 8, background: T.ink, color: T.card, border: 'none', fontSize: 12, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer' }}>{t('common.add')}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
