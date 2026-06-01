export function ChartArea({ data, w = 340, h = 110, accent = "#5b8f6a", fill = "rgba(91,143,106,0.14)", strokeW = 2 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, h - ((v - min) / span) * (h - 8) - 4]);
  const linePath = "M" + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const areaPath = linePath + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={areaPath} fill={fill} />
      <path d={linePath} fill="none" stroke={accent} strokeWidth={strokeW} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function Spark({ data, w = 60, h = 22, color = "#5b8f6a", strokeW = 1.6 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const dx = w / (data.length - 1);
  const d = "M" + data.map((v, i) => `${(i * dx).toFixed(1)} ${(h - ((v - min) / span) * (h - 2) - 1).toFixed(1)}`).join(" L ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChartCandles({ data, w = 340, h = 140, up = "#5b8f6a", down = "#a85f5f" }) {
  const all = data.flatMap(c => [c.h, c.l]);
  const min = Math.min(...all), max = Math.max(...all);
  const span = max - min || 1;
  const cw = w / data.length;
  const bw = Math.max(1, cw - 2);
  const yOf = v => h - ((v - min) / span) * (h - 8) - 4;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {data.map((c, i) => {
        const isUp = c.c >= c.o;
        const x = i * cw + cw / 2;
        const yH = yOf(c.h), yL = yOf(c.l);
        const yO = yOf(c.o), yC = yOf(c.c);
        const top = Math.min(yO, yC), bot = Math.max(yO, yC);
        const color = isUp ? up : down;
        return (
          <g key={i}>
            <line x1={x} y1={yH} x2={x} y2={yL} stroke={color} strokeWidth="1" />
            <rect x={x - bw / 2} y={top} width={bw} height={Math.max(1, bot - top)} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

export function Donut({ slices, size = 120, thick = 14, gap = 2 }) {
  const r = (size - thick) / 2;
  const c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2} ${size / 2}) rotate(-90)`}>
        {slices.map((s, i) => {
          const len = (s.pct / 100) * c - gap;
          const el = (
            <circle key={i} r={r} cx="0" cy="0" fill="none"
              stroke={s.color} strokeWidth={thick}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-off}
            />
          );
          off += len + gap;
          return el;
        })}
      </g>
    </svg>
  );
}

export function ScoreArc({ score, size = 100, T }) {
  const r = size / 2 - 8;
  const c = Math.PI * r;
  const color = score > 75 ? (T?.sage || "#5b8f6a") : score > 50 ? (T?.amber || "#8a7430") : (T?.rust || "#a85f5f");
  const bg2 = T?.bg2 || "#F2F0EA";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2} ${size / 2}) rotate(-180)`}>
        <circle r={r} cx="0" cy="0" fill="none" stroke={bg2} strokeWidth="8" strokeDasharray={`${c / 2} ${c}`} />
        <circle r={r} cx="0" cy="0" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(score / 100) * c / 2} ${c}`} />
      </g>
    </svg>
  );
}

export function MiniChart({ data, w = 200, h = 56, color }) {
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * dx).toFixed(1)} ${(h - ((v - min) / span) * (h - 6) - 3).toFixed(1)}`);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={"M" + pts.join(" L ")} fill="none" stroke={color || "#8F8C7F"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
