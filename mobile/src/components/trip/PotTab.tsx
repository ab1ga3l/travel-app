import { useState } from "react";
import { Text, View } from "react-native";
import { Badge, Between, Body, Button, Card, Chip, Field, H3, Muted, Progress, Row, Stat, Strong } from "@/components/ui";
import { useApp } from "@/lib/store";
import { payMethodsOf } from "@/shared/geo";
import { potRaised, potShare, potSpent } from "@/shared/tripTypes";
import { FONT, useTheme } from "@/theme";
import { type TabProps, memberName, money, openWhatsApp, uid } from "./shared";

const CATS = ["Stay", "Transport", "Food", "Activities", "Shopping", "Other"];

export function PotTab({ trip, me, canManage, update }: TabProps) {
  const t = useTheme();
  const { profile } = useApp();
  const methods = payMethodsOf(profile?.home ?? profile?.passport ?? "KE");
  const raised = potRaised(trip), spent = potSpent(trip);
  const share = potShare(trip);
  const pct = trip.pot.target ? Math.min(100, Math.round((raised / trip.pot.target) * 100)) : 0;
  const [pay, setPay] = useState({ memberId: me.id, amount: String(Math.round(share) || ""), method: methods[0], ref: "" });
  const [spend, setSpend] = useState({ label: "", amount: "", category: "Stay" });
  const [cfg, setCfg] = useState({ target: String(trip.pot.target || ""), payTo: trip.pot.payTo ?? "", payNote: trip.pot.payNote ?? "" });
  const [msg, setMsg] = useState("");

  const paidBy = (mid: string, status?: "confirmed" | "pending") => trip.pot.contributions.filter((c) => c.memberId === mid && (!status || c.status === status)).reduce((a, c) => a + c.amount, 0);
  const notPaid = trip.members.filter((m) => paidBy(m.id, "confirmed") < share - 0.5);
  const byCat = CATS.map((c) => [c, trip.pot.spends.filter((s) => s.category === c).reduce((a, s) => a + s.amount, 0)] as const).filter(([, v]) => v > 0);

  const record = () => {
    const amount = Number(pay.amount);
    if (!(amount > 0)) return setMsg("Enter the amount you sent.");
    update((x) => ({ ...x, pot: { ...x.pot, contributions: [...x.pot.contributions, { id: uid(), memberId: pay.memberId, amount, method: pay.method, ref: pay.ref.trim() || undefined, status: canManage ? "confirmed" : "pending", at: new Date().toISOString() }] } }));
    setMsg(canManage ? "Recorded and confirmed." : "Recorded! The treasurer will confirm it."); setPay({ ...pay, ref: "" });
  };

  return (
    <View style={{ gap: 14 }}>
      <Card glow style={{ gap: 10 }}>
        <Between><Muted style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: 1.4 }}>GROUP POT</Muted><Badge label={`${pct}% in`} t="free" /></Between>
        <Text style={{ fontFamily: FONT.display, fontSize: 32, color: t.ink, letterSpacing: -1 }}>{money(trip, raised)}</Text>
        <Muted>of {money(trip, trip.pot.target)} · {money(trip, share)} each</Muted>
        <Progress value={pct} />
        {trip.pot.payTo ? <Body>Send your share to <Strong>{trip.pot.payTo}</Strong>{trip.pot.payNote ? ` · ${trip.pot.payNote}` : ""}</Body> : null}
      </Card>
      <Row gap={10}>
        <Stat value={money(trip, spent)} label="spent" color={t.stop} />
        <Stat value={money(trip, raised - spent)} label="left in the pot" color={t.go} />
      </Row>

      <Card style={{ gap: 4 }}>
        <Between><H3>Who&apos;s paid</H3><Button label="📣 Remind" kind="ghost" small onPress={() => openWhatsApp(`💰 ${trip.name} pot: ${money(trip, raised)} of ${money(trip, trip.pot.target)} in. Still to pay: ${notPaid.map((m) => m.name).join(", ") || "nobody 🎉"}. Each share is ${money(trip, share)}.${trip.pot.payTo ? ` Send to ${trip.pot.payTo}.` : ""}`)} /></Between>
        {trip.members.map((m) => {
          const ok = paidBy(m.id, "confirmed"), pend = paidBy(m.id, "pending");
          const k = ok >= share - 0.5 ? "free" : ok + pend > 0 ? "easy" : "hard";
          return (
            <Between key={m.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line }}>
              <Body>{m.name}{m.role === "treasurer" ? " · 🏦" : m.role === "owner" ? " · organiser" : ""}</Body>
              <Badge label={k === "free" ? `Paid ✓` : k === "easy" ? `${money(trip, ok + pend)}${pend ? " pending" : ""}` : "Not yet"} t={k} />
            </Between>
          );
        })}
      </Card>

      <Card style={{ gap: 12 }}>
        <H3>I paid into the pot</H3>
        {canManage && <Row gap={6} wrap>{trip.members.map((m) => <Chip key={m.id} label={m.name} on={pay.memberId === m.id} onPress={() => setPay({ ...pay, memberId: m.id })} />)}</Row>}
        <Row gap={6} wrap>{methods.map((x) => <Chip key={x} label={x} on={pay.method === x} onPress={() => setPay({ ...pay, method: x })} />)}</Row>
        <Row gap={10}>
          <Field label={`Amount (${trip.currency})`} value={pay.amount} onChangeText={(amount) => setPay({ ...pay, amount: amount.replace(/[^\d.]/g, "") })} keyboardType="decimal-pad" />
          <Field label="Transaction code" value={pay.ref} onChangeText={(ref) => setPay({ ...pay, ref: ref.toUpperCase() })} placeholder="SKL4X2ABCD" autoCapitalize="characters" />
        </Row>
        <Button label="Record payment" onPress={record} />
        {msg ? <Muted>{msg}</Muted> : null}
      </Card>

      {trip.pot.contributions.length > 0 && (
        <Card style={{ gap: 4 }}>
          <H3>Payments</H3>
          {[...trip.pot.contributions].reverse().map((c) => (
            <View key={c.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line, gap: 6 }}>
              <Between><Strong>{memberName(trip, c.memberId)} · {money(trip, c.amount)}</Strong><Badge label={c.status} t={c.status === "confirmed" ? "free" : "easy"} /></Between>
              <Muted style={{ fontSize: 12.5 }}>via {c.method}{c.ref ? ` · ${c.ref}` : ""} · {c.at.slice(0, 10)}</Muted>
              {canManage && (
                <Row gap={8}>
                  {c.status === "pending" && <Button label="Confirm" kind="soft" small onPress={() => update((x) => ({ ...x, pot: { ...x.pot, contributions: x.pot.contributions.map((y) => (y.id === c.id ? { ...y, status: "confirmed" } : y)) } }))} />}
                  <Button label="Remove" kind="ghost" small onPress={() => update((x) => ({ ...x, pot: { ...x.pot, contributions: x.pot.contributions.filter((y) => y.id !== c.id) } }))} />
                </Row>
              )}
            </View>
          ))}
        </Card>
      )}

      <Card style={{ gap: 10 }}>
        <H3>How the pot is spent</H3>
        {byCat.map(([c, v]) => (
          <Row key={c} gap={10}><Muted style={{ width: 82, fontSize: 13 }}>{c}</Muted><View style={{ flex: 1 }}><Progress value={(v / Math.max(1, spent)) * 100} color={t.ready} /></View><Muted style={{ fontSize: 13 }}>{money(trip, v)}</Muted></Row>
        ))}
        {canManage ? (
          <View style={{ gap: 10 }}>
            <Row gap={6} wrap>{CATS.map((c) => <Chip key={c} label={c} on={spend.category === c} onPress={() => setSpend({ ...spend, category: c })} />)}</Row>
            <Row gap={10}>
              <Field label="Spent on" value={spend.label} onChangeText={(label) => setSpend({ ...spend, label })} placeholder="Villa deposit" />
              <Field label="Amount" value={spend.amount} onChangeText={(amount) => setSpend({ ...spend, amount: amount.replace(/[^\d.]/g, "") })} keyboardType="decimal-pad" />
            </Row>
            <Button label="Add spend" kind="soft" onPress={() => { const amount = Number(spend.amount); if (!spend.label.trim() || !(amount > 0)) return; update((x) => ({ ...x, pot: { ...x.pot, spends: [...x.pot.spends, { id: uid(), label: spend.label.trim(), amount, category: spend.category, byMemberId: me.id, at: new Date().toISOString() }] } })); setSpend({ ...spend, label: "", amount: "" }); }} />
          </View>
        ) : <Muted style={{ fontSize: 13 }}>The organiser or treasurer records spending, so everyone sees where the money goes.</Muted>}
        {[...trip.pot.spends].reverse().slice(0, 12).map((s) => <Between key={s.id}><Body>{s.label} <Muted style={{ fontSize: 13 }}>· {s.category}</Muted></Body><Body>{money(trip, s.amount)}</Body></Between>)}
      </Card>

      {canManage && (
        <Card style={{ gap: 12 }}>
          <H3>Pot settings</H3>
          <Field label={`Target (${trip.currency})`} value={cfg.target} onChangeText={(target) => setCfg({ ...cfg, target: target.replace(/\D/g, "") })} keyboardType="number-pad" />
          <Field label="Where to send money" value={cfg.payTo} onChangeText={(payTo) => setCfg({ ...cfg, payTo })} placeholder="M-Pesa 0712 345 678 (Amina)" />
          <Field label="Note for the crew" value={cfg.payNote} onChangeText={(payNote) => setCfg({ ...cfg, payNote })} placeholder="Pay by 1 Dec, use your name as reference" />
          <Button label="Save" kind="soft" onPress={() => update((x) => ({ ...x, pot: { ...x.pot, target: Number(cfg.target) || 0, payTo: cfg.payTo.trim() || undefined, payNote: cfg.payNote.trim() || undefined } }))} />
        </Card>
      )}
      <Muted style={{ fontSize: 12 }}>The pot is a shared tracker: money goes straight to your treasurer by M-Pesa, bank or card, and everyone sees it here. Paying and withdrawing in the app comes later with a licensed payments partner.</Muted>
    </View>
  );
}
