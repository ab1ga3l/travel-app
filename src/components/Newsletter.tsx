"use client";
import { useState } from "react";

export function Newsletter() {
  const [msg, setMsg] = useState("");
  return (
    <form
      className="row"
      style={{ alignItems: "center" }}
      onSubmit={async (e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "");
        const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
        const data = await res.json().catch(() => ({}));
        setMsg(res.ok ? "You're in. Watch your inbox for visa rule changes and deals." : data.error || "Please try again.");
      }}
    >
      <label htmlFor="nl-email" className="lbl" style={{ flexBasis: "100%", color: "inherit", opacity: 0.8, marginBottom: -6 }}>Email address</label>
      <input id="nl-email" name="email" type="email" required placeholder="you@example.com" style={{ flex: "1 1 240px" }} />
      <button className="btn btn-sun" type="submit" style={{ flex: "0 0 auto" }}>Get updates</button>
      <p role="status" style={{ flexBasis: "100%", fontSize: "0.9rem", opacity: 0.85 }}>{msg}</p>
    </form>
  );
}
