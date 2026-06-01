/**
 * Price API layer — legal data sources only
 *
 * Stocks / ETFs  →  Finnhub (https://finnhub.io)
 *   Free tier: 60 API calls/min, real-time US quotes, no CORS issues.
 *   Sign up at https://finnhub.io/register — takes 30 seconds, no credit card.
 *
 * Crypto         →  CoinGecko public API (https://www.coingecko.com/en/api)
 *   Free tier: ~30 calls/min, no API key needed for demo API.
 *
 * FX rates       →  Frankfurter (https://frankfurter.app)
 *   Free, open-source, no key needed.
 *
 * Kuwait stocks  →  Manual entry only (no public Boursa Kuwait API exists).
 */

import { coingeckoId, isCrypto } from '../store/portfolio';

// ── API key helpers ──────────────────────────────────────────────────────────

const KEY_STORAGE = 'stratos-finnhub-key';

export function getFinnhubKey() {
  return import.meta.env.VITE_FINNHUB_KEY || localStorage.getItem(KEY_STORAGE) || '';
}

export function setFinnhubKey(key) {
  if (key) localStorage.setItem(KEY_STORAGE, key.trim());
  else      localStorage.removeItem(KEY_STORAGE);
}

export function hasFinnhubKey() {
  return !!getFinnhubKey();
}

// ── Finnhub — stocks & ETFs ──────────────────────────────────────────────────

async function fetchFinnhubPrice(sym) {
  const key = getFinnhubKey();
  if (!key) return null;
  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(sym)}&token=${key}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    // d.c = current price, d.d = change, d.dp = change%, d.h/l = high/low, d.pc = prev close
    if (!d.c || d.c === 0) return null;
    return {
      price:      +d.c.toFixed(4),
      changeAbs:  +((d.d)  || 0).toFixed(4),
      changePct:  +((d.dp) || 0).toFixed(3),
      dayHigh:    d.h || d.c,
      dayLow:     d.l || d.c,
      prevClose:  d.pc || d.c,
      volume:     0,
      lastUpdated: Date.now(),
      source:     'finnhub',
    };
  } catch {
    return null;
  }
}

// ── CoinGecko — crypto ───────────────────────────────────────────────────────

async function fetchCryptoPrices(syms) {
  const ids = syms.map(coingeckoId).filter(Boolean).join(',');
  if (!ids) return {};
  try {
    // Use demo API endpoint (no key required, rate-limited ~30 req/min)
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
    const r = await fetch(url);
    if (!r.ok) return {};
    const json = await r.json();
    const result = {};
    syms.forEach(sym => {
      const id = coingeckoId(sym);
      const d  = id && json[id];
      if (d) {
        result[sym] = {
          price:      d.usd,
          changeAbs:  +(d.usd * (d.usd_24h_change || 0) / 100).toFixed(4),
          changePct:  +(d.usd_24h_change || 0).toFixed(3),
          volume:     d.usd_24h_vol || 0,
          dayHigh:    null,
          dayLow:     null,
          lastUpdated: Date.now(),
          source:     'coingecko',
        };
      }
    });
    return result;
  } catch {
    return {};
  }
}

// ── Frankfurter — FX rates ────────────────────────────────────────────────────

export async function fetchFxRates() {
  try {
    const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=KWD,EUR,GBP,JPY,AED');
    if (!r.ok) return null;
    const json = await r.json();
    return json.rates || null;
  } catch {
    return null;
  }
}

// ── Main entry ────────────────────────────────────────────────────────────────

export async function fetchPrices(syms) {
  const unique  = [...new Set(syms.map(s => s.toUpperCase()))];
  const cryptos = unique.filter(isCrypto);
  const stocks  = unique.filter(s => !isCrypto(s));

  const results = {};

  // Crypto batch (CoinGecko)
  if (cryptos.length) {
    const c = await fetchCryptoPrices(cryptos);
    Object.assign(results, c);
  }

  // Stocks/ETFs — parallel Finnhub requests (60/min limit — fine for <50 holdings)
  if (stocks.length && hasFinnhubKey()) {
    await Promise.all(stocks.map(async sym => {
      const d = await fetchFinnhubPrice(sym);
      if (d) results[sym] = d;
    }));
  }

  return results;
}
