import { useTheme } from '../theme/ThemeContext';
import { ScoreArc } from '../components/Charts';
import { DIVERSIFICATION } from '../data/extended';

export function DiversificationScreen({ onNavigate }) {
  const { T, t } = useTheme();
  const D = DIVERSIFICATION;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('div.eyebrow')}</div>
          <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('div.title')}</div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('div.sub')}</div>
        </div>

        {/* Score + Beta row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px', display: 'flex', alignItems: 'center', gap: 22 }}>
            <ScoreArc score={D.score} size={110} T={T} />
            <div>
              <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>{t('div.score')}</div>
              <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 400 }}>{D.score}<span style={{ fontSize: 16, color: T.ink3 }}>/100</span></div>
              <div style={{ fontSize: 13, color: T.ink2, marginTop: 8 }}>{t('div.scoreDesc')}</div>
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px' }}>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12 }}>{t('div.beta')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontVariantNumeric: 'tabular-nums' }}>{D.beta.toFixed(2)}</div>
            <div style={{ position: 'relative', height: 24, marginTop: 18 }}>
              <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 4, background: T.bg, borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: 8, left: `${(D.betaTarget / 2) * 100}%`, width: 2, height: 8, background: T.ink3 }} />
              <div style={{ position: 'absolute', top: 4, left: `${(D.beta / 2) * 100 - 3}%`, width: 16, height: 16, borderRadius: 8, background: T.amber, border: `2px solid ${T.card}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.ink3, marginTop: 6 }}>
              <span>{t('div.defensive')}</span><span>{t('div.market')}</span><span>{t('div.aggressive')}</span>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: T.ink2 }}>{t('div.betaTarget')} {D.betaTarget} · {t('div.addingBonds')}</div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px' }}>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12 }}>{t('div.keyRisks')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['Crypto concentration', '43.5% · 2× your target', T.rust],
                ['No healthcare exposure', '0% · target 10%', T.amber],
                ['High beta (1.32)', 'Above target of 1.10', T.amber],
              ].map(([title, sub, c]) => (
                <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: c, marginTop: 6, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
                    <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two columns: Sector mix + Gap fills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>

          {/* Sector mix */}
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: T.serif, fontSize: 22 }}>{t('div.sectorMix')}</span>
              <span style={{ fontSize: 12, color: T.ink3 }}>{t('div.vsTarget')}</span>
            </div>
            <div style={{ padding: '8px 24px' }}>
              {D.sectors.map((s, i) => {
                const over = s.pct - s.target;
                const max = 50;
                return (
                  <div key={s.name} style={{ padding: '14px 0', borderBottom: i < D.sectors.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                        <span style={{ fontWeight: 500 }}>{s.name}</span>
                      </span>
                      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ fontWeight: 600, color: Math.abs(over) > 6 ? T.amber : T.ink }}>{s.pct}%</span>
                        <span style={{ color: T.ink3 }}> · {t('div.target')} {s.target}%</span>
                        {Math.abs(over) > 6 && (
                          <span style={{ marginLeft: 8, fontSize: 11, padding: '2px 7px', borderRadius: 4, background: T.amberBg, color: T.amber, fontWeight: 600 }}>
                            {over > 0 ? '+' : ''}{over}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div style={{ position: 'relative', height: 7, background: T.bg, borderRadius: 4, overflow: 'visible' }}>
                      <div style={{ position: 'absolute', left: `${(s.target / max) * 100}%`, top: -2, width: 2, height: 11, background: T.ink3, borderRadius: 1 }} />
                      <div style={{ width: `${Math.min(100, (s.pct / max) * 100)}%`, height: '100%', borderRadius: 4, background: Math.abs(over) > 6 ? T.amber : s.color, opacity: Math.abs(over) > 6 ? 0.9 : 0.65 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gap fills */}
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>{t('div.gaps')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {D.gaps.map(g => (
                <div key={g.sym} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 14 }}>{g.sym.slice(0, 2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{g.sym} <span style={{ color: T.ink3, fontWeight: 400 }}>· {g.name}</span></div>
                    <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>
                      {t('div.fills')} <span style={{ color: T.sageDeep, fontWeight: 600 }}>{g.fill}</span> · {t('div.suggested')} {g.alloc}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate?.('add-holding', { prefill: { sym: g.sym, name: g.name, type: 'ETF' } })}
                    style={{ padding: '8px 16px', borderRadius: 9, background: T.ink, color: T.card, border: 'none', fontSize: 13, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer' }}>{t('common.add')}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
