import Link from "next/link";
import { SITE } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${SITE.name} home`}>
          <span className="brand-mark" aria-hidden="true">SP</span>
          {SITE.name}
        </Link>
        <nav className="nav" aria-label="Main">
          <Link href="/visa">Visa Hub</Link>
          <Link href="/countries">Countries</Link>
          <Link href="/agent">Ask {SITE.agentName}</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <Link href="/agent" className="btn btn-primary" style={{ padding: "8px 16px" }}>
          Start free
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontFamily: "var(--display)", fontSize: "1.3rem" }}>{SITE.name}</strong>
          <p style={{ opacity: 0.8, maxWidth: "34ch" }}>{SITE.tagline}</p>
          <p style={{ opacity: 0.6, fontSize: "0.8rem" }}>
            Not a government website or visa agent. Information is general guidance; always confirm on official sites.
          </p>
        </div>
        <div>
          <h4>Plan</h4>
          <Link href="/visa">Visa Hub</Link>
          <Link href="/countries">Country guides</Link>
          <Link href="/agent">Ask {SITE.agentName}</Link>
        </div>
        <div>
          <h4>Regions</h4>
          <Link href="/countries#africa">Africa</Link>
          <Link href="/countries#asia">Asia</Link>
          <Link href="/countries#europe">Europe</Link>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About us</Link>
          <Link href="/legal">Terms, privacy and disclosures</Link>
        </div>
      </div>
    </footer>
  );
}
