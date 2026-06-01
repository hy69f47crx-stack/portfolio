import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { BrandGlyph } from './BrandGlyph';
import { NOTIFICATIONS } from '../data/extended';

const CURRENCIES = [
  { sym: '$',   label: 'USD' },
  { sym: '€',   label: 'EUR' },
  { sym: '£',   label: 'GBP' },
  { sym: 'KD',  label: 'KWD' },
  { sym: '¥',   label: 'JPY' },
  { sym: 'د.إ ', label: 'AED' },
];

const NAV_LINKS = [
  { id: 'dashboard', key: 'tab.portfolio' },
  { id: 'ratings',   key: 'tab.ratings'   },
  { id: 'watchlist', key: 'tab.watch'     },
  { id: 'insights',  key: 'tab.insights'  },
  { id: 'alerts',    key: 'tab.alerts'    },
  { id: 'earnings',  key: 'tab.earnings'  },
  { id: 'ai-chat',   key: 'tab.aiChat'   },
  { id: 'more',      key: 'tab.more'      },
];

export function NavBar({ screen, onNavigate, tweaks, setTweak, onSetupApi, hasApiKey }) {
  const { T, mode, setMode, lang, setLang, t } = useTheme();
  const [curOpen, setCurOpen] = useState(false);
  const curRef = useRef(null);
  const unread = NOTIFICATIONS.filter(n => n.unread).length;
  const cur = tweaks?.currency || '$';

  useEffect(() => {
    function handler(e) {
      if (curRef.current && !curRef.current.contains(e.target)) setCurOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    setTweak?.('theme', next);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: `${T.bg}ee`,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${T.line}`,
      height: 60,
      display: 'flex', alignItems: 'center',
      padding: '0 28px',
      gap: 0,
    }}>
      {/* Logo */}
      <div onClick={() => onNavigate('dashboard')} style={{
        display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
        marginRight: 32, flexShrink: 0,
      }}>
        <BrandGlyph size={24} color={T.ink} />
        <span style={{ fontFamily: T.serif, fontSize: 20, fontWeight: 400, color: T.ink, letterSpacing: -0.3 }}>Stratos</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {NAV_LINKS.map(({ id, key }) => {
          const active = screen === id;
          return (
            <button key={id} onClick={() => onNavigate(id)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: active ? T.card : 'transparent',
              color: active ? T.ink : T.ink2,
              fontSize: 13.5, fontWeight: active ? 500 : 400,
              fontFamily: T.sans,
              boxShadow: active ? `0 1px 3px rgba(0,0,0,0.08), inset 0 0 0 1px ${T.line}` : 'none',
              transition: 'all 120ms',
              whiteSpace: 'nowrap',
            }}>{t(key)}</button>
          );
        })}
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {/* Language toggle */}
        <div style={{
          display: 'flex', alignItems: 'center',
          border: `1px solid ${T.line}`, borderRadius: 8,
          background: T.card, overflow: 'hidden', height: 32,
        }}>
          {[{ code: 'en', label: 'EN' }, { code: 'ar', label: 'عر' }].map(({ code, label }) => (
            <button
              key={code}
              onClick={() => { setTweak?.('lang', code); setLang(code); }}
              title={code === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
              style={{
                padding: '0 11px', height: '100%', border: 'none',
                background: lang === code ? T.ink : 'transparent',
                color: lang === code ? T.card : T.ink2,
                fontSize: 12, fontWeight: lang === code ? 600 : 400,
                fontFamily: code === 'ar' ? 'system-ui, sans-serif' : T.sans,
                cursor: 'pointer', transition: 'all 120ms',
                letterSpacing: code === 'en' ? 0.3 : 0,
              }}
            >{label}</button>
          ))}
        </div>

        {/* Currency picker */}
        <div ref={curRef} style={{ position: 'relative' }}>
          <button onClick={() => setCurOpen(!curOpen)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 8, border: `1px solid ${T.line}`,
            background: T.card, color: T.ink, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: T.sans,
          }}>
            {CURRENCIES.find(c => c.sym === cur)?.label || 'USD'}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke={T.ink2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {curOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: T.card, border: `1px solid ${T.line}`,
              borderRadius: 12, padding: 6, minWidth: 110,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100,
            }}>
              {CURRENCIES.map(c => (
                <button key={c.sym} onClick={() => { setTweak?.('currency', c.sym); setCurOpen(false); }} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '7px 10px', borderRadius: 7, border: 'none',
                  background: cur === c.sym ? T.bg : 'transparent',
                  color: T.ink, cursor: 'pointer', fontSize: 13, fontFamily: T.sans,
                  fontWeight: cur === c.sym ? 500 : 400,
                }}>
                  <span>{c.label}</span>
                  <span style={{ fontSize: 12, color: T.ink3 }}>{c.sym}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.line}`,
          background: T.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15,
        }}>
          {mode === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Notifications */}
        <button onClick={() => onNavigate('notifications')} style={{
          width: 34, height: 34, borderRadius: 8, border: `1px solid ${T.line}`,
          background: T.card, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', fontSize: 15,
        }}>
          🔔
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 4, width: 8, height: 8,
              borderRadius: 4, background: T.sage, border: `2px solid ${T.card}`,
            }} />
          )}
        </button>

        {/* Live price status / API key button */}
        <button onClick={onSetupApi} title={hasApiKey ? 'Live prices connected — click to change key' : 'Connect live prices'} style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', borderRadius: 8,
          border: `1px solid ${hasApiKey ? T.sage + '60' : T.amber + '80'}`,
          background: hasApiKey ? (T.sageBg || '#eaf2ec') : (T.amberBg || '#fdf5e8'),
          color: hasApiKey ? T.sage : T.amber,
          fontSize: 12, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: hasApiKey ? T.sage : T.amber, display: 'inline-block', flexShrink: 0 }} />
          {hasApiKey ? t('nav.live') : t('nav.noLive')}
        </button>

        {/* Add holding CTA */}
        <button onClick={() => onNavigate('add-holding')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8, border: 'none',
          background: T.ink, color: T.card,
          fontSize: 13, fontWeight: 500, fontFamily: T.sans, cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          {t('nav.addHolding')}
        </button>
      </div>
    </nav>
  );
}
