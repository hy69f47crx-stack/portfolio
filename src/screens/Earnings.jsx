import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { EARNINGS } from '../data/extended';

const DAYS = ['Mo 25', 'Tu 26', 'We 27', 'Th 28', 'Fr 29', 'Sa 30', 'Su 31'];

export function EarningsScreen() {
  const { T, t } = useTheme();
  const [activeDay, setActiveDay] = useState(2);
  const [ownedOnly, setOwnedOnly] = useState(false);

  const filtered = ownedOnly ? EARNINGS.map(d => ({ ...d, entries: d.entries.filter(e => e.owned) })).filter(d => d.entries.length > 0) : EARNINGS;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('earn.eyebrow')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('earn.title')}</div>
            <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('earn.sub')}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setOwnedOnly(!ownedOnly)} style={{
              padding: '7px 16px', borderRadius: 9, border: `1px solid ${T.line}`, fontFamily: T.sans, fontSize: 13, cursor: 'pointer',
              background: ownedOnly ? T.ink : T.card, color: ownedOnly ? T.card : T.ink2,
            }}>{t('earn.owned')}</button>
          </div>
        </div>

        {/* Day strip */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setActiveDay(i)} style={{
              flex: 1, padding: '14px 8px', textAlign: 'center', border: `1px solid ${T.line}`, borderRadius: 12, cursor: 'pointer', fontFamily: T.sans,
              background: activeDay === i ? T.ink : T.card,
              color: activeDay === i ? T.card : T.ink2,
              transition: 'all 120ms',
            }}>
              <div style={{ fontSize: 11, opacity: 0.7 }}>{d.split(' ')[0]}</div>
              <div style={{ fontFamily: T.serif, fontSize: 22, marginTop: 3 }}>{d.split(' ')[1]}</div>
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
                {EARNINGS.find(e => e.date.includes(d.split(' ')[1]))?.entries.length || 0} reports
              </div>
            </button>
          ))}
        </div>

        {/* Earnings list - full table */}
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr', padding: '12px 24px', borderBottom: `1px solid ${T.line}`, fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
            <div>Company</div>
            <div>Date</div>
            <div>When</div>
            <div style={{ textAlign: 'right' }}>{t('earn.estEps')}</div>
            <div style={{ textAlign: 'right' }}>{t('earn.owned')}</div>
          </div>
          {filtered.flatMap(day => day.entries.map((e, ei) => (
            <div key={`${day.date}-${e.sym}`} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.8fr',
              padding: '16px 24px', borderTop: `1px solid ${T.line}`,
              alignItems: 'center',
              transition: 'background 100ms',
            }}
              onMouseEnter={ev => ev.currentTarget.style.background = T.bg}
              onMouseLeave={ev => ev.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 13 }}>{e.sym.slice(0, 2)}</div>
                  {e.owned && <span style={{ position: 'absolute', top: -3, right: -3, width: 11, height: 11, borderRadius: 6, background: T.sage, border: `2px solid ${T.card}` }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{e.sym}</div>
                  <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{e.name}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: T.ink2 }}>{day.date}</div>
              <div>
                <span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 5, background: T.bg, border: `1px solid ${T.line}`, color: T.ink2 }}>
                  {e.when === 'AMC' ? t('earn.amc') : t('earn.bmo')}
                </span>
              </div>
              <div style={{ textAlign: 'right', fontFamily: T.serif, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>
                ${e.est.toFixed(2)}
              </div>
              <div style={{ textAlign: 'right' }}>
                {e.owned
                  ? <span style={{ fontSize: 12, padding: '3px 9px', borderRadius: 5, background: T.sageBg, color: T.sageDeep, fontWeight: 600 }}>{t('earn.owned')}</span>
                  : <span style={{ fontSize: 12, color: T.ink3 }}>—</span>}
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
