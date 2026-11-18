const M = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const FULL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthStrip({ best, ok, full = false }: { best: number[]; ok: number[]; full?: boolean }) {
  const now = new Date().getMonth() + 1;
  return (
    <div className="months" role="list" aria-label="Best months to visit">
      {(full ? FULL : M).map((m, i) => {
        const n = i + 1;
        const cls = best.includes(n) ? "m-good" : ok.includes(n) ? "m-ok" : "m-bad";
        const label = cls === "m-good" ? "great" : cls === "m-ok" ? "possible" : "not ideal";
        return (
          <span key={i} role="listitem" className={`${cls} ${n === now ? "m-now" : ""}`} title={`${FULL[i]}: ${label}${n === now ? " (this month)" : ""}`}>
            {m}
          </span>
        );
      })}
    </div>
  );
}

export const monthName = (n: number) => FULL[n - 1];
