"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";

const TABS = [
  { href: "/", label: "Home", ico: "✦" },
  { href: "/discover", label: "Explore", ico: "🧭" },
  { href: "/trips", label: "Trips", ico: "🧳" },
  { href: "/map", label: "My map", ico: "🗺️" },
  { href: "/visa", label: "Visa", ico: "🛂" },
];
const MORE = [
  { href: "/community", label: "Community", ico: "💬" },
  { href: "/events", label: "Events", ico: "🎉" },
  { href: "/move", label: "Move abroad", ico: "🏡" },
  { href: "/safety", label: "Safety", ico: "🛟" },
  { href: "/pocket", label: "Pocket (offline)", ico: "📴" },
  { href: "/deals", label: "Deals", ico: "🎟️" },
  { href: "/profile", label: "Profile", ico: "👤" },
];
// Screens that show without the app chrome.
const BARE = ["/welcome", "/auth", "/setup"];
// Personal screens that need onboarding first. Guides, visa pages and gems stay open to everyone.
const PERSONAL = ["/", "/trips", "/map", "/move", "/pocket", "/safety", "/ask", "/join"];

const active = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() || "/";
  const router = useRouter();
  const { ready, profile, seenIntro, session, guest } = useApp();
  const assistantName = profile?.assistantNickname || APP.assistant;
  const isPersonal = PERSONAL.some((p) => (p === "/" ? path === "/" : path === p || path.startsWith(p + "/")));

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);

  useEffect(() => {
    if (!ready || profile?.onboarded || !isPersonal) return;
    const q = path === "/" ? "" : `?next=${encodeURIComponent(path)}`;
    if (!session && !guest) router.replace(`/auth${q}`);
    else if (!seenIntro) router.replace(`/welcome${q}`);
    else router.replace(`/setup${q}`);
  }, [ready, profile?.onboarded, seenIntro, session, guest, path, router, isPersonal]);

  if (BARE.some((b) => path.startsWith(b))) return <div className="bare">{children}</div>;

  return (
    <div className="shell">
      <aside className="rail" aria-label="Main navigation">
        <Link href="/" className="logo"><span className="logo-mark">TK</span>{APP.name}</Link>
        {[...TABS, ...MORE].map((n) => (
          <Link key={n.href} href={n.href} className="nav-link" aria-current={active(path, n.href) ? "page" : undefined}>
            <span className="ico" aria-hidden="true">{n.ico}</span>{n.label}
          </Link>
        ))}
        <div className="rail-foot">
          <Link href="/ask" className="btn btn-sun">✨ Ask {assistantName}</Link>
        </div>
      </aside>

      <header className="topbar">
        <Link href="/" className="logo" style={{ padding: 0 }}><span className="logo-mark">TK</span>{APP.name}</Link>
        <div className="row" style={{ gap: 8 }}>
          <Link href="/community" className="btn btn-ghost btn-sm" aria-label="Community">💬</Link>
          <Link href="/ask" className="btn btn-sun btn-sm">✨ {assistantName}</Link>
          <Link href="/profile" className="btn btn-ghost btn-sm" aria-label="Profile and more">☰</Link>
        </div>
      </header>

      <main className="main" id="main">
        {ready && !profile?.onboarded && !isPersonal && (
          <Link href="/welcome" className="note row" style={{ marginBottom: 16, justifyContent: "space-between" }}>
            <span>Set up your passport and vibe to see what&apos;s easy for <em>you</em>.</span><span className="btn btn-sun btn-sm">Get started</span>
          </Link>
        )}
        {ready && !profile?.onboarded && isPersonal ? <div className="muted">Loading…</div> : children}
      </main>

      <nav className="tabbar" aria-label="Tabs">
        {TABS.map((n) => (
          <Link key={n.href} href={n.href} className="tab" aria-current={active(path, n.href) ? "page" : undefined}>
            <span className="ico" aria-hidden="true">{n.ico}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
