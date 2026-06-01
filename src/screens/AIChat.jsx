import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { BrandGlyph } from '../components/BrandGlyph';
import { MiniChart } from '../components/Charts';
import { AI_CHAT } from '../data/extended';

const btcMini = [40, 42, 41, 44, 46, 45, 48, 46, 47, 44, 42, 40, 39];

// PROMPTS will be sourced from t('ai.prompts') inside the component

const AI_RESPONSES = [
  'Based on your holdings, your portfolio is approximately 43% crypto, which amplifies any Bitcoin or Ethereum moves. A 5% drop in BTC alone impacts your NAV by about 2%. This is illustrative — not financial advice.',
  'Your largest concentrations are Bitcoin (BTC) at ~24% and Ethereum (ETH) at ~20%. Together crypto represents 43% of your NAV, well above a typical 10–20% allocation target.',
  "For dividend yield under $200: KO ($62, 3.1%), JNJ ($148, 3.0%), PG ($168, 2.4%). These are illustrative — always verify current data. Not financial advice.",
  "A 20% crypto crash scenario: BTC falls ~$14,400, ETH falls ~$744. Estimated portfolio impact: −$11,200 (−8.8% of NAV). Your stocks and ETF positions would be unaffected. Not financial advice.",
  'Your TSLA position is down 7.7% from your avg cost. The illustrative signal is currently Sell. Some investors trim into weakness; others hold for a reversal. Review your own risk tolerance. Not financial advice.',
  'To rebalance toward a 60/30/10 stock/ETF/crypto split, you could reduce BTC and ETH by ~$18k and add to VTI or a bond ETF. This is illustrative — not financial advice.',
];

let aiResponseIdx = 0;

export function AIChat({ onNavigate }) {
  const { T, t } = useTheme();
  const [messages, setMessages]   = useState(AI_CHAT);
  const [input,    setInput]      = useState('');
  const [typing,   setTyping]     = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function sendMessage(text) {
    const txt = (text || input).trim();
    if (!txt) return;
    setMessages(prev => [...prev, { who: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = AI_RESPONSES[aiResponseIdx % AI_RESPONSES.length];
      aiResponseIdx++;
      setTyping(false);
      setMessages(prev => [...prev, { who: 'ai', text: reply }]);
    }, 1200 + Math.random() * 600);
  }

  function handleActionChip(action) {
    // Map action label to navigation or send as query
    const a = action.toLowerCase();
    if (a.includes('tsla') || a.includes('detail')) {
      onNavigate?.('asset', { sym: 'TSLA' });
    } else if (a.includes('alert')) {
      onNavigate?.('alerts');
    } else if (a.includes('watchlist')) {
      onNavigate?.('watchlist');
    } else {
      sendMessage(action);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 32px 120px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <BrandGlyph size={40} color={T.ink} />
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 28, lineHeight: 1.1 }}>{t('ai.assistant')}</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 3 }}>{t('ai.sub')}</div>
          </div>
        </div>

        {/* Suggested prompts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
          {t('ai.prompts').map(p => (
            <button key={p} onClick={() => sendMessage(p)} style={{
              fontSize: 13, padding: '8px 14px', borderRadius: 100,
              background: T.card, border: `1px solid ${T.line}`, color: T.ink2,
              cursor: 'pointer', fontFamily: T.sans, transition: 'all 100ms',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.card; e.currentTarget.style.borderColor = T.ink; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.card; e.currentTarget.style.color = T.ink2; e.currentTarget.style.borderColor = T.line; }}
            >{p}</button>
          ))}
        </div>

        {/* Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {messages.map((m, i) => m.who === 'user' ? (
            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ maxWidth: '70%', padding: '12px 18px', background: T.ink, color: T.card, borderRadius: '18px 18px 4px 18px', fontSize: 14, lineHeight: 1.5 }}>
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: 'flex', gap: 14, maxWidth: '85%' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.card, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                <BrandGlyph size={18} color={T.ink} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: T.ink3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('ai.label')}</div>
                <div style={{ padding: '16px 18px', background: T.card, border: `1px solid ${T.line}`, borderRadius: '18px 18px 18px 4px', fontSize: 14, lineHeight: 1.6 }}>
                  {m.text}
                  {m.chart === 'btc' && (
                    <div style={{ marginTop: 14, padding: '12px 14px', background: T.bg, borderRadius: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.ink3, marginBottom: 8 }}>
                        <span>BTC · 24h</span>
                        <span style={{ color: T.rust, fontWeight: 600 }}>−2.1%</span>
                      </div>
                      <MiniChart data={btcMini} w={360} h={56} color={T.rust} />
                    </div>
                  )}
                  {m.sources && (
                    <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {m.sources.map(s => <span key={s} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: T.bg, color: T.ink3, border: `1px solid ${T.line}` }}>{s}</span>)}
                    </div>
                  )}
                  {m.actions && (
                    <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {m.actions.map(a => (
                        <button key={a} onClick={() => handleActionChip(a)} style={{ padding: '8px 14px', fontSize: 13, fontFamily: T.sans, background: T.bg, border: `1px solid ${T.line}`, color: T.ink, borderRadius: 10, cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.card; }}
                          onMouseLeave={e => { e.currentTarget.style.background = T.bg; e.currentTarget.style.color = T.ink; }}
                        >{a} →</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.card, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BrandGlyph size={18} color={T.ink3} />
              </div>
              <div style={{ alignSelf: 'flex-end', display: 'flex', gap: 5, padding: '12px 16px', background: T.card, border: `1px solid ${T.line}`, borderRadius: 16 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: T.ink3, opacity: 0.3 + i * 0.25, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Composer — sticky at bottom */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 32px 24px', background: `linear-gradient(to top, ${T.bg} 70%, transparent)`, zIndex: 500 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, padding: '10px 10px 10px 18px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={t('ai.placeholder')}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: T.ink, fontFamily: T.sans }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={typing || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: input.trim() && !typing ? T.ink : T.bg,
                  color: input.trim() && !typing ? T.card : T.ink3,
                  border: `1px solid ${T.line}`, cursor: input.trim() && !typing ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                  transition: 'all 150ms',
                }}>↑</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
