"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { APP } from "@/lib/site";
import { useApp } from "@/lib/store";
import { nameOf } from "@/lib/world";

type Turn = { role: "user" | "assistant"; content: string };

export function AssistantChat() {
  const sp = useSearchParams();
  const { profile } = useApp();
  const nick = profile?.assistantNickname || APP.assistant;
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const sentQ = useRef(false);

  const starters = profile
    ? [
        `Where can I go visa-free with my ${nameOf(profile.passport)} passport next month?`,
        `What documents and bank statements do I need for a Schengen visa?`,
        `Plan 5 days for my vibe on a ${profile.budget} budget`,
        `I'm thinking of moving abroad. Which countries are realistic for me?`,
      ]
    : ["Do Nigerians need a visa for Kenya?", "Best place in Africa for nightlife in December?", "How do I extend a UK visitor visa?", "Hidden beaches in Ghana?"];

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Turn[] = [...turns, { role: "user", content: q }];
    setTurns(next); setInput(""); setBusy(true); setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, profile: profile ? { name: profile.name, passport: profile.passport, home: profile.home, vibes: profile.vibes, interests: profile.interests, budget: profile.budget, company: profile.company, pace: profile.pace, assistantStyle: profile.assistantStyle, assistantNickname: profile.assistantNickname } : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const q = sp.get("q");
    if (q && !sentQ.current) { sentQ.current = true; send(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [turns, busy]);

  return (
    <div className="stack-lg fade-in" style={{ maxWidth: 860 }}>
      <div className="stack" style={{ gap: 10 }}>
        <span className="eyebrow">✨ {nick} · {APP.assistantMeaning}</span>
        <h1>Ask me <span className="gradient-text">anything travel.</span></h1>
        <p className="muted">Visas for your passport, what to pack in your bank statement, where to party or hike this month, and whether you could live there. I check official sources for the latest rules.</p>
      </div>

      <div className="card" style={{ gap: 16, minHeight: 320 }}>
        {turns.length === 0 ? (
          <div className="stack">
            <span className="lbl">Try one</span>
            <div className="chips">{starters.map((s) => <button key={s} type="button" className="chip" onClick={() => send(s)}>{s}</button>)}</div>
          </div>
        ) : (
          <div className="chat-log" aria-live="polite">
            {turns.map((t, i) => <div key={i} className={`bubble ${t.role === "user" ? "bubble-me" : "bubble-ai"}`}>{t.content}</div>)}
            {busy && <div className="bubble bubble-ai"><span className="typing" aria-label={`${nick} is thinking`}><i /><i /><i /></span></div>}
            <div ref={endRef} />
          </div>
        )}
        {error && <p role="alert" className="note">{error}</p>}
        <form className="row" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <label htmlFor="wq" className="lbl" style={{ flexBasis: "100%", marginBottom: -4 }}>Your question</label>
          <input id="wq" value={input} maxLength={2000} onChange={(e) => setInput(e.target.value)} placeholder="Can I extend my visa in Thailand?" style={{ flex: "1 1 260px" }} />
          <button className="btn btn-sun" type="submit" disabled={busy || !input.trim()}>{busy ? "Thinking…" : "Ask"}</button>
        </form>
      </div>
      <p className="muted" style={{ fontSize: "0.78rem" }}>{nick} is AI and can make mistakes. It isn&apos;t legal advice. Always confirm visa rules on official government sites. Don&apos;t share passport numbers or bank details.</p>
    </div>
  );
}
