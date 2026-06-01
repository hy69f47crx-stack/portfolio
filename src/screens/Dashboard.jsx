import { useState, useCallback } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { ChartArea, Donut } from '../components/Charts';
import { usePortfolioStore, useComputedPortfolio } from '../store/portfolio';
import { usePrices } from '../hooks/usePrices';
import { fmtCurrency, fmtPct, fmtNum } from '../utils/format';

function buildSeries(total) {
  let v = total * 0.856; const out = [];
  for (let i = 0; i < 90; i++) {
    v += Math.sin(i * 0.27) * (total * 0.006) + Math.cos(i * 0.13) * (total * 0.003) + i * total * 0.0014;
    if (i > 60) v += Math.sin(i * 0.4) * (total * 0.009);
    out.push(Math.round(Math.max(v, total * 0.5)));
  }
  return out;
}

const TYPE_COLORS = {
  Stock: '#5b8f6a', Crypto: '#c98a4b', ETF: '#6a7fa3',
  Bond: '#a89178', Kuwait: '#7a6a52', Cash: '#a85f5f',
};
const ASSET_TYPES = ['Stock', 'ETF', 'Crypto', 'Kuwait', 'Bond', 'Cash'];

// ── Inline editable cell ─────────────────────────────────────────────────────
function EditCell({ holdingId, field, display, rawVal, editing, setEditing, editVal, setEditVal, onCommit, numeric, children, style = {} }) {
  const isActive = editing?.id === holdingId && editing?.field === field;
  const { T } = useTheme();

  function start(e) {
    e.stopPropagation();
    setEditing({ id: holdingId, field });
    setEditVal(String(rawVal ?? ''));
  }

  function commit(e) {
    e?.stopPropagation();
    onCommit(holdingId, field, editVal);
    setEditing(null);
  }

  if (isActive) {
    return (
      <input
        autoFocus
        value={editVal}
        onChange={e => setEditVal(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(e); if (e.key === 'Escape') setEditing(null); }}
        onClick={e => e.stopPropagation()}
        type={numeric ? 'number' : 'text'}
        step={numeric ? 'any' : undefined}
        style={{
          width: '100%', background: T.bg, border: `1.5px solid ${T.ink}`,
          borderRadius: 7, padding: '4px 8px', fontSize: 13, color: T.ink,
          fontFamily: 'inherit', outline: 'none', textAlign: numeric ? 'right' : 'left',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      onClick={start}
      title="Click to edit"
      style={{
        cursor: 'text', borderRadius: 6, padding: '3px 6px', margin: '-3px -6px',
        transition: 'background 120ms',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.bg}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children ?? display}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function Dashboard({ tweaks, onHoldingClick, onAddHolding }) {
  const { T, calmPos, calmPosBg, t, lang } = useTheme();
  const { portfolios, activeId, setActive, activePortfolio, updateHolding, deleteHolding, lastFetch } = usePortfolioStore();
  const { loading } = usePrices();

  // "Prices as of" disclosure — quotes are cached/delayed, not real-time
  const asOf = lastFetch
    ? new Date(lastFetch).toLocaleString(lang === 'ar' ? 'ar' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

  const cur     = tweaks?.currency || '$';
  const compact = tweaks?.numberFormat === 'compact';

  const { total, totalCost, pl, plPct, changeAbs, changePct, holdings, allocation } = useComputedPortfolio(cur);
  const portfolio = activePortfolio();

  // ── Editing state ──
  const [editing, setEditing]   = useState(null);   // { id, field }
  const [editVal, setEditVal]   = useState('');
  const [hovered, setHovered]   = useState(null);   // holdingId
  const [tf, setTf]             = useState('3M');

  const seriesAll = buildSeries(total || 127480);
  const TF_SLICES = { '1D': 2, '1W': 7, '1M': 30, '3M': 90, '1Y': 90, 'All': 90 };
  const series = seriesAll.slice(-Math.min(TF_SLICES[tf] || 90, seriesAll.length));

  const onCommit = useCallback((holdingId, field, val) => {
    if (!portfolio) return;
    let updates = {};
    if      (field === 'qty')         updates.qty         = Math.max(0, parseFloat(val) || 0);
    else if (field === 'avgCost')     updates.avgCost     = Math.max(0, parseFloat(val) || 0);
    else if (field === 'manualPrice') updates.manualPrice = val.trim() === '' ? null : Math.max(0, parseFloat(val) || 0);
    else if (field === 'sym')         updates.sym         = val.trim().toUpperCase() || undefined;
    else if (field === 'name')        updates.name        = val.trim() || undefined;
    else if (field === '_type')       updates.type        = val;
    if (updates.type || updates.sym || updates.name || updates.qty !== undefined || updates.avgCost !== undefined || updates.manualPrice !== undefined) {
      updateHolding(portfolio.id, holdingId, updates);
    }
  }, [portfolio, updateHolding]);

  const cellProps = { editing, setEditing, editVal, setEditVal, onCommit };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Portfolio switcher */}
        {portfolios.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            {portfolios.map(p => (
              <button key={p.id} onClick={() => setActive(p.id)} style={{
                padding: '5px 14px', borderRadius: 100, border: `1px solid ${T.line}`,
                background: p.id === activeId ? T.ink : T.card,
                color: p.id === activeId ? T.card : T.ink2,
                fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
                fontWeight: p.id === activeId ? 500 : 400,
              }}>{p.name}</button>
            ))}
            {loading && <span style={{ width: 7, height: 7, borderRadius: 4, background: T.sage, display: 'inline-block' }} />}
          </div>
        )}

        {/* ── Hero stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('dash.totalPortfolio')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 40, fontWeight: 400, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {fmtCurrency(total, { sym: cur, compact: false, decimals: 2 })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 5, background: calmPosBg(changeAbs), color: calmPos(changeAbs), fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                {changeAbs >= 0 ? '↑' : '↓'} {fmtCurrency(Math.abs(changeAbs), { sym: cur, compact, decimals: 2 })} · {fmtPct(changePct)}
              </span>
              <span style={{ fontSize: 11, color: T.ink3 }}>{t('common.today')}</span>
            </div>
            <div style={{ fontSize: 10, color: T.ink3, marginTop: 8 }}>
              {asOf
                ? `${t('dash.asOf')} ${asOf} · ${t('dash.delayed')}`
                : t('dash.noPrices')}
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('dash.allTimePL')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: calmPos(pl) }}>
              {pl >= 0 ? '+' : ''}{fmtCurrency(pl, { sym: cur, compact, decimals: 2 })}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 10 }}>
              {fmtPct(plPct)} · {t('common.cost')} {fmtCurrency(totalCost, { sym: cur, compact: true, decimals: 0 })}
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('dash.holdings')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, lineHeight: 1 }}>{holdings.length}</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 10 }}>{allocation.map(a => a.label).join(' · ')}</div>
          </div>

          {(() => {
            const best  = [...holdings].sort((a, b) => b.plPct - a.plPct)[0];
            const worst = [...holdings].sort((a, b) => a.plPct - b.plPct)[0];
            return (
              <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '22px 24px' }}>
                <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t('dash.bestWorst')}</div>
                {best && <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: T.serif, fontSize: 24 }}>{best.sym}</span>
                  <span style={{ fontSize: 14, color: T.sage, fontWeight: 500 }}>{fmtPct(best.plPct)}</span>
                </div>}
                {worst && worst.sym !== best?.sym && <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <span style={{ fontFamily: T.serif, fontSize: 20 }}>{worst.sym}</span>
                  <span style={{ fontSize: 13, color: T.rust, fontWeight: 500 }}>{fmtPct(worst.plPct)}</span>
                </div>}
              </div>
            );
          })()}
        </div>

        {/* ── Chart + Allocation ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14, marginBottom: 24 }}>

          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: T.serif, fontSize: 20 }}>{t('dash.performance')}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['1D','1W','1M','3M','1Y','All'].map(tf2 => (
                  <button key={tf2} onClick={() => setTf(tf2)} style={{
                    fontSize: 12, padding: '4px 12px', borderRadius: 100, border: 'none', cursor: 'pointer',
                    background: tf === tf2 ? T.ink : T.bg,
                    color: tf === tf2 ? T.card : T.ink2,
                    fontFamily: T.sans, fontWeight: tf === tf2 ? 500 : 400,
                  }}>{tf2}</button>
                ))}
              </div>
            </div>
            <ChartArea data={series} w={700} h={180} accent={T.sage} fill="rgba(95,142,108,0.10)" strokeW={2} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: T.ink3, fontVariantNumeric: 'tabular-nums' }}>
              <span>{fmtCurrency(series[0], { sym: cur, compact: true, decimals: 0 })}</span>
              <span>{fmtCurrency(series[series.length - 1], { sym: cur, compact: true, decimals: 0 })}</span>
            </div>
          </div>

          {/* Allocation donut — live from computed holdings */}
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: T.serif, fontSize: 20, marginBottom: 20 }}>{t('dash.allocation')}</div>
            {allocation.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <Donut slices={allocation} size={140} thick={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {allocation.map(s => (
                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, display: 'block' }} />
                        <span style={{ fontSize: 13, color: T.ink2 }}>{s.label}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink3, fontSize: 13 }}>
                {t('dash.noHoldings')}
              </div>
            )}
            <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${T.line}` }}>
              <div style={{ fontSize: 11, color: T.ink3 }}>{holdings.length} {t('dash.autoRefreshed')}</div>
            </div>
          </div>
        </div>

        {/* ── Holdings table (editable) ── */}
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>

          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1.2fr 1fr 1.1fr 1.1fr 1fr 0.7fr 40px',
            padding: '14px 24px',
            borderBottom: `1px solid ${T.line}`,
            fontSize: 11, color: T.ink3, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: 0.4,
          }}>
            <div>{t('rate.asset')}</div>
            <div style={{ textAlign: 'right' }}>{t('dash.price')} <span style={{ fontWeight: 400 }}>{t('dash.clickToEdit')}</span></div>
            <div style={{ textAlign: 'right' }}>{t('dash.qty')}</div>
            <div style={{ textAlign: 'right' }}>{t('dash.avgCost')}</div>
            <div style={{ textAlign: 'right' }}>{t('dash.mktValue')}</div>
            <div style={{ textAlign: 'right' }}>{t('dash.pl')}</div>
            <div style={{ textAlign: 'right' }}>{t('dash.alloc')}</div>
            <div />
          </div>

          {holdings.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 42, marginBottom: 16 }}>📊</div>
              <div style={{ fontFamily: T.serif, fontSize: 24, marginBottom: 10 }}>{t('dash.noHoldings')}</div>
              <div style={{ fontSize: 14, color: T.ink3, marginBottom: 24 }}>{t('dash.addFirst')}</div>
              <button onClick={onAddHolding} style={{
                padding: '10px 28px', borderRadius: 100, background: T.ink, color: T.card,
                border: 'none', fontSize: 14, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer',
              }}>{t('dash.addHolding')}</button>
            </div>
          ) : holdings.map((h, i) => {
            const isHovered = hovered === h.id;
            const hasManual = h.manualPrice != null;

            return (
              <div key={h.id || h.sym}
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.2fr 1fr 1.1fr 1.1fr 1fr 0.7fr 40px',
                  padding: '14px 24px',
                  borderTop: i === 0 ? 'none' : `1px solid ${T.line}`,
                  background: isHovered ? T.bg : 'transparent',
                  transition: 'background 100ms',
                  alignItems: 'center',
                }}
              >
                {/* ── Asset name + symbol (editable) ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${TYPE_COLORS[h.type] || '#999'}18`,
                    border: `1px solid ${TYPE_COLORS[h.type] || '#999'}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.serif, fontSize: 12, color: TYPE_COLORS[h.type] || T.ink, fontWeight: 600,
                    cursor: 'default',
                  }}>
                    {h.sym.slice(0, 2)}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {/* Symbol */}
                    <EditCell holdingId={h.id} field="sym" rawVal={h.sym} {...cellProps}
                      style={{ fontSize: 14, fontWeight: 600 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{h.sym}</span>
                    </EditCell>
                    {/* Name + type badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <EditCell holdingId={h.id} field="name" rawVal={h.name} {...cellProps}
                        style={{ fontSize: 11, color: T.ink3 }}>
                        <span style={{ fontSize: 11, color: T.ink3 }}>{h.name}</span>
                      </EditCell>
                      {/* Type cycler */}
                      <button
                        onClick={e => { e.stopPropagation(); const idx = ASSET_TYPES.indexOf(h.type); onCommit(h.id, '_type', ASSET_TYPES[(idx + 1) % ASSET_TYPES.length]); e.currentTarget.blur(); }}
                        title="Click to change type"
                        style={{
                          fontSize: 10, padding: '1px 6px', borderRadius: 4,
                          background: `${TYPE_COLORS[h.type] || '#999'}20`,
                          color: TYPE_COLORS[h.type] || T.ink3,
                          border: `1px solid ${TYPE_COLORS[h.type] || '#999'}30`,
                          fontFamily: T.sans, cursor: 'pointer', flexShrink: 0,
                        }}>{h.type}</button>
                    </div>
                  </div>
                </div>

                {/* ── Price (live or manual override) ── */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                    <EditCell holdingId={h.id} field="manualPrice"
                      rawVal={hasManual ? h.manualPrice : h.price}
                      {...cellProps} numeric
                      style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums', fontWeight: 500, textAlign: 'right' }}>
                      <span style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                        {fmtCurrency(h.price, { sym: cur, compact, decimals: 2 })}
                      </span>
                    </EditCell>
                    {hasManual
                      ? <span title={t('dash.manualPrice')} style={{ fontSize: 9, color: T.amber, background: `${T.amber}20`, padding: '1px 5px', borderRadius: 3, border: `1px solid ${T.amber}40`, cursor: 'default' }}>M</span>
                      : <span title={t('dash.livePrice')} style={{ fontSize: 9, color: T.sage, background: `${T.sage}20`, padding: '1px 5px', borderRadius: 3, border: `1px solid ${T.sage}40`, cursor: 'default' }}>L</span>
                    }
                  </div>
                  <div style={{ fontSize: 11, color: calmPos(h.day), marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{fmtPct(h.day)}</div>
                  {hasManual && (
                    <button onClick={e => { e.stopPropagation(); updateHolding(portfolio.id, h.id, { manualPrice: null }); }}
                      style={{ fontSize: 9, color: T.ink3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 2 }}>
                      {t('dash.resetToLive')}
                    </button>
                  )}
                </div>

                {/* ── Qty (editable) ── */}
                <div style={{ textAlign: 'right' }}>
                  <EditCell holdingId={h.id} field="qty" rawVal={h.qty} {...cellProps} numeric
                    style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                      {fmtNum(h.qty, h.type === 'Crypto' ? 4 : 2)}
                    </span>
                  </EditCell>
                </div>

                {/* ── Avg Cost (editable) ── */}
                <div style={{ textAlign: 'right' }}>
                  <EditCell holdingId={h.id} field="avgCost" rawVal={h.avgCost} {...cellProps} numeric
                    style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>
                      {fmtCurrency(h.avgCost, { sym: cur, compact, decimals: 2 })}
                    </span>
                  </EditCell>
                </div>

                {/* Market value */}
                <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtCurrency(h.value, { sym: cur, compact, decimals: 2 })}
                </div>

                {/* P&L */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: calmPos(h.pl), fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                    {h.pl >= 0 ? '+' : ''}{fmtCurrency(h.pl, { sym: cur, compact, decimals: 2 })}
                  </div>
                  <div style={{ fontSize: 11, color: calmPos(h.plPct), marginTop: 2 }}>{fmtPct(h.plPct)}</div>
                </div>

                {/* Allocation bar */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                    {h.alloc.toFixed(1)}%
                  </div>
                  <div style={{ marginTop: 5, height: 3, background: T.bg, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, h.alloc)}%`, height: '100%', background: TYPE_COLORS[h.type] || T.sage, opacity: 0.8 }} />
                  </div>
                </div>

                {/* Delete button */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={e => { e.stopPropagation(); if (window.confirm(`Remove ${h.sym}?`)) deleteHolding(portfolio.id, h.id); }}
                    style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: isHovered ? T.rustBg || '#f9eaea' : 'transparent',
                      border: isHovered ? `1px solid ${T.rust}30` : '1px solid transparent',
                      color: isHovered ? T.rust : 'transparent',
                      fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 150ms', fontFamily: T.sans,
                    }}
                  >×</button>
                </div>
              </div>
            );
          })}

          {/* Footer totals */}
          {holdings.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.2fr 1fr 1.1fr 1.1fr 1fr 0.7fr 40px',
              padding: '14px 24px', borderTop: `1px solid ${T.line}`, background: T.bg,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.ink2, alignSelf: 'center' }}>{t('dash.total')}</div>
              <div /><div /><div />
              <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', alignSelf: 'center' }}>
                {fmtCurrency(total, { sym: cur, compact, decimals: 2 })}
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: calmPos(pl), fontVariantNumeric: 'tabular-nums', alignSelf: 'center' }}>
                {pl >= 0 ? '+' : ''}{fmtCurrency(pl, { sym: cur, compact, decimals: 2 })}
              </div>
              <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 600, color: T.ink2, alignSelf: 'center' }}>100%</div>
              <div />
            </div>
          )}
        </div>

        {/* Edit hint + Add button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '0 4px' }}>
          <div style={{ fontSize: 12, color: T.ink3 }}>✎ {t('dash.editHint')}</div>
          <button onClick={onAddHolding} style={{
            padding: '9px 22px', borderRadius: 100, border: `1px solid ${T.line}`,
            background: T.card, color: T.ink2, fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {t('dash.addHoldingShort')}
          </button>
        </div>

      </div>
    </div>
  );
}
