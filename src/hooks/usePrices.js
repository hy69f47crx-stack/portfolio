import { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '../store/portfolio';
import { fetchPrices, fetchFxRates, hasFinnhubKey } from '../api/prices';

// ── Quote caching policy ──────────────────────────────────────────────────────
// Prices are "locked" into a persistent cache (see store partialize) and only
// refreshed on a controlled, delayed-quote cadence. This keeps us well within
// free-tier API limits and terms of service — we never re-fetch just because
// someone opened or reopened the site.
const CACHE_TTL_MS = 15 * 60_000;  // treat cached quotes as fresh for 15 minutes
const FX_TTL_MS    = 12 * 60 * 60_000; // FX changes slowly — refresh at most twice a day

export function usePrices() {
  const { portfolios, setPrices, setFxRates } = usePortfolioStore();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const timerRef = useRef(null);

  const allSyms = [...new Set(
    portfolios.flatMap(p => p.holdings.filter(h => h.type !== 'Kuwait' && h.manualPrice == null).map(h => h.sym))
  )];

  function quotesAreStale() {
    const { lastFetch } = usePortfolioStore.getState();
    return !lastFetch || (Date.now() - lastFetch) > CACHE_TTL_MS;
  }

  function fxIsStale() {
    const { fxLastFetch } = usePortfolioStore.getState();
    return !fxLastFetch || (Date.now() - fxLastFetch) > FX_TTL_MS;
  }

  // Refresh only when the cached data is genuinely stale. `force` lets the
  // manual refresh button bypass the cache window on explicit user action.
  async function refresh(force = false) {
    if (!allSyms.length) return;
    if (!force && !quotesAreStale()) return;   // cache still fresh → do nothing
    setLoading(true);
    setError(null);
    try {
      const prices = await fetchPrices(allSyms);
      if (prices && Object.keys(prices).length) setPrices(prices);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshFx(force = false) {
    if (!force && !fxIsStale()) return;
    try {
      const rates = await fetchFxRates();
      if (rates) setFxRates(rates);
    } catch { /* silent */ }
  }

  useEffect(() => {
    // On mount: only fetch if the persisted cache has expired.
    refresh();
    refreshFx();

    // A single, low-frequency timer that still respects the cache window —
    // it will only actually call the APIs once quotes cross the TTL, so an
    // open tab refreshes at most every 15 minutes, never every 60 seconds.
    timerRef.current = setInterval(() => {
      refresh();
      refreshFx();
    }, CACHE_TTL_MS);

    return () => clearInterval(timerRef.current);
  }, [allSyms.join(',')]);

  return {
    loading,
    error,
    refresh: () => { refresh(true); refreshFx(true); },  // manual button = force
    hasApiKey: hasFinnhubKey(),
  };
}
