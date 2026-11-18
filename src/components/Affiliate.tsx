import { AFFILIATES, type AffiliateKind } from "@/lib/site";

/** Shows a partner offer only when its link is configured. */
export function Affiliate({ kind }: { kind: AffiliateKind }) {
  const a = AFFILIATES[kind];
  if (!a.url) return null;
  return (
    <div className="affiliate">
      <strong>{a.label}</strong>
      <span className="muted" style={{ fontSize: "0.9rem" }}>{a.blurb}</span>
      <a className="btn btn-ghost" href={a.url} target="_blank" rel="sponsored noopener noreferrer" style={{ justifySelf: "start" }}>
        See options ↗
      </a>
      <small>Partner link: we may earn a commission at no extra cost to you.</small>
    </div>
  );
}
