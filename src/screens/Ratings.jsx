import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { RATINGS } from '../data/portfolio';

function pill(r, T) {
  if (r === 'Strong Buy' || r === 'Buy') return { c: T.sage,  bg: T.sageBg };
  if (r === 'Hold')                      return { c: '#8a7430', bg: 'oklch(0.97 0.04 90)' };
  return { c: T.rust, bg: T.rustBg };
}

export function RatingsScreen({ tweaks }) {
  const { T, t } = useTheme();
  const [filter, setFilter] = useState('All');
  const [sort,   setSort]   = useState('ai');

  const rows   = filter === 'All' ? RATINGS : RATINGS.filter(x => x.type === filter);
  const sorted = [...rows].sort((a, b) => sort === 'ai' ? b.aiScore - a.aiScore : b.a - a.a);

  const tally = RATINGS.reduce((acc, r) => {
    const k = r.ai === 'Buy' || r.ai === 'Strong Buy' ? 'buy' : r.ai === 'Hold' ? 'hold' : 'sell';
    acc[k]++; return acc;
  }, { buy: 0, hold: 0, sell: 0 });

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('rate.eyebrow')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400, lineHeight: 1.05 }}>{t('rate.title')}</div>
            <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('rate.sub')}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[[t('common.buy'), tally.buy, T.sage, T.sageBg], [t('common.hold'), tally.hold, '#8a7430', 'oklch(0.97 0.04 90)'], [t('common.sell'), tally.sell, T.rust, T.rustBg]].map(([k, n, c, bg]) => (
              <div key={k} style={{ padding: '14px 20px', borderRadius: 14, background: bg, minWidth: 80, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: c, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
                <div style={{ fontFamily: T.serif, fontSize: 30, color: c, lineHeight: 1, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{n}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Stock', 'Crypto', 'ETF', 'Bond'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: 100, border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 13,
                background: f === filter ? T.ink : T.card,
                color: f === filter ? T.card : T.ink2,
              }}>{f}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 12, color: T.ink3 }}>
            Sort by:
            {[['ai', 'AI Score'], ['a', 'Analyst']].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} style={{
                padding: '5px 12px', borderRadius: 100, border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 12,
                background: sort === k ? T.ink : T.card,
                color: sort === k ? T.card : T.ink2,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Thead */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.4fr 0.8fr', padding: '13px 24px', borderBottom: `1px solid ${T.line}`, fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            <div>{t('rate.asset')}</div>
            <div style={{ textAlign: 'center' }}>{t('rate.aiSignal')}</div>
            <div style={{ textAlign: 'center' }}>{t('rate.analyst')}</div>
            <div style={{ textAlign: 'center' }}>{t('rate.aiScore')}</div>
            <div style={{ textAlign: 'right' }}>{t('rate.momentum')}</div>
          </div>

          {sorted.map((r, i) => {
            const ap  = pill(r.analyst, T);
            const aip = pill(r.ai,      T);
            return (
              <div key={r.sym} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.4fr 0.8fr',
                padding: '16px 24px', borderTop: i ? `1px solid ${T.line}` : 'none',
                transition: 'background 100ms', cursor: 'default',
              }}
                onMouseEnter={e => e.currentTarget.style.background = T.bg}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Asset */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 13, fontWeight: 600 }}>{r.sym.slice(0, 2)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.sym}</div>
                    <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{r.name}</div>
                  </div>
                </div>
                {/* Type */}
                <div style={{ textAlign: 'center', alignSelf: 'center' }}>
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 5, background: T.bg, border: `1px solid ${T.line}`, color: T.ink2 }}>{r.type}</span>
                </div>
                {/* Analyst */}
                <div style={{ textAlign: 'center', alignSelf: 'center' }}>
                  <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: ap.bg, color: ap.c, fontWeight: 600 }}>{r.analyst}</span>
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 4 }}>{r.a.toFixed(1)} ★</div>
                </div>
                {/* AI Score */}
                <div style={{ alignSelf: 'center', padding: '0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 5, background: T.bg, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${r.aiScore}%`, height: '100%', background: aip.c, opacity: 0.7 }} />
                    </div>
                    <span style={{ fontFamily: T.serif, fontSize: 18, fontVariantNumeric: 'tabular-nums', minWidth: 32, textAlign: 'right' }}>{r.aiScore}</span>
                    <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: aip.bg, color: aip.c, fontWeight: 600, minWidth: 36, textAlign: 'center' }}>{r.ai}</span>
                  </div>
                </div>
                {/* Momentum */}
                <div style={{ textAlign: 'right', alignSelf: 'center', fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: r.momentum >= 0 ? T.sage : T.rust }}>
                  {r.momentum >= 0 ? '+' : ''}{r.momentum}%
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: T.ink3, lineHeight: 1.6 }}>
          Analyst rating averaged from sell-side firms. AI score is generated daily from 18 market, technical, and sentiment features. Not financial advice.
        </div>
      </div>
    </div>
  );
}
