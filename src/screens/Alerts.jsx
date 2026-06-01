import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { Toggle } from '../components/Toggle';
import { ALERTS } from '../data/extended';
import { fmtCurrency } from '../utils/format';

const ALERT_TYPES = ['Above', 'Below', '% Move', 'Signal flip', 'Volume'];
const TYPE_MAP = { Above: 'above', Below: 'below', '% Move': 'move%', 'Signal flip': 'signal', Volume: 'volume' };
const TYPE_LABEL = { above: '↑ Above', below: '↓ Below', 'move%': '± Move%', signal: '◆ Signal', volume: '⊞ Volume' };

const DEMO_SYMS = [
  { sym: 'NVDA', name: 'NVIDIA Corporation',  price: '890.20', exchange: 'NASDAQ' },
  { sym: 'AAPL', name: 'Apple Inc.',           price: '194.50', exchange: 'NASDAQ' },
  { sym: 'BTC',  name: 'Bitcoin',              price: '71840',  exchange: 'Crypto' },
  { sym: 'TSLA', name: 'Tesla Inc.',           price: '198.40', exchange: 'NASDAQ' },
  { sym: 'ETH',  name: 'Ethereum',             price: '3720',   exchange: 'Crypto' },
  { sym: 'SOL',  name: 'Solana',               price: '178.40', exchange: 'Crypto' },
];

export function AlertsScreen({ tweaks }) {
  const { T, t } = useTheme();
  const cur = tweaks?.currency || '$';

  // ── State ──
  const [alerts,       setAlerts]       = useState(ALERTS.map((a, i) => ({ ...a, id: i })));
  const [alertType,    setAlertType]    = useState('Above');
  const [selSym,       setSelSym]       = useState(DEMO_SYMS[0]);
  const [triggerVal,   setTriggerVal]   = useState('950');
  const [changingSymbol, setChangingSymbol] = useState(false);
  const [symSearch,    setSymSearch]    = useState('');
  const [saved,        setSaved]        = useState(false);

  function toggleAlert(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, armed: !a.armed } : a));
  }

  function deleteAlert(id) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  function createAlert() {
    const val = alertType === 'Signal flip' ? null : parseFloat(triggerVal);
    if (alertType !== 'Signal flip' && (isNaN(val) || val <= 0)) return;
    const newAlert = {
      id: Date.now(),
      sym: selSym.sym,
      type: TYPE_MAP[alertType] || 'above',
      value: val,
      armed: true,
      note: `Set via composer`,
    };
    setAlerts(prev => [newAlert, ...prev]);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const filteredSyms = DEMO_SYMS.filter(s =>
    s.sym.toLowerCase().includes(symSearch.toLowerCase()) ||
    s.name.toLowerCase().includes(symSearch.toLowerCase())
  );

  const armed = alerts.filter(a => a.armed).length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('alert.eyebrow')}</div>
          <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('alert.title')}</div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('alert.sub')}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24 }}>

          {/* Left: Active alerts */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: T.serif, fontSize: 22 }}>{t('alert.active')}</div>
              <div style={{ fontSize: 13, color: T.ink3 }}>{armed} {t('alert.armed')} · {alerts.length} {t('alert.total')}</div>
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              {/* Thead */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 36px', padding: '12px 22px', borderBottom: `1px solid ${T.line}`, fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                <div>{t('alert.symbol')}</div>
                <div>{t('alert.typeCol')}</div>
                <div>{t('alert.trigger')}</div>
                <div style={{ textAlign: 'right' }}>{t('alert.activeCol')}</div>
                <div />
              </div>
              {alerts.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: T.ink3, fontSize: 13 }}>{t('alert.noAlerts')}</div>
              ) : alerts.map((a) => (
                <div key={a.id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 80px 36px',
                  padding: '16px 22px', borderTop: `1px solid ${T.line}`,
                  alignItems: 'center',
                  opacity: a.armed ? 1 : 0.5,
                  transition: 'opacity 150ms',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 13 }}>
                      {a.sym.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{a.sym}</div>
                      <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{a.note}</div>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, background: T.bg, border: `1px solid ${T.line}`, color: T.ink2 }}>
                      {TYPE_LABEL[a.type] || a.type}
                    </span>
                  </div>
                  <div style={{ fontFamily: T.serif, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}>
                    {a.value !== null ? (a.type === 'move%' ? `${a.value}%` : fmtCurrency(a.value, { sym: cur, decimals: 0 })) : '—'}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Toggle on={a.armed} onChange={() => toggleAlert(a.id)} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => deleteAlert(a.id)}
                      title="Delete alert"
                      style={{ width: 24, height: 24, borderRadius: 6, background: 'none', border: 'none', color: T.ink3, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.background = T.rustBg || '#f9eaea'; e.currentTarget.style.color = T.rust; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = T.ink3; }}
                    >×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Composer */}
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 14 }}>{t('alert.newAlert')}</div>
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '24px' }}>

              {/* Symbol selector */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>{t('alert.symbol')}</div>
                {changingSymbol ? (
                  <div style={{ background: T.bg, borderRadius: 10, border: `1px solid ${T.line}`, overflow: 'hidden' }}>
                    <input
                      autoFocus
                      value={symSearch}
                      onChange={e => setSymSearch(e.target.value)}
                      placeholder={t('alert.searchSym')}
                      style={{ width: '100%', height: 44, padding: '0 14px', border: 'none', outline: 'none', background: 'none', fontSize: 14, color: T.ink, fontFamily: T.sans, boxSizing: 'border-box' }}
                    />
                    {filteredSyms.map(s => (
                      <div key={s.sym} onClick={() => { setSelSym(s); setChangingSymbol(false); setSymSearch(''); }} style={{
                        padding: '10px 14px', cursor: 'pointer', borderTop: `1px solid ${T.line}`, fontSize: 13,
                        display: 'flex', gap: 10, alignItems: 'center',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = T.bg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontWeight: 600, minWidth: 48 }}>{s.sym}</span>
                        <span style={{ color: T.ink3 }}>{s.name}</span>
                        <span style={{ marginLeft: 'auto', color: T.ink3, fontSize: 11 }}>{s.exchange}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: T.bg, borderRadius: 10, border: `1px solid ${T.line}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: T.card, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 12 }}>
                      {selSym.sym.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{selSym.sym}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>${selSym.price} · {selSym.exchange}</div>
                    </div>
                    <button onClick={() => setChangingSymbol(true)} style={{ marginLeft: 'auto', fontSize: 13, color: T.sage, background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.sans, fontWeight: 500 }}>
                      {t('alert.change')}
                    </button>
                  </div>
                )}
              </div>

              {/* Alert type */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>{t('alert.alertType')}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {ALERT_TYPES.map(k => (
                    <button key={k} onClick={() => setAlertType(k)} style={{
                      padding: '6px 14px', borderRadius: 100, border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 13,
                      background: alertType === k ? T.ink : T.bg,
                      color: alertType === k ? T.card : T.ink2,
                      transition: 'all 100ms',
                    }}>{k}</button>
                  ))}
                </div>
              </div>

              {/* Trigger price */}
              {alertType !== 'Signal flip' && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
                    {alertType === '% Move' ? t('alert.movePercent') : t('alert.triggerPrice')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: T.bg, border: `1px solid ${T.line}`, borderRadius: 10, overflow: 'hidden' }}>
                    <span style={{ padding: '0 14px', fontSize: 16, color: T.ink3, borderRight: `1px solid ${T.line}`, height: 46, display: 'flex', alignItems: 'center' }}>
                      {alertType === '% Move' ? '%' : cur}
                    </span>
                    <input
                      type="number"
                      value={triggerVal}
                      onChange={e => setTriggerVal(e.target.value)}
                      style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 18, fontFamily: T.serif, padding: '0 14px', color: T.ink, height: 46 }}
                    />
                  </div>
                </div>
              )}

              {/* Preview */}
              {alertType !== 'Signal flip' && triggerVal && (
                <div style={{ padding: '14px 16px', background: T.sageBg || '#eaf2ec', borderRadius: 10, fontSize: 13, color: T.sageDeep || '#3a6a47', lineHeight: 1.5, marginBottom: 18 }}>
                  {t('alert.alertWhen')} <strong>{selSym.sym}</strong> {t('alert.goesAbove')} <strong>{alertType === '% Move' ? triggerVal + '%' : cur + triggerVal}</strong>.
                </div>
              )}
              {alertType === 'Signal flip' && (
                <div style={{ padding: '14px 16px', background: T.amberBg || '#fdf5e8', borderRadius: 10, fontSize: 13, color: T.amber, lineHeight: 1.5, marginBottom: 18 }}>
                  {t('alert.signalFlip')} <strong>{selSym.sym}</strong> {t('alert.signalFlip2')}
                </div>
              )}

              <button
                onClick={createAlert}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  background: saved ? T.sage : T.ink,
                  color: T.card, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
                  transition: 'background 300ms',
                }}>
                {saved ? t('alert.created') : t('alert.create')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
