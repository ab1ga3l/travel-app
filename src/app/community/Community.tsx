"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/lib/store";
import { cloudEnabled, sb } from "@/lib/supabaseBrowser";
import { WORLD, flag, nameOf } from "@/lib/world";

const TOPICS = [
  ["visa", "🛂 Visa"], ["money", "💳 Money"], ["safety", "🛟 Safety"], ["gems", "💎 Hidden gems"],
  ["transport", "🚌 Getting around"], ["moving", "🏡 Moving abroad"], ["meetups", "👋 Meetups"], ["deals", "🎟️ Deals"],
] as const;
type Topic = (typeof TOPICS)[number][0];

interface Post { id: string; user_id: string; author_name: string; country: string | null; topic: Topic; body: string; link: string | null; created_at: string; replies?: Reply[] }
interface Reply { id: string; post_id: string; author_name: string; body: string; created_at: string }

const safeUrl = (u: string | null) => { try { const x = new URL(u ?? ""); return x.protocol === "https:" || x.protocol === "http:" ? x : null; } catch { return null; } };
const initials = (n: string) => n.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase() || "T";
const topicLabel = (t: string) => TOPICS.find(([k]) => k === t)?.[1] ?? t;

export function Community() {
  const sp = useSearchParams();
  const { profile, session } = useApp();
  const client = sb();
  const [topic, setTopic] = useState<Topic | "">((sp.get("topic") as Topic) || "");
  const [country, setCountry] = useState(sp.get("country") ?? "");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [newTopic, setNewTopic] = useState<Topic>((sp.get("topic") as Topic) || "visa");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [been, setBeen] = useState<Record<string, string[]>>({});
  const [guides, setGuides] = useState<{ display_name: string; home_country: string | null }[]>([]);
  useEffect(() => {
    if (!client || !country) { setGuides([]); return; }
    client.from("public_profiles").select("display_name,home_country").eq("is_public", true).contains("been", [country]).limit(12)
      .then(({ data }) => setGuides((data ?? []) as { display_name: string; home_country: string | null }[]));
  }, [client, country]);

  const load = useCallback(async () => {
    if (!client) return setPosts([]);
    let q = client.from("posts").select("id,user_id,author_name,country,topic,body,link,created_at,replies(id,post_id,author_name,body,created_at)").order("created_at", { ascending: false }).limit(60);
    if (topic) q = q.eq("topic", topic);
    if (country) q = q.eq("country", country);
    const { data, error } = await q;
    if (error) console.error(error.message);
    const list = (data ?? []) as Post[];
    setPosts(list);
    const ids = Array.from(new Set(list.map((p) => p.user_id)));
    if (ids.length) {
      const { data: pp } = await client.from("public_profiles").select("user_id,been").eq("is_public", true).in("user_id", ids);
      setBeen(Object.fromEntries(((pp ?? []) as { user_id: string; been: string[] | null }[]).map((r) => [r.user_id, r.been ?? []])));
    }
  }, [client, topic, country]);
  useEffect(() => { load(); }, [load]);

  const name = profile?.name || session?.user.email?.split("@")[0] || "Traveller";
  const post = async () => {
    if (!client || !session) return;
    if (body.trim().length < 5) return setMsg("Write a little more so others can help.");
    if (link && !safeUrl(link)) return setMsg("That link doesn't look right. Use a full https:// address.");
    const { error } = await client.from("posts").insert({ user_id: session.user.id, author_name: name, country: country || null, topic: newTopic, body: body.trim(), link: link.trim() || null });
    if (error) return setMsg("Couldn't post. Please try again.");
    setBody(""); setLink(""); setMsg("Posted!"); load();
  };
  const sendReply = async (postId: string) => {
    if (!client || !session || reply.trim().length < 2) return;
    const { error } = await client.from("replies").insert({ post_id: postId, user_id: session.user.id, author_name: name, body: reply.trim() });
    if (!error) { setReply(""); load(); }
  };

  return (
    <div className="stack-lg fade-in">
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow" style={{ color: "var(--lilac)" }}>Community</span>
        <h1>Ask people who&apos;ve <span className="gradient-text">been there.</span></h1>
        <p className="muted" style={{ maxWidth: "60ch" }}>Visa wins and refusals, money hacks, safety notes, gems and meetups, from travellers with passports like yours. Saw something on TikTok, Instagram or X? Share it with the link.</p>
      </div>

      <div className="card" style={{ gap: 12 }}>
        <div className="chips">
          <button type="button" className="chip" aria-pressed={!topic} onClick={() => setTopic("")}>Everything</button>
          {TOPICS.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={topic === k} onClick={() => setTopic(topic === k ? "" : k)}>{l}</button>)}
        </div>
        <div style={{ maxWidth: 320 }}>
          <label className="lbl" htmlFor="cc">Country</label>
          <select id="cc" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {WORLD.map((w) => <option key={w.code} value={w.code}>{flag(w.code)} {w.name}</option>)}
          </select>
        </div>
      </div>

      {!cloudEnabled ? (
        <div className="empty">
          <span style={{ fontSize: "2rem" }}>💬</span>
          <strong>The community opens when accounts are connected.</strong>
          <span>Once it&apos;s live, every post here comes from a real traveller. We never fill it with fake ones.</span>
        </div>
      ) : (
        <>
          {session ? (
            <div className="card" style={{ gap: 12 }}>
              <div className="row"><span className="avatar" aria-hidden="true">{initials(name)}</span><strong>Post as {name}</strong></div>
              <div className="chips">{TOPICS.map(([k, l]) => <button key={k} type="button" className="chip" aria-pressed={newTopic === k} onClick={() => setNewTopic(k)}>{l}</button>)}</div>
              <textarea value={body} maxLength={1500} onChange={(e) => setBody(e.target.value)} placeholder={country ? `Ask or share something about ${nameOf(country)}…` : "Ask a question or share a tip…"} aria-label="Your post" />
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link to a TikTok, Instagram, X or blog post (optional)" aria-label="Source link" />
              <div className="row"><button type="button" className="btn btn-sun" onClick={post}>Post</button><span role="status" className="muted">{msg}</span></div>
            </div>
          ) : (
            <div className="card row" style={{ justifyContent: "space-between" }}><span>Sign in to post and reply.</span><Link href="/auth?next=/community" className="btn btn-soft btn-sm">Sign in</Link></div>
          )}

          {country && (
            <section className="card" style={{ gap: 8 }}>
              <h3>🧭 People who&apos;ve been to {nameOf(country)}</h3>
              {guides.length ? (
                <div className="chips">{guides.map((g, i) => <span key={i} className="badge tone-free">{g.home_country ? flag(g.home_country) : "🌍"} {g.display_name}</span>)}</div>
              ) : <p className="muted" style={{ fontSize: "0.88rem" }}>No one has shared their map for {nameOf(country)} yet. Been? Turn on your “been there” badge in your profile.</p>}
              <p className="muted" style={{ fontSize: "0.82rem" }}>Post your question below with {nameOf(country)} selected and they&apos;ll see it.</p>
            </section>
          )}

          {posts === null ? <div className="muted">Loading…</div> : posts.length === 0 ? (
            <div className="empty">No posts here yet. Start the conversation.</div>
          ) : (
            <div className="stack">
              {posts.map((p) => {
                const L = safeUrl(p.link);
                return (
                  <article key={p.id} className="card post">
                    <span className="avatar" aria-hidden="true">{initials(p.author_name)}</span>
                    <div className="stack" style={{ gap: 8 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <strong>{p.author_name}</strong>
                        {been[p.user_id] && (p.country && been[p.user_id].includes(p.country)
                          ? <span className="badge tone-free" title="This traveller has been here">🧭 Been to {nameOf(p.country)}</span>
                          : been[p.user_id].length > 0 && <span className="badge tone-free">🌍 {been[p.user_id].length} countries</span>)}
                        <span className="badge tone-lilac">{topicLabel(p.topic)}</span>
                        {p.country && <span className="badge tone-unknown">{flag(p.country)} {nameOf(p.country)}</span>}
                        <span className="muted" style={{ fontSize: "0.78rem" }}>{p.created_at.slice(0, 10)}</span>
                      </div>
                      <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{p.body}</p>
                      {L && <a href={L.href} target="_blank" rel="noopener noreferrer nofollow ugc" style={{ color: "var(--mint)", fontWeight: 600, fontSize: "0.88rem" }}>Source: {L.hostname.replace(/^www\./, "")} ↗</a>}
                      <button type="button" className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }} onClick={() => setOpen(open === p.id ? null : p.id)}>
                        💬 {p.replies?.length ?? 0} {p.replies?.length === 1 ? "reply" : "replies"}
                      </button>
                      {open === p.id && (
                        <div className="stack fade-in" style={{ gap: 8 }}>
                          {(p.replies ?? []).map((r) => (
                            <div key={r.id} className="card card-soft" style={{ padding: 12, gap: 4 }}><strong style={{ fontSize: "0.88rem" }}>{r.author_name}</strong><p>{r.body}</p></div>
                          ))}
                          {session && (
                            <div className="row"><input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" aria-label="Reply" style={{ flex: "1 1 220px" }} /><button type="button" className="btn btn-soft btn-sm" onClick={() => sendReply(p.id)}>Reply</button></div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
