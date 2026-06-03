export const PORTFOLIO = {
  total: 127480.32,
  changeAbs: 2842.18,
  changePct: 2.28,
  holdings: [
    { sym: "NVDA", name: "NVIDIA",          type: "Stock",  qty: 22,      avg: 620.10,  price: 890.20,  alloc: 15.4, day: 1.82 },
    { sym: "BTC",  name: "Bitcoin",         type: "Crypto", qty: 0.4200,  avg: 58200,   price: 71840,   alloc: 23.7, day: -0.74 },
    { sym: "AAPL", name: "Apple",           type: "Stock",  qty: 45,      avg: 172.30,  price: 194.50,  alloc: 6.9,  day: 0.41 },
    { sym: "VTI",  name: "Vanguard Total",  type: "ETF",    qty: 80,      avg: 245.10,  price: 268.20,  alloc: 16.8, day: 0.18 },
    { sym: "ETH",  name: "Ethereum",        type: "Crypto", qty: 6.80,    avg: 3100,    price: 3720,    alloc: 19.8, day: -1.21 },
    { sym: "TSLA", name: "Tesla",           type: "Stock",  qty: 60,      avg: 215.00,  price: 198.40,  alloc: 9.3,  day: -2.04 },
    { sym: "T10Y", name: "US Treasury 10Y", type: "Bond",   qty: 15000,   avg: 100.00,  price: 102.80,  alloc: 8.1,  day: 0.06 },
  ],
};
PORTFOLIO.holdings.forEach(h => {
  h.value = h.qty * h.price;
  h.cost  = h.qty * h.avg;
  h.pl    = h.value - h.cost;
  h.plPct = (h.price - h.avg) / h.avg * 100;
});

export const PORTFOLIO_SERIES = (() => {
  let v = 109000;
  const out = [];
  for (let i = 0; i < 90; i++) {
    v += (Math.sin(i * 0.27) * 800) + (Math.cos(i * 0.13) * 400) + (i * 180);
    if (i > 60) v += Math.sin(i * 0.4) * 1200;
    out.push(Math.round(v));
  }
  return out;
})();

export const ALLOCATION = [
  { label: "Stocks",  pct: 31.6, color: "#5b8f6a" },
  { label: "Crypto",  pct: 43.5, color: "#c98a4b" },
  { label: "ETFs",    pct: 16.8, color: "#6a7fa3" },
  { label: "Bonds",   pct:  8.1, color: "#a89178" },
];

export const NVDA = {
  sym: "NVDA",
  name: "NVIDIA Corporation",
  exchange: "NASDAQ",
  price: 890.20,
  changeAbs: 16.18,
  changePct: 1.85,
  series: (() => {
    let v = 580; const out = [];
    for (let i = 0; i < 120; i++) { v += Math.sin(i * 0.21) * 8 + (i * 2.4) + (Math.random() - 0.5) * 4; out.push(+v.toFixed(2)); }
    return out;
  })(),
  candles: (() => {
    const out = []; let p = 820;
    for (let i = 0; i < 30; i++) {
      const o = p; const c = p + (Math.random() - 0.45) * 22;
      const h = Math.max(o, c) + Math.random() * 8;
      const l = Math.min(o, c) - Math.random() * 8;
      out.push({ o, c, h, l }); p = c;
    }
    return out;
  })(),
  fund: {
    mcap: "2.19T", pe: 68.4, eps: 13.02, div: "0.04%",
    vol: "42.1M", avgVol: "48.3M", w52h: 974.00, w52l: 410.10,
    beta: 1.66, peg: 1.22,
  },
  position: { qty: 22, avg: 620.10, value: 19584.40, pl: 5942.20, plPct: 43.55 },
  ratings: {
    analyst: { buy: 38, hold: 4, sell: 1, consensus: "Strong Buy", target: 1020 },
    ai:      { score: 82, signal: "Buy", confidence: 0.74, target: 980 },
  },
  prediction: {
    next7:  { dir: "up",   mag: 2.4, conf: 0.71 },
    next30: { dir: "up",   mag: 8.1, conf: 0.62 },
    next90: { dir: "flat", mag: 1.2, conf: 0.44 },
  },
  sentiment: { bull: 67, neutral: 21, bear: 12, mentions24h: 14203, delta: 38 },
  news: [
    { src: "Market Wire",   time: "12m", head: "NVIDIA expands Blackwell shipments amid record data-center demand" },
    { src: "Portfolio Feed", time: "1h",  head: "Analysts raise FY26 targets after sovereign AI deals in EMEA" },
    { src: "Tech Brief",   time: "3h",  head: "Project Digits ships to early developers, undercuts cloud GPU pricing" },
    { src: "Equity Wire",  time: "5h",  head: "Supply constraints ease as TSMC ramps CoWoS capacity 2.4x YoY" },
    { src: "Global Brief", time: "8h",  head: "Hyperscaler capex guidance signals 'multi-year build-out'" },
  ],
  related: [
    { sym: "AMD",  name: "Advanced Micro", price: 168.40,  ch:  0.92 },
    { sym: "TSM",  name: "Taiwan Semi",    price: 162.10,  ch:  1.41 },
    { sym: "AVGO", name: "Broadcom",       price: 1610.80, ch: -0.61 },
    { sym: "MU",   name: "Micron Tech",    price:  121.40, ch:  2.18 },
  ],
};

export const RATINGS = [
  { sym: "NVDA",  name: "NVIDIA",         type: "Stock",  analyst: "Strong Buy", a: 4.7, ai: "Buy",   aiScore: 82, momentum:  18 },
  { sym: "AAPL",  name: "Apple",          type: "Stock",  analyst: "Buy",        a: 4.1, ai: "Hold",  aiScore: 58, momentum:   4 },
  { sym: "MSFT",  name: "Microsoft",      type: "Stock",  analyst: "Buy",        a: 4.3, ai: "Buy",   aiScore: 76, momentum:   9 },
  { sym: "TSLA",  name: "Tesla",          type: "Stock",  analyst: "Hold",       a: 3.0, ai: "Sell",  aiScore: 28, momentum: -14 },
  { sym: "GOOGL", name: "Alphabet",       type: "Stock",  analyst: "Buy",        a: 4.2, ai: "Buy",   aiScore: 71, momentum:   6 },
  { sym: "AMZN",  name: "Amazon",         type: "Stock",  analyst: "Strong Buy", a: 4.6, ai: "Buy",   aiScore: 74, momentum:   8 },
  { sym: "META",  name: "Meta",           type: "Stock",  analyst: "Buy",        a: 4.4, ai: "Hold",  aiScore: 62, momentum:   2 },
  { sym: "BTC",   name: "Bitcoin",        type: "Crypto", analyst: "Buy",        a: 4.0, ai: "Hold",  aiScore: 55, momentum:  -3 },
  { sym: "ETH",   name: "Ethereum",       type: "Crypto", analyst: "Hold",       a: 3.4, ai: "Hold",  aiScore: 49, momentum:  -7 },
  { sym: "SOL",   name: "Solana",         type: "Crypto", analyst: "Buy",        a: 4.0, ai: "Buy",   aiScore: 68, momentum:  12 },
  { sym: "VTI",   name: "Vanguard Total", type: "ETF",    analyst: "Buy",        a: 4.2, ai: "Buy",   aiScore: 70, momentum:   5 },
  { sym: "QQQ",   name: "Invesco QQQ",    type: "ETF",    analyst: "Buy",        a: 4.3, ai: "Buy",   aiScore: 72, momentum:   7 },
  { sym: "T10Y",  name: "US Treas 10Y",   type: "Bond",   analyst: "Hold",       a: 3.2, ai: "Hold",  aiScore: 51, momentum:   1 },
  { sym: "TLT",   name: "Long Bond ETF",  type: "Bond",   analyst: "Sell",       a: 2.4, ai: "Sell",  aiScore: 31, momentum:  -9 },
];

export const WATCHLIST = [
  { sym: "AMD",  name: "Advanced Micro", type: "Stock",  price: 168.40,  ch:  0.92, spark: [40,42,41,44,46,45,48,52,50,54,53,57] },
  { sym: "SHOP", name: "Shopify",        type: "Stock",  price:  74.20,  ch:  1.81, spark: [30,31,29,33,35,34,37,38,40,39,42,44] },
  { sym: "SOL",  name: "Solana",         type: "Crypto", price: 178.40,  ch:  3.41, spark: [50,48,52,55,53,57,60,58,62,65,64,68] },
  { sym: "QQQ",  name: "Invesco QQQ",    type: "ETF",    price: 488.10,  ch:  0.42, spark: [60,61,60,62,63,62,64,65,64,66,67,68] },
];

export const RECS = {
  becauseYou: [
    { sym: "ARM",  name: "Arm Holdings", why: "You watch AMD",  price: 142.10,  ch:  2.10 },
    { sym: "AVGO", name: "Broadcom",     why: "You own NVDA",   price: 1610.80, ch: -0.61 },
  ],
  trending: [
    { sym: "PLTR", name: "Palantir",   why: "+18% this week",  price:  28.40, ch: 4.21 },
    { sym: "COIN", name: "Coinbase",   why: "Volume × 2.4",    price: 215.60, ch: 3.10 },
  ],
  aiPicks: [
    { sym: "ASML", name: "ASML Holding", why: "Fills semis gap", price: 942.10, ch: 0.84 },
    { sym: "GLD",  name: "SPDR Gold",    why: "Diversifier",     price: 218.30, ch: 0.32 },
  ],
  themes: [
    { label: "AI Infra",       count: 8, color: "#5b8f6a", stocks: [
      { sym: "NVDA", name: "NVIDIA",      price: 890.20,  ch:  1.85 },
      { sym: "AMD",  name: "AMD",         price: 168.40,  ch:  0.92 },
      { sym: "MSFT", name: "Microsoft",   price: 415.30,  ch:  0.62 },
      { sym: "AVGO", name: "Broadcom",    price: 1610.80, ch: -0.61 },
      { sym: "ARM",  name: "Arm Holdings",price: 142.10,  ch:  2.10 },
      { sym: "TSM",  name: "TSMC",        price: 162.10,  ch:  1.41 },
      { sym: "ASML", name: "ASML",        price: 942.10,  ch:  0.84 },
      { sym: "PLTR", name: "Palantir",    price:  28.40,  ch:  4.21 },
    ]},
    { label: "Clean Energy",   count: 6, color: "#6a7fa3", stocks: [
      { sym: "NEE",  name: "NextEra Energy",  price: 72.40,  ch:  0.38 },
      { sym: "ENPH", name: "Enphase Energy",  price: 118.60, ch: -1.24 },
      { sym: "FSLR", name: "First Solar",     price: 200.10, ch:  0.91 },
      { sym: "BEP",  name: "Brookfield RE",   price:  28.70, ch:  0.55 },
      { sym: "RUN",  name: "Sunrun",          price:  14.20, ch: -0.84 },
      { sym: "CWEN", name: "Clearway Energy", price:  25.80, ch:  0.22 },
    ]},
    { label: "Cybersecurity",  count: 6, color: "#a85f5f", stocks: [
      { sym: "CRWD", name: "CrowdStrike",  price: 348.20, ch:  1.62 },
      { sym: "PANW", name: "Palo Alto",    price: 318.10, ch:  0.44 },
      { sym: "ZS",   name: "Zscaler",      price: 202.40, ch: -0.72 },
      { sym: "NET",  name: "Cloudflare",   price: 102.60, ch:  2.18 },
      { sym: "OKTA", name: "Okta",         price:  98.30, ch: -1.08 },
      { sym: "FTNT", name: "Fortinet",     price:  74.50, ch:  0.31 },
    ]},
    { label: "Dividend Kings", count: 6, color: "#a89178", stocks: [
      { sym: "KO",   name: "Coca-Cola",    price:  62.40, ch:  0.18 },
      { sym: "JNJ",  name: "J&J",          price: 148.20, ch:  0.06 },
      { sym: "PG",   name: "P&G",          price: 168.80, ch:  0.22 },
      { sym: "ABBV", name: "AbbVie",       price: 178.40, ch:  0.41 },
      { sym: "CL",   name: "Colgate",      price:  94.10, ch:  0.14 },
      { sym: "MMM",  name: "3M",           price: 102.60, ch: -0.38 },
    ]},
  ],
};
