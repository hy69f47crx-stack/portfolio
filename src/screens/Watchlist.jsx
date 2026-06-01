import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { Spark } from '../components/Charts';
import { RATINGS, RECS } from '../data/portfolio';
import { usePortfolioStore } from '../store/portfolio';
import { fmtCurrency, fmtPct } from '../utils/format';

const SIGNAL_COLOR = { Buy: '#5b8f6a', Hold: '#c98a4b', Sell: '#a85f5f', '—': '#999' };
const ANALYST_COLOR = { 'Strong Buy': '#5b8f6a', Buy: '#5b8f6a', Hold: '#c98a4b', Sell: '#a85f5f', '—': '#999' };
const ASSET_TYPES = ['Stock', 'ETF', 'Crypto', 'Kuwait', 'Bond', 'Cash'];

// ── Asset Popup ───────────────────────────────────────────────────────────────
// mode = 'watched'  → "Add to Portfolio" + "Remove from Watchlist"
// mode = 'rec'      → "Add to Watchlist" + "Add to Portfolio" (stays on page)
function AssetPopup({ item, mode = 'watched', onClose, onAddToPortfolio, onRemove, onAddToWatchlist, T, calmPos, calmPosBg, cur }) {
  const { t } = useTheme();
  const rating = RATINGS.find(r => r.sym === item.sym) || {};
  const analystColor = ANALYST_COLOR[rating.analyst] || '#999';
  const signalColor  = SIGNAL_COLOR[rating.ai]       || '#999';
  const [watchedNow, setWatchedNow] = useState(false); // feedback after adding

  // Close on Escape
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.line}`, borderRadius: 20,
        padding: '28px 32px', width: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        fontFamily: T.sans, position: 'relative',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 28, height: 28, borderRadius: 8,
          background: T.bg, border: `1px solid ${T.line}`, cursor: 'pointer',
          fontSize: 16, color: T.ink3, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 16, fontWeight: 600 }}>
            {item.sym.slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{item.sym}</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{item.name}</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: T.serif, fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>
              {fmtCurrency(item.price, { sym: cur, decimals: 2 })}
            </div>
            <span style={{ fontSize: 12, padding: '2px 7px', borderRadius: 5, background: calmPosBg(item.ch), color: calmPos(item.ch), fontWeight: 500 }}>
              {item.ch >= 0 ? '+' : ''}{item.ch?.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Spark chart */}
        {item.spark && (
          <div style={{ background: T.bg, borderRadius: 12, padding: '12px 16px', marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: T.ink3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>7-Day</div>
            <Spark data={item.spark} w={300} h={48} color={calmPos(item.ch)} strokeW={2} />
          </div>
        )}

        {/* Analyst + AI signals */}
        {(rating.analyst || rating.ai) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '14px 16px', background: T.bg, borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{t('watch.analystRating')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: analystColor }}>{rating.analyst || '—'}</div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 3 }}>
                {rating.a ? `Score ${rating.a}/5` : ''}
              </div>
            </div>
            <div style={{ padding: '14px 16px', background: T.bg, borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 }}>{t('asset.aiSignal')}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: signalColor }}>{rating.ai || '—'}</div>
              <div style={{ fontSize: 11, color: T.ink3, marginTop: 3 }}>
                {rating.aiScore ? `Score ${rating.aiScore}/100` : ''}
              </div>
            </div>
          </div>
        )}

        {/* Actions — differ by mode */}
        {mode === 'watched' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onAddToPortfolio} style={{
              flex: 2, height: 42, borderRadius: 11, background: T.ink, color: T.card,
              border: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
            }}>
              {t('watch.addToPortfolio')}
            </button>
            <button onClick={onRemove} style={{
              flex: 1, height: 42, borderRadius: 11, background: T.rustBg || '#fdf0f0', color: T.rust,
              border: `1px solid ${T.rust}30`, fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
            }}>
              {t('watch.remove')}
            </button>
          </div>
        ) : (
          /* rec mode — both actions stay on this page */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { onAddToWatchlist?.(); setWatchedNow(true); }}
              disabled={watchedNow}
              style={{
                height: 42, borderRadius: 11, fontFamily: T.sans, cursor: watchedNow ? 'default' : 'pointer',
                fontSize: 14, fontWeight: 600, border: 'none',
                background: watchedNow ? (T.sageBg || '#eaf2ec') : T.ink,
                color:      watchedNow ? T.sage : T.card,
                transition: 'all 200ms',
              }}
            >
              {watchedNow ? t('watch.added') : t('watch.addToWatchlist')}
            </button>
            <button onClick={onAddToPortfolio} title={t('watch.addToPortfolio')} style={{
              height: 42, borderRadius: 11, background: T.bg, color: T.ink,
              border: `1px solid ${T.line}`, fontSize: 14, fontWeight: 500,
              fontFamily: T.sans, cursor: 'pointer',
            }}>
              {t('watch.addToPortfolio')} →
            </button>
          </div>
        )}

        <div style={{ marginTop: 12, fontSize: 10, color: T.ink3, textAlign: 'center' }}>
          {t('legal.bar').split('.')[0]}.
        </div>
      </div>
    </div>
  );
}

// ── Add to Watchlist Modal ────────────────────────────────────────────────────
function AddWatchlistModal({ onClose, onAdd, T }) {
  const { t } = useTheme();
  const [sym,  setSym]  = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Stock');
  const [err,  setErr]  = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  function handleAdd() {
    if (!sym.trim()) { setErr('Enter a symbol'); return; }
    onAdd({
      sym:   sym.trim().toUpperCase(),
      name:  name.trim() || sym.trim().toUpperCase(),
      type,
      price: 0,
      ch:    0,
      spark: [],
    });
    onClose();
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div style={{
        background: T.card, border: `1px solid ${T.line}`, borderRadius: 20,
        padding: '32px 36px', width: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', fontFamily: T.sans,
      }}>
        <div style={{ fontFamily: T.serif, fontSize: 22, marginBottom: 6 }}>{t('watch.addToWatchlist')}</div>
        <div style={{ fontSize: 13, color: T.ink3, marginBottom: 24 }}>{t('watch.fills')}</div>

        {/* Symbol */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, display: 'block', marginBottom: 7 }}>{t('watch.addSym')} *</label>
          <input
            ref={inputRef}
            value={sym}
            onChange={e => { setSym(e.target.value.toUpperCase()); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder={t('watch.symbolPlaceholder')}
            style={{
              width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
              border: `1.5px solid ${err ? T.rust : T.line}`, background: T.bg,
              fontSize: 15, color: T.ink, fontFamily: T.sans, outline: 'none',
              boxSizing: 'border-box', fontWeight: 600,
            }}
          />
          {err && <div style={{ fontSize: 11, color: T.rust, marginTop: 5 }}>{err}</div>}
        </div>

        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, display: 'block', marginBottom: 7 }}>{t('watch.addName')}</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('watch.namePlaceholder')}
            style={{
              width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
              border: `1.5px solid ${T.line}`, background: T.bg,
              fontSize: 14, color: T.ink, fontFamily: T.sans, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Type */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600, display: 'block', marginBottom: 7 }}>{t('add.assetType')}</label>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {ASSET_TYPES.map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 13, fontFamily: T.sans, cursor: 'pointer',
                background: type === t ? T.ink : T.bg,
                color:      type === t ? T.card : T.ink2,
                border: `1px solid ${type === t ? T.ink : T.line}`,
                fontWeight: type === t ? 500 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleAdd} style={{
            flex: 2, height: 46, borderRadius: 12, background: T.ink, color: T.card,
            border: 'none', fontSize: 15, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer',
          }}>{t('watch.addToWatchlist')}</button>
          <button onClick={onClose} style={{
            flex: 1, height: 46, borderRadius: 12, background: T.bg, color: T.ink2,
            border: `1px solid ${T.line}`, fontSize: 14, fontFamily: T.sans, cursor: 'pointer',
          }}>{t('common.cancel')}</button>
        </div>
      </div>
    </div>
  );
}

// ── Theme Expanded Panel ──────────────────────────────────────────────────────
function ThemePanel({ theme, onAdd, onClose, T, calmPos, calmPosBg, cur }) {
  const { t } = useTheme();
  return (
    <div style={{
      gridColumn: '1 / -1',
      background: T.bg, border: `1.5px solid ${theme.color}40`,
      borderRadius: 14, padding: '20px 24px',
      animation: 'fadeIn 150ms ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 12, height: 12, borderRadius: 4, background: theme.color, display: 'inline-block' }} />
          <span style={{ fontFamily: T.serif, fontSize: 18 }}>{theme.label}</span>
          <span style={{ fontSize: 12, color: T.ink3, background: T.card, padding: '2px 8px', borderRadius: 5, border: `1px solid ${T.line}` }}>
            {theme.stocks?.length} {t('watch.stocks')}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: T.ink3, padding: '0 4px' }}>×</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {theme.stocks?.map(s => (
          <div key={s.sym} style={{
            background: T.card, border: `1px solid ${T.line}`, borderRadius: 12,
            padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{s.sym}</span>
              <button
                onClick={() => onAdd(s)}
                title={t('watch.addToWatchlist')}
                style={{
                  width: 24, height: 24, borderRadius: 6, background: T.bg,
                  border: `1px solid ${T.line}`, cursor: 'pointer', fontSize: 14,
                  color: T.ink2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >+</button>
            </div>
            <div style={{ fontSize: 11, color: T.ink3 }}>{s.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: T.serif, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>
                {fmtCurrency(s.price, { sym: cur, decimals: 2 })}
              </span>
              <span style={{ fontSize: 12, color: calmPos(s.ch), fontWeight: 500 }}>
                {s.ch >= 0 ? '+' : ''}{s.ch?.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Watchlist Screen ─────────────────────────────────────────────────────
export function Watchlist({ tweaks, onNavigate }) {
  const { T, calmPos, calmPosBg, t } = useTheme();
  const { watchlist, addToWatchlist, removeFromWatchlist } = usePortfolioStore();
  const cur = tweaks?.currency || '$';

  const [popup,         setPopup]         = useState(null);   // { item, mode }
  const [showAddModal,  setShowAddModal]   = useState(false);
  const [expandedTheme, setExpandedTheme] = useState(null);

  const passedProps = { T, calmPos, calmPosBg, cur };

  // Open rec popup — stays on this page
  function openRecPopup(item) {
    setPopup({ item: { ...item, spark: item.spark || [] }, mode: 'rec' });
  }

  function handleThemeAdd(stock) {
    addToWatchlist({ ...stock, spark: [] });
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('watch.eyebrow')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('watch.title')}</div>
            <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{t('watch.subtitle')}</div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${T.line}`, background: T.card, color: T.ink, fontSize: 13, fontFamily: T.sans, cursor: 'pointer', fontWeight: 500 }}
          >
            {t('watch.addWatchlist')}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Watching table */}
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: T.serif, fontSize: 20 }}>{t('watch.watching')}</span>
                <span style={{ fontSize: 12, color: T.ink3 }}>{watchlist.length} {t('watch.stocks')} · {t('watch.clickToExplore')}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 1fr', padding: '10px 22px', borderBottom: `1px solid ${T.line}`, fontSize: 11, color: T.ink3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                <div>{t('watch.asset')}</div>
                <div style={{ textAlign: 'center' }}>{t('watch.7d')}</div>
                <div style={{ textAlign: 'right' }}>{t('watch.price')}</div>
              </div>

              {watchlist.length === 0 ? (
                <div style={{ padding: '40px 22px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>👀</div>
                  <div style={{ fontFamily: T.serif, fontSize: 20, marginBottom: 8 }}>{t('watch.nothingTracked')}</div>
                  <div style={{ fontSize: 13, color: T.ink3 }}>{t('watch.startTracking')}</div>
                </div>
              ) : watchlist.map((w, i) => (
                <div
                  key={w.sym}
                  onClick={() => setPopup({ item: w, mode: 'watched' })}
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 80px 1fr',
                    alignItems: 'center', padding: '15px 22px',
                    borderTop: i ? `1px solid ${T.line}` : 'none',
                    cursor: 'pointer', transition: 'background 100ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 13, fontWeight: 600 }}>
                      {w.sym.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{w.sym}</div>
                      <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>{w.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {w.spark?.length > 0
                      ? <Spark data={w.spark} w={64} h={24} color={calmPos(w.ch)} strokeW={1.5} />
                      : <span style={{ fontSize: 11, color: T.ink3 }}>—</span>
                    }
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {w.price > 0 ? fmtCurrency(w.price, { sym: cur, decimals: 2 }) : '—'}
                    </div>
                    {w.price > 0 && (
                      <div style={{ fontSize: 12, color: calmPos(w.ch), marginTop: 2 }}>{fmtPct(w.ch)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Themes */}
            <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.line}`, fontFamily: T.serif, fontSize: 20 }}>{t('watch.themes')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                {RECS.themes.map((th, i) => {
                  const isExpanded = expandedTheme === th.label;
                  return (
                    <div
                      key={th.label}
                      onClick={() => setExpandedTheme(isExpanded ? null : th.label)}
                      style={{
                        padding: '20px 22px', cursor: 'pointer',
                        borderTop: i >= 2 ? `1px solid ${T.line}` : 'none',
                        borderLeft: i % 2 === 1 ? `1px solid ${T.line}` : 'none',
                        position: 'relative', overflow: 'hidden',
                        background: isExpanded ? `${th.color}10` : 'transparent',
                        transition: 'background 120ms',
                      }}
                      onMouseEnter={e => !isExpanded && (e.currentTarget.style.background = T.bg)}
                      onMouseLeave={e => !isExpanded && (e.currentTarget.style.background = 'transparent')}
                    >
                      <div style={{ position: 'absolute', top: -14, right: -14, width: 64, height: 64, borderRadius: 32, background: th.color, opacity: 0.12 }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{th.label}</div>
                      <div style={{ fontSize: 12, color: T.ink3, marginTop: 4 }}>{th.count} assets</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                        <div style={{ width: 28, height: 3, borderRadius: 2, background: th.color, opacity: 0.6 }} />
                        <span style={{ fontSize: 11, color: th.color, fontWeight: 600 }}>
                          {isExpanded ? t('watch.collapseBtn') : t('watch.exploreBtn')}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Expanded theme panel — spans full width */}
                {expandedTheme && (() => {
                  const theme = RECS.themes.find(t => t.label === expandedTheme);
                  return theme ? (
                    <ThemePanel
                      key={expandedTheme}
                      theme={theme}
                      onAdd={handleThemeAdd}
                      onClose={() => setExpandedTheme(null)}
                      {...passedProps}
                    />
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          {/* ── Right column — Recommendations ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { titleKey: 'watch.becauseYouOwn', items: RECS.becauseYou },
              { titleKey: 'watch.trending',       items: RECS.trending   },
              { titleKey: 'watch.aiPicks',        items: RECS.aiPicks    },
            ].map(({ titleKey, items }) => (
              <div key={titleKey} style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: T.serif, fontSize: 20 }}>{t(titleKey)}</span>
                  <span style={{ fontSize: 12, color: T.ink3 }}>{t('watch.clickToExplore')}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 0 }}>
                  {items.map((it, i) => (
                    <div
                      key={it.sym}
                      onClick={() => openRecPopup(it)}
                      style={{
                        padding: '18px 20px',
                        borderLeft: i ? `1px solid ${T.line}` : 'none',
                        transition: 'background 100ms',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = T.bg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600 }}>{it.sym}</div>
                          <div style={{ fontSize: 11, color: T.ink3, marginTop: 2 }}>{it.name}</div>
                        </div>
                        {/* + chip — also opens popup */}
                        <div
                          onClick={e => { e.stopPropagation(); openRecPopup(it); }}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: T.bg, border: `1px solid ${T.line}`,
                            color: T.ink2, fontSize: 18, fontWeight: 300,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >+</div>
                      </div>
                      <div style={{ fontFamily: T.serif, fontSize: 22, marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
                        {fmtCurrency(it.price, { sym: cur, decimals: 2 })}
                      </div>
                      <div style={{ fontSize: 12, color: calmPos(it.ch), marginTop: 3, fontWeight: 500 }}>{fmtPct(it.ch)}</div>
                      <div style={{ marginTop: 10, fontSize: 11, color: T.ink3, padding: '4px 8px', borderRadius: 5, background: T.bg, display: 'inline-block' }}>
                        {it.why}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset popup — shared by Watching rows (mode=watched) and rec cards (mode=rec) */}
      {popup && (
        <AssetPopup
          item={popup.item}
          mode={popup.mode}
          onClose={() => setPopup(null)}
          onAddToPortfolio={() => {
            // Navigate to Add Holding; for rec mode we also close the popup first
            setPopup(null);
            onNavigate?.('add-holding', { prefill: { sym: popup.item.sym, name: popup.item.name } });
          }}
          onRemove={() => { removeFromWatchlist(popup.item.sym); setPopup(null); }}
          onAddToWatchlist={() => addToWatchlist({
            sym:   popup.item.sym,
            name:  popup.item.name,
            price: popup.item.price || 0,
            ch:    popup.item.ch    || 0,
            spark: popup.item.spark || [],
          })}
          {...passedProps}
        />
      )}

      {/* Add to Watchlist modal */}
      {showAddModal && (
        <AddWatchlistModal
          onClose={() => setShowAddModal(false)}
          onAdd={addToWatchlist}
          T={T}
        />
      )}
    </div>
  );
}
