import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ChartArea, ChartCandles } from '../components/Charts';
import { usePortfolioStore, useComputedPortfolio } from '../store/portfolio';
import { fmtCurrency, fmtPct, fmtNum } from '../utils/format';

const TF_SLICES = { '1D': 2, '1W': 7, '1M': 30, '3M': 60, '1Y': 90, 'All': 120 };

const ENRICHMENT = {
  NVDA: { exchange: 'NASDAQ', fund: { mcap: '2.19T', pe: 68.4, eps: 13.02, div: '0.04%', beta: 1.66, peg: 1.22 }, analyst: { buy: 38, hold: 4, sell: 1, consensus: 'Strong Buy', target: 1020 }, ai: { score: 82, signal: 'Buy', confidence: 0.74, target: 980 }, news: [{ src: 'Market Wire', time: '12m', head: 'NVIDIA expands Blackwell shipments amid record data-center demand' }, { src: 'Portfolio Feed', time: '1h', head: 'Analysts raise FY26 targets after sovereign AI deals in EMEA' }, { src: 'Tech Brief', time: '5h', head: 'Supply constraints ease as TSMC ramps CoWoS capacity 2.4× YoY' }] },
  AAPL: { exchange: 'NASDAQ', fund: { mcap: '2.95T', pe: 29.1, eps: 6.57, div: '0.52%', beta: 1.24, peg: 2.81 }, analyst: { buy: 31, hold: 9, sell: 2, consensus: 'Buy', target: 225 }, ai: { score: 58, signal: 'Hold', confidence: 0.61, target: 210 }, news: [] },
  TSLA: { exchange: 'NASDAQ', fund: { mcap: '630B', pe: 52.3, eps: 3.62, div: '—', beta: 2.01, peg: 3.12 }, analyst: { buy: 14, hold: 16, sell: 9, consensus: 'Hold', target: 195 }, ai: { score: 28, signal: 'Sell', confidence: 0.69, target: 175 }, news: [] },
  MSFT: { exchange: 'NASDAQ', fund: { mcap: '3.1T', pe: 34.2, eps: 12.41, div: '0.72%', beta: 0.91, peg: 2.18 }, analyst: { buy: 44, hold: 3, sell: 0, consensus: 'Strong Buy', target: 510 }, ai: { score: 76, signal: 'Buy', confidence: 0.77, target: 490 }, news: [] },
  VTI: { exchange: 'NYSE', fund: { mcap: 'N/A', pe: 24.1, eps: 'N/A', div: '1.32%', beta: 1.00, peg: null }, analyst: { buy: 28, hold: 4, sell: 0, consensus: 'Buy', target: 285 }, ai: { score: 70, signal: 'Buy', confidence: 0.68, target: 278 }, news: [] },
  BTC: { exchange: 'Crypto', fund: { mcap: '1.38T', pe: null, eps: null, div: '—', beta: 1.87, peg: null }, analyst: { buy: 18, hold: 8, sell: 2, consensus: 'Buy', target: 85000 }, ai: { score: 55, signal: 'Hold', confidence: 0.55, target: 78000 }, news: [] },
  ETH: { exchange: 'Crypto', fund: { mcap: '447B', pe: null, eps: null, div: '—', beta: 1.62, peg: null }, analyst: { buy: 14, hold: 9, sell: 3, consensus: 'Hold', target: 4200 }, ai: { score: 49, signal: 'Hold', confidence: 0.51, target: 3900 }, news: [] },
};

function buildSeries(price) {
  const base = price * 0.65; let v = base; const out = [];
  for (let i = 0; i < 120; i++) { v += Math.sin(i * 0.21) * (price * 0.009) + i * price * 0.003 + (Math.random() - 0.5) * (price * 0.004); out.push(+Math.max(v, base * 0.8).toFixed(2)); }
  return out;
}
function buildCandles(price) {
  const out = []; let p = price * 0.92;
  for (let i = 0; i < 60; i++) {
    const o = p; const c = p + (Math.random() - 0.45) * price * 0.025;
    const h = Math.max(o, c) + Math.random() * price * 0.009;
    const l = Math.min(o, c) - Math.random() * price * 0.009;
    out.push({ o, c, h, l }); p = c;
  }
  return out;
}

export function Asset({ tweaks, onBack, onNavigate, sym: symProp }) {
  const { T, t, calmPos, calmPosBg } = useTheme();
  const { prices, activePortfolio, updateHolding, deleteHolding } = usePortfolioStore();
  const { holdings } = useComputedPortfolio(tweaks?.currency || '$');
  const [tab, setTab] = useState('overview');
  const [tf, setTf] = useState('3M');
  const [sellModal, setSellModal] = useState({ open: false, qty: '' });
  const portfolio = activePortfolio();

  const cur = tweaks?.currency || '$';
  const compact = tweaks?.numberFormat === 'compact';
  const chartView = tweaks?.chartType || 'line';

  const sym = symProp || 'NVDA';
  const holding   = holdings.find(h => h.sym === sym);
  const priceData = prices[sym];
  const enrich    = ENRICHMENT[sym] || {};

  const price     = priceData?.price     || holding?.avgCost || 0;
  const changeAbs = priceData?.changeAbs || 0;
  const changePct = priceData?.changePct || 0;
  const exchange  = enrich.exchange || holding?.exchange || '—';
  const assetName = holding?.name || sym;

  const seriesAll  = buildSeries(price);
  const candlesAll = buildCandles(price);
  const sliceLen = TF_SLICES[tf] || 90;
  const series   = seriesAll.slice(-Math.min(sliceLen, seriesAll.length));
  const candles  = candlesAll.slice(-Math.min(Math.floor(sliceLen / 2), candlesAll.length));

  const fund     = enrich.fund     || {};
  const analyst  = enrich.analyst  || { buy: 0, hold: 0, sell: 0, consensus: '—', target: 0 };
  const aiRating = enrich.ai       || { score: 50, signal: '—', confidence: 0.5, target: 0 };
  const news     = enrich.news     || [];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Back */}
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T.ink2, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, fontFamily: T.sans, padding: 0 }}>
          {t('asset.back')}
        </button>

        {/* Hero header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: T.card, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 20, fontWeight: 600 }}>{sym.slice(0, 2)}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400 }}>{sym}</span>
                <span style={{ fontSize: 14, color: T.ink3, background: T.card, border: `1px solid ${T.line}`, borderRadius: 6, padding: '2px 8px' }}>{exchange}</span>
              </div>
              <div style={{ fontSize: 14, color: T.ink2, marginTop: 3 }}>{assetName}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: T.serif, fontSize: 44, fontWeight: 400, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmtCurrency(price, { sym: cur, compact, decimals: 2 })}
            </div>
            <div style={{ fontSize: 15, color: calmPos(changeAbs), fontWeight: 500, marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
              {changeAbs >= 0 ? '+' : ''}{fmtNum(changeAbs, 2)} ({fmtPct(changePct)}) {t('common.today')}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Chart */}
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '24px 24px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div style={{ fontFamily: T.serif, fontSize: 20 }}>{t('asset.priceHistory')}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['1D','1W','1M','3M','1Y','All'].map(t => (
                    <button key={t} onClick={() => setTf(t)} style={{
                      fontSize: 12, padding: '4px 12px', borderRadius: 100, border: 'none', cursor: 'pointer', fontFamily: T.sans,
                      background: tf === t ? T.ink : T.bg,
                      color: tf === t ? T.card : T.ink2,
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              {chartView === 'candle'
                ? <ChartCandles data={candles} w={680} h={200} up={T.sage} down={T.rust} />
                : <ChartArea data={series} w={680} h={200} accent={T.sage} fill="rgba(95,142,108,0.10)" strokeW={2} />}
            </div>

            {/* Tabs + tab content */}
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${T.line}`, padding: '0 8px' }}>
                {[['overview', t('asset.overview')], ['fundamentals', t('asset.fundamentals')], ['sentiment', t('asset.sentiment')], ['news', t('asset.news')]].map(([key, label]) => (
                  <button key={key} onClick={() => setTab(key)} style={{
                    padding: '14px 16px', fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: T.sans,
                    background: 'transparent',
                    color: tab === key ? T.ink : T.ink2,
                    fontWeight: tab === key ? 600 : 400,
                    borderBottom: tab === key ? `2px solid ${T.ink}` : '2px solid transparent',
                    marginBottom: -1,
                  }}>{label}</button>
                ))}
              </div>

              <div style={{ padding: '24px' }}>
                {/* Overview */}
                {tab === 'overview' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12 }}>{t('asset.analystRating')}</div>
                      <div style={{ fontFamily: T.serif, fontSize: 28, marginBottom: 6 }}>{analyst.consensus}</div>
                      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 12 }}>{analyst.buy + analyst.hold + analyst.sell} {t('common.analysts')}</div>
                      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: T.bg, gap: 2 }}>
                        <span style={{ flex: analyst.buy,  background: T.sage }} />
                        <span style={{ flex: analyst.hold, background: '#c9a356' }} />
                        <span style={{ flex: analyst.sell, background: T.rust }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: T.ink3 }}>
                        <span>{t('common.buy')} {analyst.buy}</span>
                        <span>{t('common.hold')} {analyst.hold}</span>
                        <span>{t('common.sell')} {analyst.sell}</span>
                      </div>
                      <div style={{ marginTop: 14, fontSize: 13, color: T.ink2 }}>
                        {t('asset.target')} <span style={{ fontFamily: T.serif, fontSize: 16, color: T.ink }}>{fmtCurrency(analyst.target, { sym: cur, decimals: 0 })}</span>
                      </div>
                    </div>
                    <div style={{ borderLeft: `1px solid ${T.line}`, paddingLeft: 24 }}>
                      <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12 }}>{t('asset.aiSignal')}</div>
                      <div style={{ fontFamily: T.serif, fontSize: 28, marginBottom: 6 }}>{aiRating.signal}</div>
                      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 12 }}>{t('asset.confidence')} {(aiRating.confidence * 100).toFixed(0)}%</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: T.bg, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${aiRating.score}%`, height: '100%', background: T.sage }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{aiRating.score}<span style={{ color: T.ink3, fontWeight: 400 }}>/100</span></span>
                      </div>
                      <div style={{ marginTop: 14, fontSize: 13, color: T.ink2 }}>
                        {t('asset.target')} <span style={{ fontFamily: T.serif, fontSize: 16, color: T.ink }}>{fmtCurrency(aiRating.target, { sym: cur, decimals: 0 })}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fundamentals */}
                {tab === 'fundamentals' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 32px' }}>
                    {[['Market Cap', fund.mcap], ['P/E Ratio', fund.pe], ['EPS', fund.eps], ['Dividend', fund.div], ['Beta', fund.beta], ['PEG', fund.peg]]
                      .filter(([, v]) => v != null)
                      .map(([k, v]) => (
                        <div key={k} style={{ paddingBottom: 14, borderBottom: `1px dashed ${T.line}` }}>
                          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 5 }}>{k}</div>
                          <div style={{ fontFamily: T.serif, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Sentiment */}
                {tab === 'sentiment' && (
                  <div>
                    <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                      <span style={{ flex: 67, background: T.sage }} />
                      <span style={{ flex: 21, background: '#c9a356' }} />
                      <span style={{ flex: 12, background: T.rust }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: T.sage, fontWeight: 600 }}>67% {t('asset.bullish')}</span>
                      <span style={{ color: '#c9a356' }}>21% {t('asset.neutral')}</span>
                      <span style={{ color: T.rust }}>12% {t('asset.bearish')}</span>
                    </div>
                    <div style={{ marginTop: 20, fontSize: 13, color: T.ink3 }}>14,203 {t('asset.mentions')} · +38% vs yesterday</div>
                  </div>
                )}

                {/* News */}
                {tab === 'news' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {(news.length ? news : [{ src: 'No news', time: '—', head: `${t('asset.noNews')} ${sym}` }]).map((n, i) => (
                      <div key={i} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < news.length - 1 ? `1px solid ${T.line}` : 'none' }}>
                        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: T.ink3, marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{n.src}</span>
                          <span>· {n.time}</span>
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.4 }}>{n.head}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Live data */}
            {priceData && (
              <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16 }}>{t('asset.liveData')}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    [t('asset.dayHigh'),  priceData.dayHigh  ? fmtCurrency(priceData.dayHigh, { sym: cur, decimals: 2 }) : '—'],
                    [t('asset.dayLow'),   priceData.dayLow   ? fmtCurrency(priceData.dayLow,  { sym: cur, decimals: 2 }) : '—'],
                    [t('asset.volume'),    priceData.volume   ? (priceData.volume / 1e6).toFixed(1) + 'M' : '—'],
                    [t('asset.updated'),   priceData.lastUpdated ? new Date(priceData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11, color: T.ink3, marginBottom: 5 }}>{k}</div>
                      <div style={{ fontFamily: T.serif, fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Position card */}
            {holding ? (
              <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px' }}>
                <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16 }}>{t('asset.position')}</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  {[
                    [t('asset.qty'),   fmtNum(holding.qty, holding.type === 'Crypto' ? 4 : 2)],
                    [t('asset.avgCost'),   fmtCurrency(holding.avgCost, { sym: cur, compact, decimals: 2 })],
                    [t('asset.value'),  fmtCurrency(holding.value, { sym: cur, compact, decimals: 2 })],
                    [t('asset.alloc'), holding.alloc.toFixed(1) + '%'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: T.bg, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 11, color: T.ink3, marginBottom: 5 }}>{k}</div>
                      <div style={{ fontFamily: T.serif, fontSize: 18, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px', borderRadius: 10, background: calmPosBg(holding.pl), display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: T.ink2 }}>{t('asset.pl')}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: calmPos(holding.pl), fontFamily: T.serif, fontVariantNumeric: 'tabular-nums' }}>
                      {holding.pl >= 0 ? '+' : ''}{fmtCurrency(holding.pl, { sym: cur, compact, decimals: 2 })}
                    </div>
                    <div style={{ fontSize: 12, color: calmPos(holding.plPct) }}>{fmtPct(holding.plPct)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px', textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: T.ink3, marginBottom: 14 }}>{t('asset.notInPortfolio')}</div>
                <button
                  onClick={() => onNavigate?.('add-holding', { prefill: { sym, name: assetName, type: 'Stock' } })}
                  style={{ width: '100%', padding: '10px', borderRadius: 10, background: T.ink, color: T.card, border: 'none', fontSize: 13, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer' }}>
                  {t('asset.addToPortfolio')}
                </button>
              </div>
            )}

            {/* Forecast */}
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px' }}>
              <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 16 }}>{t('asset.forecast')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[[t('asset.7days'), 'up', 2.4, 0.71], [t('asset.30days'), 'up', 8.1, 0.62], [t('asset.90days'), 'flat', 1.2, 0.44]].map(([k, dir, mag, conf]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: T.bg, borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: T.ink2 }}>{k}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: T.serif, fontSize: 18, color: dir === 'up' ? T.sage : dir === 'down' ? T.rust : T.ink, fontVariantNumeric: 'tabular-nums' }}>
                        {dir === 'up' ? '+' : dir === 'down' ? '−' : '±'}{mag.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{(conf * 100).toFixed(0)}% {t('common.conf')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy/Sell */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => holding && setSellModal({ open: true, qty: '1' })}
                style={{ flex: 1, height: 48, borderRadius: 12, background: T.card, border: `1px solid ${T.line}`, fontSize: 14, fontWeight: 500, fontFamily: T.sans, cursor: holding ? 'pointer' : 'not-allowed', color: holding ? T.ink : T.ink3, opacity: holding ? 1 : 0.5 }}>
                {t('common.sell')}
              </button>
              <button
                onClick={() => onNavigate?.('add-holding', { prefill: { sym, name: assetName, type: holding?.type || 'Stock' } })}
                style={{ flex: 2, height: 48, borderRadius: 12, background: T.ink, color: T.card, border: 'none', fontSize: 14, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer' }}>
                {t('asset.buyMore')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sell modal */}
      {sellModal.open && holding && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 20, padding: '32px 36px', maxWidth: 380, width: '100%', fontFamily: T.sans }}>
            <div style={{ fontFamily: T.serif, fontSize: 24, marginBottom: 6 }}>{t('sell.title')} {sym}</div>
            <div style={{ fontSize: 13, color: T.ink3, marginBottom: 24 }}>{t('sell.youHold')} {fmtNum(holding.qty, holding.type === 'Crypto' ? 4 : 2)} {t('sell.shares')} · {t('asset.avgCostLabel')} {fmtCurrency(holding.avgCost, { sym: cur, decimals: 2 })}</div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, fontWeight: 600 }}>{t('sell.qty')}</div>
              <input
                autoFocus
                type="number"
                min="0.0001"
                max={holding.qty}
                step="any"
                value={sellModal.qty}
                onChange={e => setSellModal(s => ({ ...s, qty: e.target.value }))}
                style={{ width: '100%', height: 46, borderRadius: 10, padding: '0 14px', border: `1.5px solid ${T.line}`, background: T.bg, fontSize: 16, color: T.ink, fontFamily: T.sans, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            {+sellModal.qty > 0 && +sellModal.qty <= holding.qty && (
              <div style={{ padding: '12px 14px', background: T.bg, borderRadius: 10, fontSize: 13, color: T.ink2, marginBottom: 18 }}>
                {t('sell.proceeds')} <strong>{fmtCurrency(+sellModal.qty * price, { sym: cur, decimals: 2 })}</strong> · {t('sell.remaining')} {fmtNum(holding.qty - +sellModal.qty, 4)} {t('sell.shares')}
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSellModal({ open: false, qty: '' })} style={{ flex: 1, height: 44, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, color: T.ink2, fontSize: 14, fontFamily: T.sans, cursor: 'pointer' }}>{t('sell.cancel')}</button>
              <button
                onClick={() => {
                  const n = parseFloat(sellModal.qty);
                  if (!n || n <= 0 || n > holding.qty || !portfolio) return;
                  const newQty = +(holding.qty - n).toFixed(8);
                  if (newQty <= 0) {
                    deleteHolding(portfolio.id, holding.id);
                  } else {
                    updateHolding(portfolio.id, holding.id, { qty: newQty });
                  }
                  setSellModal({ open: false, qty: '' });
                }}
                disabled={!sellModal.qty || +sellModal.qty <= 0 || +sellModal.qty > holding.qty}
                style={{ flex: 2, height: 44, borderRadius: 10, background: T.rust, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer', opacity: (!sellModal.qty || +sellModal.qty <= 0 || +sellModal.qty > holding.qty) ? 0.5 : 1 }}>
                {t('sell.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
