"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Turn = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Do I need a visa for France with a Nigerian passport?",
  "Where can I go in Africa in March on $60 a day?",
  "How do I make my UK visitor visa application stronger?",
  "Plan 7 days in Kenya for a solo woman",
];

export function AgentChat({ compact = false, agentName = "Ama" }: { compact?: boolean; agentName?: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next = [...turns, { role: "user" as const, content: q }];
    setTurns(next);
    setInput("");
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setTurns([...next, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      {turns.length === 0 && (
        <div className="chips" aria-label="Example questions">
          {STARTERS.slice(0, compact ? 3 : 4).map((s) => (
            <button key={s} type="button" className="chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
      {turns.length > 0 && (
        <div className="chat-log" ref={logRef} aria-live="polite">
          {turns.map((t, i) => (
            <div key={i} className={`msg ${t.role === "user" ? "msg-user" : "msg-ai"}`}>
              {t.content}
            </div>
          ))}
          {busy && <div className="msg msg-ai muted">{agentName} is checking the guides…</div>}
        </div>
      )}
      {error && (
        <p role="alert" className="notice">
          {error} {error.includes("free questions") && <Link href="/pricing">See Visa Ready</Link>}
        </p>
      )}
      <form
        className="row"
        style={{ alignItems: "center" }}
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="agent-q" className="lbl" style={{ flexBasis: "100%", marginBottom: -6 }}>
          Ask {agentName} about visas, budgets or where to go
        </label>
        <input
          id="agent-q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Can a Ghanaian visit Rwanda without a visa?"
          maxLength={1500}
          style={{ flex: "1 1 260px" }}
        />
        <button className="btn btn-primary" type="submit" disabled={busy || !input.trim()} style={{ flex: "0 0 auto" }}>
          {busy ? "Thinking…" : "Ask"}
        </button>
      </form>
      <p className="muted" style={{ fontSize: "0.78rem" }}>
        {agentName} is an AI assistant. It can make mistakes, and it isn't legal advice. Always confirm visa rules on official sites.
      </p>
    </div>
  );
}
