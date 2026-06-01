import { useTheme } from '../theme/ThemeContext';

export function Toggle({ on, onChange }) {
  const { T } = useTheme();
  return (
    <div
      onClick={onChange}
      style={{
        width: 36, height: 22, borderRadius: 11,
        background: on ? T.sage : T.bg2,
        position: "relative", flexShrink: 0,
        cursor: onChange ? 'pointer' : 'default',
        transition: 'background 150ms',
      }}
    >
      <div style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 18, height: 18, borderRadius: 9, background: T.card,
        boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
        transition: "left 120ms",
      }} />
    </div>
  );
}
