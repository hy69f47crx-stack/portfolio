import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WATCHLIST as WATCHLIST_SEED } from '../data/portfolio';

const COINGECKO_IDS = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  ADA: 'cardano', XRP: 'ripple', DOT: 'polkadot', AVAX: 'avalanche-2',
  MATIC: 'matic-network', LINK: 'chainlink', UNI: 'uniswap', ATOM: 'cosmos',
  LTC: 'litecoin', DOGE: 'dogecoin', SHIB: 'shiba-inu', TON: 'the-open-network',
};

const CRYPTO_SYMS = new Set(Object.keys(COINGECKO_IDS));

export function isCrypto(sym) {
  return CRYPTO_SYMS.has(sym?.toUpperCase());
}

export function coingeckoId(sym) {
  return COINGECKO_IDS[sym?.toUpperCase()] || null;
}

const DEMO_PORTFOLIO = {
  id: 'demo',
  name: 'My Portfolio',
  holdings: [
    { id: 'h1', sym: 'NVDA',  name: 'NVIDIA Corporation',  type: 'Stock',  exchange: 'NASDAQ', qty: 22,     avgCost: 620.10  },
    { id: 'h2', sym: 'BTC',   name: 'Bitcoin',             type: 'Crypto', exchange: 'Crypto', qty: 0.42,   avgCost: 58200   },
    { id: 'h3', sym: 'AAPL',  name: 'Apple Inc.',          type: 'Stock',  exchange: 'NASDAQ', qty: 45,     avgCost: 172.30  },
    { id: 'h4', sym: 'VTI',   name: 'Vanguard Total Mkt',  type: 'ETF',    exchange: 'NYSE',   qty: 80,     avgCost: 245.10  },
    { id: 'h5', sym: 'ETH',   name: 'Ethereum',            type: 'Crypto', exchange: 'Crypto', qty: 6.80,   avgCost: 3100    },
    { id: 'h6', sym: 'TSLA',  name: 'Tesla Inc.',          type: 'Stock',  exchange: 'NASDAQ', qty: 60,     avgCost: 215.00  },
  ],
};

export const usePortfolioStore = create(
  persist(
    (set, get) => ({
      portfolios: [DEMO_PORTFOLIO],
      activeId: 'demo',
      prices: {},      // sym → { price, changeAbs, changePct, dayHigh, dayLow, volume, lastUpdated }
      fxRates: { KWD: 0.3068, EUR: 0.92, GBP: 0.79, JPY: 149.5, AED: 3.67 }, // USD → foreign
      lastFetch: null,
      fxLastFetch: null,
      watchlist: WATCHLIST_SEED,

      // Portfolio CRUD
      addPortfolio(name) {
        const id = 'p_' + Date.now();
        set(s => ({ portfolios: [...s.portfolios, { id, name, holdings: [] }], activeId: id }));
      },
      renamePortfolio(id, name) {
        set(s => ({ portfolios: s.portfolios.map(p => p.id === id ? { ...p, name } : p) }));
      },
      deletePortfolio(id) {
        set(s => {
          const next = s.portfolios.filter(p => p.id !== id);
          return { portfolios: next, activeId: next[0]?.id || null };
        });
      },
      setActive(id) { set({ activeId: id }); },

      // Holding CRUD
      addHolding(portfolioId, holding) {
        const h = { ...holding, id: 'h_' + Date.now() };
        set(s => ({
          portfolios: s.portfolios.map(p =>
            p.id === portfolioId ? { ...p, holdings: [...p.holdings, h] } : p
          ),
        }));
      },
      updateHolding(portfolioId, holdingId, updates) {
        set(s => ({
          portfolios: s.portfolios.map(p =>
            p.id === portfolioId
              ? { ...p, holdings: p.holdings.map(h => h.id === holdingId ? { ...h, ...updates } : h) }
              : p
          ),
        }));
      },
      deleteHolding(portfolioId, holdingId) {
        set(s => ({
          portfolios: s.portfolios.map(p =>
            p.id === portfolioId ? { ...p, holdings: p.holdings.filter(h => h.id !== holdingId) } : p
          ),
        }));
      },

      // Watchlist CRUD
      addToWatchlist(item) {
        set(s => s.watchlist.find(w => w.sym === item.sym) ? {} : { watchlist: [...s.watchlist, item] });
      },
      removeFromWatchlist(sym) {
        set(s => ({ watchlist: s.watchlist.filter(w => w.sym !== sym) }));
      },
      isWatched(sym) {
        return !!get().watchlist.find(w => w.sym === sym?.toUpperCase());
      },

      // Price cache
      setPrices(updates) {
        set(s => ({ prices: { ...s.prices, ...updates }, lastFetch: Date.now() }));
      },
      setFxRates(rates) { set({ fxRates: { ...get().fxRates, ...rates }, fxLastFetch: Date.now() }); },

      // Selectors
      activePortfolio() {
        const { portfolios, activeId } = get();
        return portfolios.find(p => p.id === activeId) || portfolios[0] || null;
      },
    }),
    {
      name: 'stratos-portfolio-v1',
      // Persist the price cache too, so quotes stay "locked" across page reloads
      // and we don't re-hit the data APIs every time someone opens the site.
      partialize: s => ({
        portfolios: s.portfolios,
        activeId:   s.activeId,
        watchlist:  s.watchlist,
        prices:      s.prices,
        fxRates:     s.fxRates,
        lastFetch:   s.lastFetch,
        fxLastFetch: s.fxLastFetch,
      }),
    }
  )
);

// Derived computation — call this hook in components
export function useComputedPortfolio(currencySym = '$') {
  const { prices, fxRates, activePortfolio } = usePortfolioStore();
  const portfolio = activePortfolio();

  const fxMap = { '$': 1, '€': fxRates.EUR, '£': fxRates.GBP, '¥': fxRates.JPY, 'د.إ ': fxRates.AED, 'KD': fxRates.KWD };
  const rate = fxMap[currencySym] || 1;

  if (!portfolio) return { total: 0, totalCost: 0, pl: 0, plPct: 0, changeAbs: 0, holdings: [], allocation: [] };

  const holdings = portfolio.holdings.map(h => {
    const pd = prices[h.sym];
    const price = h.manualPrice != null ? h.manualPrice : (h.type === 'Kuwait' ? h.avgCost : (pd?.price || h.avgCost));
    const value    = h.qty * price * rate;
    const cost     = h.qty * h.avgCost * rate;
    const pl       = value - cost;
    const plPct    = h.avgCost > 0 ? (price - h.avgCost) / h.avgCost * 100 : 0;
    const day      = pd?.changePct || 0;
    const dayAbs   = value * day / 100;
    return { ...h, price, value, cost, pl, plPct, day, dayAbs, alloc: 0 };
  });

  const total     = holdings.reduce((s, h) => s + h.value, 0);
  const totalCost = holdings.reduce((s, h) => s + h.cost,  0);
  const pl        = total - totalCost;
  const plPct     = totalCost > 0 ? (pl / totalCost) * 100 : 0;
  const changeAbs = holdings.reduce((s, h) => s + h.dayAbs, 0);
  const changePct = total > 0 ? (changeAbs / (total - changeAbs)) * 100 : 0;

  // Allocation %
  const withAlloc = holdings.map(h => ({ ...h, alloc: total > 0 ? (h.value / total) * 100 : 0 }));

  // Asset class breakdown
  const byType = {};
  withAlloc.forEach(h => { byType[h.type] = (byType[h.type] || 0) + h.alloc; });
  const TYPE_COLORS = { Stock: '#5b8f6a', Crypto: '#c98a4b', ETF: '#6a7fa3', Bond: '#a89178', Kuwait: '#7a6a52', Cash: '#a85f5f' };
  const allocation = Object.entries(byType).map(([label, pct]) => ({ label, pct: +pct.toFixed(1), color: TYPE_COLORS[label] || '#999' }));

  return { total, totalCost, pl, plPct, changeAbs, changePct, holdings: withAlloc, allocation, rate };
}
