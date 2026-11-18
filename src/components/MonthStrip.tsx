const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthStrip({ best, ok }: { best: number[]; ok: number[] }) {
  return (
    <div className="months" role="list" aria-label="Best months to visit">
      {M.map((m, i) => {
        const n = i + 1;
        const cls = best.includes(n) ? "m-good" : ok.includes(n) ? "m-ok" : "m-bad";
        const label = cls === "m-good" ? "great" : cls === "m-ok" ? "possible" : "not ideal";
        return (
          <span key={m} className={cls} role="listitem" title={`${m}: ${label}`}>
            {m}
          </span>
        );
      })}
    </div>
  );
}
