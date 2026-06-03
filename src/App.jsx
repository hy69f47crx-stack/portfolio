import { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './theme/ThemeContext.jsx';
import { createT } from './i18n/index.js';
import { NavBar } from './components/NavBar.jsx';
import { getFinnhubKey, setFinnhubKey, hasFinnhubKey } from './api/prices.js';

import { Dashboard }             from './screens/Dashboard';
import { Asset }                 from './screens/Asset';
import { RatingsScreen }         from './screens/Ratings';
import { Watchlist }             from './screens/Watchlist';
import { AIChat }                from './screens/AIChat';
import { InsightsScreen }        from './screens/Insights';
import { DigestScreen }          from './screens/Digest';
import { DiversificationScreen } from './screens/Diversification';
import { NotificationsScreen }   from './screens/Notifications';
import { AlertsScreen }          from './screens/Alerts';
import { EarningsScreen }        from './screens/Earnings';
import { MoreScreen }            from './screens/More';
import { AddHolding }            from './screens/AddHolding';

// ── Finnhub API Key Setup Modal ───────────────────────────────────────────────
function ApiKeyModal({ T, onDone }) {
  const [val, setVal]     = useState('');
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);

  async function handleSave() {
    const k = val.trim();
    if (!k) { setError('Paste your Finnhub API key above'); return; }
    setTesting(true);
    setError('');
    try {
      const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${k}`);
      const d = await r.json();
      if (d.c && d.c > 0) {
        setFinnhubKey(k);
        onDone();
      } else {
        setError('Key looks invalid — make sure you copied the full key from finnhub.io');
      }
    } catch {
      setError('Could not connect to Finnhub. Check your internet connection.');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: T.card, border: `1px solid ${T.line}`, borderRadius: 20,
        padding: '36px 40px', maxWidth: 520, width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)', fontFamily: T.sans,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: T.sageBg || '#eaf2ec', border: `1px solid ${T.sage}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            🔑
          </div>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22 }}>Connect Live Prices</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 3 }}>Free Finnhub API key — takes 30 seconds</div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { n: '1', text: 'Go to', link: 'https://finnhub.io/register', label: 'finnhub.io/register' },
            { n: '2', text: 'Sign up free — no credit card required' },
            { n: '3', text: 'Copy your API key from the Dashboard' },
            { n: '4', text: 'Paste it below and click Connect' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.ink2, flexShrink: 0 }}>{s.n}</span>
              <span style={{ fontSize: 13, color: T.ink2 }}>
                {s.text}{' '}
                {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ color: T.sage, fontWeight: 600 }}>{s.label}</a>}
              </span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, fontWeight: 600 }}>
            Your Finnhub API Key
          </div>
          <input
            value={val}
            onChange={e => { setVal(e.target.value); setError(''); }}
            placeholder="e.g. d1a2b3c4d5e6f7g8h9..."
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={{
              width: '100%', height: 46, borderRadius: 10, padding: '0 14px',
              border: `1.5px solid ${error ? T.rust : T.line}`,
              background: T.bg, fontSize: 14, color: T.ink, fontFamily: 'monospace',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
          {error && <div style={{ fontSize: 12, color: T.rust, marginTop: 6 }}>{error}</div>}
        </div>

        {/* What you get */}
        <div style={{ padding: '12px 16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.line}`, marginBottom: 20, fontSize: 12, color: T.ink3, lineHeight: 1.6 }}>
          ✅ <strong>Free tier includes:</strong> Real-time US stocks & ETFs · 60 API calls/min · No credit card · No expiry<br />
          🔒 Your key is stored only in your browser — never sent anywhere except Finnhub.
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleSave}
            disabled={testing}
            style={{
              flex: 2, height: 46, borderRadius: 12, background: T.ink, color: T.card,
              border: 'none', fontSize: 15, fontWeight: 600, fontFamily: T.sans,
              cursor: testing ? 'wait' : 'pointer', opacity: testing ? 0.7 : 1,
            }}
          >
            {testing ? 'Verifying…' : 'Connect & Save'}
          </button>
          <button
            onClick={onDone}
            style={{
              flex: 1, height: 46, borderRadius: 12, background: T.bg, color: T.ink2,
              border: `1px solid ${T.line}`, fontSize: 14, fontFamily: T.sans, cursor: 'pointer',
            }}
          >
            Skip for now
          </button>
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: T.ink3, textAlign: 'center', lineHeight: 1.5 }}>
          Crypto prices use CoinGecko (no key needed) · Kuwait stocks use manual prices
        </div>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { T, setMode, setLang } = useTheme();

  const [showApiSetup, setShowApiSetup] = useState(!hasFinnhubKey());
  const [dataNotice,   setDataNotice]   = useState(() => !localStorage.getItem('stratos-notice-v1'));
  const [screen,       setScreen]       = useState('dashboard');
  const [activeSym,    setActiveSym]    = useState(null);
  const [prefill,      setPrefill]      = useState(null); // for pre-populated AddHolding
  const [tweaks, setTweaksState]        = useState({
    theme: 'light', lang: 'en', currency: '$',
    numberFormat: 'full', density: 'comfortable', chartType: 'candle',
  });

  const setTweak = (k, v) => {
    setTweaksState(prev => {
      const next = { ...prev, [k]: v };
      if (k === 'theme') setMode(v);
      if (k === 'lang')  setLang(v);
      return next;
    });
  };

  const t = useMemo(() => createT(tweaks.lang), [tweaks.lang]);
  const tweaksFull = { ...tweaks, _t: t, _setLang: lang => setTweak('lang', lang) };

  const navigate = (id, meta) => {
    if (id === 'asset' && meta?.sym) setActiveSym(meta.sym);
    if (id === 'add-holding' && meta?.prefill) setPrefill(meta.prefill);
    else if (id !== 'add-holding') setPrefill(null);
    setScreen(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setScreen('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    const props = { tweaks: tweaksFull, onBack: goBack, onNavigate: navigate };
    switch (screen) {
      case 'dashboard':     return <Dashboard     {...props} onHoldingClick={sym => navigate('asset', { sym })} onAddHolding={() => navigate('add-holding')} onSetupApi={() => setShowApiSetup(true)} />;
      case 'asset':         return <Asset         {...props} sym={activeSym} />;
      case 'add-holding':   return <AddHolding    {...props} prefill={prefill} />;
      case 'ratings':       return <RatingsScreen {...props} />;
      case 'watchlist':     return <Watchlist     {...props} />;
      case 'ai-chat':       return <AIChat        {...props} />;
      case 'insights':      return <InsightsScreen {...props} />;
      case 'digest':        return <DigestScreen  {...props} />;
      case 'diversify':     return <DiversificationScreen {...props} />;
      case 'notifications': return <NotificationsScreen   {...props} />;
      case 'alerts':        return <AlertsScreen  {...props} />;
      case 'earnings':      return <EarningsScreen {...props} />;
      case 'more':          return <MoreScreen    {...props} onNavigate={navigate} />;
      default:              return <Dashboard     {...props} onHoldingClick={sym => navigate('asset', { sym })} onAddHolding={() => navigate('add-holding')} onSetupApi={() => setShowApiSetup(true)} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>
      <NavBar
        screen={screen}
        onNavigate={navigate}
        tweaks={tweaks}
        setTweak={setTweak}
        onSetupApi={() => setShowApiSetup(true)}
        hasApiKey={hasFinnhubKey()}
      />

      {/* Legal disclaimer bar */}
      <div style={{
        background: '#1a3a2a', color: '#a8d4b4', fontSize: 12,
        textAlign: 'center', padding: '7px 24px',
        position: 'fixed', top: 60, left: 0, right: 0, zIndex: 900, lineHeight: 1.4,
      }}>
        {createT(tweaks.lang)('legal.bar')}
      </div>

      <div style={{ paddingTop: 32 }}>
        {renderScreen()}
      </div>

      {/* API key setup modal */}
      {showApiSetup && (
        <ApiKeyModal T={T} onDone={() => setShowApiSetup(false)} />
      )}

      {/* One-time local data notice */}
      {dataNotice && !showApiSetup && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 2000, background: T.card, border: `1px solid ${T.line}`,
          borderRadius: 16, padding: '20px 28px', maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)', fontFamily: T.sans,
        }}>
          <div style={{ fontFamily: T.serif, fontSize: 18, marginBottom: 8 }}>Your data stays on your device</div>
          <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.6, marginBottom: 16 }}>
            Portfolio stores everything locally in your browser. Nothing is sent to any server. Clearing browser data will erase your portfolio.
          </div>
          <button
            onClick={() => { localStorage.setItem('stratos-notice-v1', '1'); setDataNotice(false); }}
            style={{ width: '100%', height: 42, borderRadius: 10, background: T.ink, color: T.card, border: 'none', fontSize: 14, fontWeight: 600, fontFamily: T.sans, cursor: 'pointer' }}
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
