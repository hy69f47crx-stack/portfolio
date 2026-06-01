export function fmtCurrency(n, { sym = "$", compact = false, decimals = 2 } = {}) {
  if (n == null || isNaN(n)) return "—";
  if (compact && Math.abs(n) >= 1000) {
    const units = [["T",1e12],["B",1e9],["M",1e6],["K",1e3]];
    for (const [u, v] of units) {
      if (Math.abs(n) >= v) {
        const x = n / v;
        return sym + x.toFixed(x < 10 ? 2 : 1) + u;
      }
    }
  }
  return sym + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(n, decimals = 2) {
  if (n == null || isNaN(n)) return "—";
  const s = n >= 0 ? "+" : "";
  return s + n.toFixed(decimals) + "%";
}

export function fmtNum(n, decimals = 2) {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
