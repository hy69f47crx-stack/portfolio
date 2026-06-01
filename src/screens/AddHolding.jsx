import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { usePortfolioStore } from '../store/portfolio';

const ASSET_TYPES = ['Stock', 'ETF', 'Crypto', 'Kuwait', 'Bond', 'Cash'];

const TYPE_HINTS = {
  Stock:  'e.g. AAPL, MSFT, NVDA, TSLA, AMZN',
  ETF:    'e.g. VTI, QQQ, SPY, ARKK, SCHD',
  Crypto: 'e.g. BTC, ETH, SOL, BNB, AVAX',
  Kuwait: 'e.g. NBK, ZAIN, KIPCO, KFH, GBK',
  Bond:   'e.g. TLT, AGG, BND, SGOV',
  Cash:   'e.g. KWD Cash, USD Savings',
};

const TYPE_EXCHANGES = {
  Stock: 'NASDAQ', ETF: 'NYSE', Crypto: 'Crypto', Kuwait: 'Boursa Kuwait', Bond: 'NYSE', Cash: 'Cash',
};

const KUWAIT_STOCKS = [
  { sym: 'NBK',    name: 'National Bank of Kuwait'     },
  { sym: 'ZAIN',   name: 'Zain Kuwait'                 },
  { sym: 'KIPCO',  name: 'Kuwait Projects Co.'         },
  { sym: 'AGLT',   name: 'Agility Public Warehousing'  },
  { sym: 'KFH',    name: 'Kuwait Finance House'        },
  { sym: 'GBK',    name: 'Gulf Bank'                   },
  { sym: 'BKME',   name: 'Bank of Kuwait & Middle East'},
  { sym: 'BURG',   name: 'Burgan Bank'                 },
  { sym: 'WARBA',  name: 'Warba Bank'                  },
  { sym: 'MEZZAN', name: 'Mezzan Holding'              },
];

export function AddHolding({ onBack, prefill }) {
  const { T, t } = useTheme();
  const { addHolding, activePortfolio } = usePortfolioStore();
  const portfolio = activePortfolio();

  const [type,     setType]     = useState(prefill?.type  || 'Stock');
  const [sym,      setSym]      = useState(prefill?.sym   || '');
  const [name,     setName]     = useState(prefill?.name  || '');
  const [qty,      setQty]      = useState('');
  const [avgCost,  setAvgCost]  = useState('');
  const [manPrice, setManPrice] = useState('');
  const [errors,   setErrors]   = useState({});
  const [saved,    setSaved]    = useState(false);

  function validate() {
    const e = {};
    if (!sym.trim())                                      e.sym     = 'Symbol required';
    if (!qty     || isNaN(+qty)     || +qty <= 0)         e.qty     = 'Enter a valid quantity';
    if (!avgCost || isNaN(+avgCost) || +avgCost < 0)      e.avgCost = 'Enter a valid cost';
    if (type === 'Kuwait' && (!manPrice || isNaN(+manPrice))) e.manPrice = 'Enter current price';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    addHolding(portfolio?.id, {
      sym: sym.trim().toUpperCase(),
      name: name.trim() || sym.trim().toUpperCase(),
      type,
      exchange: TYPE_EXCHANGES[type],
      qty: parseFloat(qty),
      avgCost: parseFloat(avgCost),
      ...(type === 'Kuwait' ? { manualPrice: parseFloat(manPrice) } : {}),
    });
    setSaved(true);
    setTimeout(() => onBack?.(), 900);
  }

  const Field = ({ label, value, onChange, placeholder, error, right, hint }) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 7, fontWeight: 600 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', background: T.bg, border: `1.5px solid ${error ? T.rust : T.line}`, borderRadius: 10, overflow: 'hidden', height: 46 }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: T.ink, fontFamily: T.sans, padding: '0 14px', height: '100%' }}
        />
        {right && <span style={{ padding: '0 14px', fontSize: 13, color: T.ink3, borderLeft: `1px solid ${T.line}`, height: '100%', display: 'flex', alignItems: 'center' }}>{right}</span>}
      </div>
      {error && <div style={{ fontSize: 11, color: T.rust, marginTop: 5 }}>{error}</div>}
      {hint  && <div style={{ fontSize: 11, color: T.ink3, marginTop: 5 }}>{hint}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.ink2, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontFamily: T.sans, padding: 0 }}>
          {t('add.back')}
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('add.title')}</div>
          <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('add.addingTo')} <strong>{portfolio?.name || 'My Portfolio'}</strong></div>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '28px 32px' }}>

          {/* Asset type */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10, fontWeight: 600 }}>{t('add.assetType')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {ASSET_TYPES.map(t => (
                <button key={t} onClick={() => { setType(t); setSym(''); setName(''); }} style={{
                  padding: '7px 16px', borderRadius: 9, border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 13,
                  background: type === t ? T.ink : T.bg,
                  color: type === t ? T.card : T.ink2,
                  fontWeight: type === t ? 500 : 400,
                }}>{t}</button>
              ))}
            </div>
          </div>

          {/* Kuwait quick-pick */}
          {type === 'Kuwait' && (
            <div style={{ marginBottom: 24, padding: '16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 12, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10, fontWeight: 600 }}>{t('add.quickSelect')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {KUWAIT_STOCKS.map(k => (
                  <button key={k.sym} onClick={() => { setSym(k.sym); setName(k.name); }} style={{
                    padding: '5px 12px', borderRadius: 7, border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: 12,
                    background: sym === k.sym ? T.ink : T.card,
                    color: sym === k.sym ? T.card : T.ink2,
                  }}>{k.sym}</button>
                ))}
              </div>
            </div>
          )}

          {/* Form fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <Field label={t('add.symbol')} value={sym} onChange={v => setSym(v.toUpperCase())} placeholder={TYPE_HINTS[type]} error={errors.sym} />
            <Field label={t('add.assetName')} value={name} onChange={setName} placeholder={t('add.assetNamePh')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <Field label={t('add.quantity')} value={qty} onChange={setQty} placeholder={type === 'Crypto' ? '0.5' : '10'} error={errors.qty} />
            <Field label={t('add.avgCost')} value={avgCost} onChange={setAvgCost} placeholder="0.00" right="USD" error={errors.avgCost}
              hint={type === 'Kuwait' ? t('add.avgCostKwt') : t('add.avgCostHint')} />
          </div>

          {type === 'Kuwait' && (
            <div style={{ marginBottom: 18 }}>
              <Field label={t('add.currentPrice')} value={manPrice} onChange={setManPrice} placeholder="0.000" right="KD" error={errors.manPrice} />
            </div>
          )}

          {/* Info note */}
          <div style={{ padding: '14px 16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.line}`, marginBottom: 24, fontSize: 13, color: T.ink3, lineHeight: 1.5 }}>
            {type === 'Kuwait'
              ? t('add.kuwaitNote')
              : t('add.liveNote')}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onBack} style={{ flex: 1, height: 48, borderRadius: 12, background: T.bg, border: `1px solid ${T.line}`, color: T.ink2, fontSize: 14, fontFamily: T.sans, cursor: 'pointer' }}>
              {t('add.cancel')}
            </button>
            <button onClick={handleSave} style={{
              flex: 2, height: 48, borderRadius: 12,
              background: saved ? T.sage : T.ink, color: T.card, border: 'none',
              fontSize: 15, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
              transition: 'background 0.3s',
            }}>
              {saved ? t('add.added') : t('add.addHolding')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
