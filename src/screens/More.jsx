import { useTheme } from '../theme/ThemeContext';
import { BrandGlyph } from '../components/BrandGlyph';

export function MoreScreen({ onNavigate }) {
  const { T, t } = useTheme();

  const SECTIONS = [
    {
      labelKey: 'more.aiInsights',
      items: [
        { id: 'ai-chat',   icon: '✦', labelKey: 'more.assistant',  subKey: 'more.assistantSub' },
        { id: 'insights',  icon: '◉', labelKey: 'more.insights',   subKey: 'more.insightsSub' },
        { id: 'digest',    icon: '✉', labelKey: 'more.digest',     subKey: 'more.digestSub' },
        { id: 'diversify', icon: '⊕', labelKey: 'more.diversify',  subKey: 'more.diversifySub' },
      ],
    },
    {
      labelKey: 'more.tracking',
      items: [
        { id: 'notifications', icon: '🔔', labelKey: 'more.notifications', subKey: 'more.notifSub' },
        { id: 'alerts',        icon: '◎',  labelKey: 'more.alerts',        subKey: 'more.alertsSub' },
        { id: 'earnings',      icon: '$',  labelKey: 'more.earnings',      subKey: 'more.earningsSub' },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, paddingTop: 60, fontFamily: T.sans, color: T.ink }}>
      <div style={{ maxWidth: 1360, margin: '0 auto', padding: '36px 32px 80px' }}>

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
          <BrandGlyph size={44} color={T.ink} />
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 36, fontWeight: 400, lineHeight: 1.05 }}>Portfolio</div>
            <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{t('more.tagline')}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {SECTIONS.map(section => (
            <div key={section.labelKey}>
              <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                {t(section.labelKey)}
              </div>
              <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 16, overflow: 'hidden' }}>
                {section.items.map((item, i) => (
                  <div key={item.id} onClick={() => onNavigate?.(item.id)} style={{
                    display: 'flex', alignItems: 'center', padding: '18px 22px',
                    borderTop: i ? `1px solid ${T.line}` : 'none', cursor: 'pointer',
                    gap: 16, transition: 'background 100ms',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = T.bg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: T.bg, border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{t(item.labelKey)}</div>
                      <div style={{ fontSize: 12, color: T.ink3, marginTop: 3 }}>{t(item.subKey)}</div>
                    </div>
                    <span style={{ fontSize: 20, color: T.ink3 }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
