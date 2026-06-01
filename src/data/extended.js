export const INSIGHTS = [
  { kind: "concentration", severity: "warn",  title: "Crypto is 43% of your portfolio",   body: "Your crypto allocation more than doubled your initial target of 20%. Two assets (BTC, ETH) drive most of the risk.", action: "Rebalance" },
  { kind: "winner",        severity: "good",  title: "NVDA up 43.5% since you bought",    body: "You've held NVDA for 14 months. Trim a third to lock in gains, or add to ride the AI-infra cycle.", action: "Review position" },
  { kind: "risk",          severity: "warn",  title: "Tesla rating flipped to Sell",       body: "Three analysts downgraded TSLA this week. Our AI model lowered its score from 41 to 28.", action: "Open TSLA" },
  { kind: "diversify",     severity: "info",  title: "No healthcare exposure",             body: "Adding 5–8% in a sector ETF like XLV would lower portfolio beta from 1.32 to 1.18.", action: "See suggestions" },
];

export const DIVERSIFICATION = {
  score: 62,
  beta: 1.32,
  betaTarget: 1.10,
  sectors: [
    { name: "Technology",  pct: 41, target: 28, color: "#5b8f6a" },
    { name: "Consumer",    pct:  9, target: 14, color: "#c98a4b" },
    { name: "Financials",  pct:  4, target: 12, color: "#6a7fa3" },
    { name: "Healthcare",  pct:  0, target: 10, color: "#a85f5f" },
    { name: "Industrials", pct:  3, target:  8, color: "#a89178" },
    { name: "Energy",      pct:  2, target:  6, color: "#7a6a52" },
    { name: "Crypto",      pct: 41, target: 22, color: "#b88450" },
  ],
  gaps: [
    { sym: "XLV", name: "Health Care SPDR",   fill: "Healthcare",  alloc: "+5%" },
    { sym: "XLF", name: "Financial SPDR",     fill: "Financials",  alloc: "+4%" },
    { sym: "VEA", name: "Vanguard Dev ex-US", fill: "Intl equity", alloc: "+6%" },
  ],
};

export const AI_CHAT = [
  { who: "user", text: "Why is my portfolio down today?" },
  { who: "ai",   text: "Mostly Bitcoin. BTC fell 2.1% overnight on lower ETF inflows. Your crypto bucket (43.5% of NAV) accounts for $410 of today's $530 drop.", sources: ["CoinGecko, 6:42am", "Glassnode, daily"], chart: "btc" },
  { who: "user", text: "Should I trim Tesla?" },
  { who: "ai",   text: "Your TSLA position is down 7.7% from cost. The illustrative signal shifted to Sell after the delivery miss; analyst consensus moved from Buy to Hold. Some investors trim into weakness — review your own risk tolerance before acting. This is not financial advice.", actions: ["View TSLA detail", "Set price alert at $210"] },
];

export const DIGEST = {
  weekOf: "May 13 – May 19, 2026",
  totals: { perfPct: 3.41, perfAbs: 4203.18, bestSym: "NVDA", bestPct: 8.2, worstSym: "TSLA", worstPct: -6.4, txns: 3, dividends: 64.20 },
  highlights: [
    "Two of your holdings beat earnings (AAPL, MSFT)",
    "Illustrative signal shifted Buy → Sell on TSLA",
    "First T-bill coupon paid: $64.20",
    "Solana on your watchlist broke a 6-month resistance",
  ],
  upcoming: [
    { date: "May 22", what: "NVDA earnings (after market)" },
    { date: "May 24", what: "Fed minutes" },
    { date: "May 27", what: "Recurring buy: $250 VTI" },
  ],
};

export const SEARCH_RECENT   = ["NVDA", "BTC", "Solana", "VTI", "ARM"];
export const SEARCH_TRENDING = ["PLTR", "COIN", "ASML", "GLD", "ARKK", "NIO"];
export const SEARCH_THEMES   = ["AI infrastructure", "Stablecoin issuers", "Dividend kings", "Lithium miners", "Quantum"];

export const NOTIFICATIONS = [
  { kind: "alert",  sym: "NVDA", time: "12m", title: "NVDA crossed $890",           body: "Above your $880 alert threshold.",                  unread: true  },
  { kind: "signal", sym: "TSLA", time: "1h",  title: "Signal update: Buy → Sell",   body: "Illustrative score dropped 13 pts. Not advice.",    unread: true  },
  { kind: "earn",   sym: "AAPL", time: "3h",  title: "Apple reports tomorrow",      body: "Consensus EPS $1.62, revenue $94.5B.",              unread: true  },
  { kind: "move",   sym: "BTC",  time: "5h",  title: "BTC dropped 5.1% intraday",   body: "Largest 4-hour move in 22 days.",                   unread: false },
  { kind: "alert",  sym: "SOL",  time: "9h",  title: "SOL crossed $180",            body: "Above your $175 alert threshold.",                  unread: false },
  { kind: "digest", sym: "",     time: "1d",  title: "Your weekly digest is ready", body: "+3.4% this week. NVDA led, TSLA lagged.",           unread: false },
  { kind: "signal", sym: "META", time: "1d",  title: "Signal update: Hold → Buy",   body: "Illustrative confidence 0.72. Not financial advice.", unread: false },
  { kind: "earn",   sym: "MSFT", time: "2d",  title: "MSFT beat by 4.2%",           body: "Cloud growth re-accelerated to +31% YoY.",          unread: false },
];

export const ALERTS = [
  { sym: "NVDA", type: "above",   value: 880,   armed: true,  note: "Bought at $620" },
  { sym: "BTC",  type: "below",   value: 65000, armed: true,  note: "Add zone" },
  { sym: "SOL",  type: "above",   value: 175,   armed: true,  note: "Breakout" },
  { sym: "TSLA", type: "move%",   value: 5,     armed: false, note: "Any 5% intraday" },
  { sym: "AAPL", type: "signal",  value: null,  armed: true,  note: "Signal flip Buy↔Sell" },
];

export const EARNINGS = [
  { date: "Mon May 25", entries: [{ sym: "ZM",   name: "Zoom",        when: "AMC", est: 1.18, owned: false }] },
  { date: "Tue May 26", entries: [{ sym: "AAPL", name: "Apple",       when: "AMC", est: 1.62, owned: true  }, { sym: "ANF", name: "Abercrombie", when: "BMO", est: 2.18, owned: false }] },
  { date: "Wed May 27", entries: [{ sym: "NVDA", name: "NVIDIA",      when: "AMC", est: 5.92, owned: true  }] },
  { date: "Thu May 28", entries: [{ sym: "COST", name: "Costco",      when: "AMC", est: 3.71, owned: false }, { sym: "DELL", name: "Dell", when: "AMC", est: 1.43, owned: false }] },
  { date: "Fri May 29", entries: [{ sym: "MRVL", name: "Marvell",     when: "AMC", est: 0.59, owned: false }] },
];

export const GOALS = [
  { id: "house", title: "Down payment",   target: 80000,   current: 32400,  by: "Dec 2027", monthly: 1850, onTrack: true,  icon: "🏠" },
  { id: "fire",  title: "Retire at 55",   target: 1500000, current: 127480, by: "2049",     monthly: 2200, onTrack: true,  icon: "🌅" },
  { id: "trip",  title: "Sabbatical fund",target: 25000,   current: 18120,  by: "Jun 2026", monthly: 800,  onTrack: false, icon: "✈" },
];

export const RETIRE = (() => {
  const series = []; let v = 127480;
  for (let y = 0; y <= 22; y++) {
    series.push({ age: 33 + y, low: v * 0.78, base: v, high: v * 1.22 });
    v = (v + 2200 * 12) * 1.075;
  }
  return { startAge: 33, retireAge: 55, currentNetWorth: 127480, monthlyContrib: 2200, expectedReturn: 7.5, series, monthlyIncomeAt4Pct: (series.at(-1).base * 0.04) / 12 };
})();

export const RECURRING = [
  { sym: "VTI", name: "Vanguard Total",     amount: 250, freq: "Weekly",    next: "Mon", active: true,  ytd: 5750 },
  { sym: "BTC", name: "Bitcoin",            amount: 100, freq: "Weekly",    next: "Fri", active: true,  ytd: 2300 },
  { sym: "VEA", name: "Vanguard Dev ex-US", amount: 75,  freq: "Bi-weekly", next: "Tue", active: false, ytd: 0 },
];

export const TRADERS = [
  { handle: "@quiet_compounder", name: "Sara K.",  bio: "Slow, boring, diversified.",    ytd: 14.2, follow: 8420,  beta: 0.82, copying: true,  spark: [40,42,41,43,45,46,48,49,52,54,55,58] },
  { handle: "@semis_only",       name: "M. Patel", bio: "All-semis, all the time.",      ytd: 31.4, follow: 12830, beta: 1.62, copying: false, spark: [30,33,31,36,42,40,48,52,58,62,68,72] },
  { handle: "@dividend_diary",   name: "Joan R.",  bio: "Income > everything.",           ytd:  8.1, follow: 5210,  beta: 0.58, copying: false, spark: [50,51,52,52,53,54,55,55,56,57,58,58] },
  { handle: "@btc_max",          name: "Cole N.",  bio: "Just bitcoin. That's it.",       ytd: 42.6, follow: 22140, beta: 2.10, copying: false, spark: [40,38,42,46,50,48,54,60,58,65,72,78] },
  { handle: "@etf_grandma",      name: "Mei L.",   bio: "Three funds, twenty years.",     ytd: 11.8, follow: 18920, beta: 0.74, copying: true,  spark: [42,43,42,45,46,46,48,49,51,52,54,55] },
];
