import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { NOTIFICATIONS } from '../data/extended';

function glyph(kind, T) {
  if (kind === 'alert')  return { l: '↗', c: T.sage,  bg: T.sageBg  };
  if (kind === 'signal') return { l: '◆', c: T.amber, bg: T.amberBg };
  if (kind === 'earn')   return { l: '$', c: T.ink2,  bg: T.bg2     };
  if (kind === 'move')   return { l: '%', c: T.rust,  bg: T.rustBg  };
  return { l: '✿', c: T.ink2, bg: T.bg2 };
}

// TABS will be built inside the component using t()

export function NotificationsScreen() {
  const { T, t } = useTheme();
  const TABS = [['all', t('notif.all')], ['unread', t('notif.unread')], ['alerts', t('notif.priceAlerts')], ['signals', t('notif.signals')], ['earnings', t('notif.earnings')]];
  const [tab, setTab] = useState('all');
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markRead = (i) => setNotifs(prev => prev.map((n, idx) => idx === i ? { ...n, unread: false } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const list = tab === 'unread'
    ? notifs.filter(n => n.unread)
    : tab === 'all'
    ? notifs
    : notifs.filter(n => n.kind === tab.replace('earnings', 'earn').replace('signals', 'signal').replace('alerts', 'alert'));

  const unread = notifs.filter(n => n.unread).length;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: T.ink3, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>{t('notif.eyebrow')}</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontWeight: 400 }}>{t('notif.title')}</div>
            <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>{unread} {t('notif.unread')} · {NOTIFICATIONS.length} {t('notif.thisWeek')}</div>
          </div>
          <button
            onClick={markAllRead}
            disabled={unread === 0}
            style={{ padding: '7px 16px', borderRadius: 9, border: `1px solid ${T.line}`, background: T.card, color: unread > 0 ? T.ink2 : T.ink3, fontSize: 13, fontFamily: T.sans, cursor: unread > 0 ? 'pointer' : 'default', opacity: unread > 0 ? 1 : 0.5 }}>
            {t('notif.markAllRead')}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 }}>

          {/* Sidebar tabs */}
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 14, padding: '8px', height: 'fit-content', position: 'sticky', top: 80 }}>
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: T.sans, fontSize: 13, marginBottom: 2,
                background: tab === k ? T.bg : 'transparent',
                color: tab === k ? T.ink : T.ink2,
                fontWeight: tab === k ? 500 : 400,
              }}>{l}</button>
            ))}
          </div>

          {/* Notifications list */}
          <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
            {list.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: T.ink3, fontSize: 14 }}>{t('notif.noNotifs')}</div>
            ) : list.map((n, i) => {
              const g = glyph(n.kind, T);
              // find index in original notifs array for marking read
              const origIdx = notifs.indexOf(n);
              return (
                <div key={i}
                  onClick={() => n.unread && markRead(origIdx)}
                  style={{
                    display: 'flex', padding: '18px 24px', borderBottom: i < list.length - 1 ? `1px solid ${T.line}` : 'none',
                    gap: 16, position: 'relative',
                    background: n.unread ? `${T.sage}06` : 'transparent',
                    transition: 'background 100ms', cursor: n.unread ? 'pointer' : 'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bg}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? `${T.sage}06` : 'transparent'}
                >
                  {n.unread && <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 7, height: 7, borderRadius: 4, background: T.sage }} />}
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: g.bg, color: g.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.serif, fontSize: 16, flexShrink: 0, marginLeft: 8 }}>{g.l}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>
                        {n.sym && <span style={{ color: T.ink3, fontWeight: 400 }}>{n.sym} · </span>}
                        {n.title}
                      </span>
                      <span style={{ fontSize: 11, color: T.ink3, flexShrink: 0, marginLeft: 12 }}>{n.time} ago</span>
                    </div>
                    <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.4 }}>{n.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
