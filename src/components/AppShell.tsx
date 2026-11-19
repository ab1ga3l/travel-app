"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";

const NAV = [
  { href: "/", label: "Home", ico: "✦" },
  { href: "/discover", label: "Discover", ico: "🧭" },
  { href: "/visa", label: "Visa", ico: "🛂" },
  { href: "/trips", label: "My trips", ico: "🗺️" },
  { href: "/community", label: "Community", ico: "💬" },
];
const MORE = [
  { href: "/wazi", label: `Ask ${APP.assistant}`, ico: "✨" },
  { href: "/deals", label: "Deals", ico: "🎟️" },
  { href: "/profile", label: "Profile", ico: "👤" },
];

const active = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const { profile } = useApp();
  return (
    <div className="shell">
      <aside className="rail" aria-label="Main navigation">
        <Link href="/" className="logo"><span className="logo-mark">AV</span>{APP.name}</Link>
        {[...NAV, ...MORE].map((n) => (
          <Link key={n.href} href={n.href} className="nav-link" aria-current={active(path, n.href) ? "page" : undefined}>
            <span className="ico" aria-hidden="true">{n.ico}</span>{n.label}
          </Link>
        ))}
        <div className="rail-foot">
          {profile ? (
            <Link href="/profile" className="card card-soft" style={{ padding: 14, gap: 4 }}>
              <span className="eyebrow" style={{ color: "var(--mint)" }}>Traveller</span>
              <strong>{profile.name || "You"}</strong>
              <span className="muted" style={{ fontSize: "0.8rem" }}>Edit your vibe →</span>
            </Link>
          ) : (
            <Link href="/start" className="btn btn-sun">Find your travel vibe</Link>
          )}
        </div>
      </aside>

      <header className="topbar">
        <Link href="/" className="logo" style={{ padding: 0 }}><span className="logo-mark">AV</span>{APP.name}</Link>
        <div className="row" style={{ gap: 8 }}>
          <Link href="/deals" className="btn btn-ghost btn-sm" aria-label="Deals">🎟️</Link>
          <Link href="/wazi" className="btn btn-sun btn-sm">✨ {APP.assistant}</Link>
          <Link href="/profile" className="btn btn-ghost btn-sm" aria-label="Profile">👤</Link>
        </div>
      </header>

      <main className="main" id="main">{children}</main>

      <nav className="tabbar" aria-label="Tabs">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="tab" aria-current={active(path, n.href) ? "page" : undefined}>
            <span className="ico" aria-hidden="true">{n.ico}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
