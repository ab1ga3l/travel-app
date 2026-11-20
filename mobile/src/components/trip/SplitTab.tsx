import { useState } from "react";
import { View } from "react-native";
import { Badge, Between, Body, Button, Card, Chip, Field, H3, Muted, Note, Row, Strong } from "@/components/ui";
import { settleUp } from "@/shared/tripTypes";
import { useTheme } from "@/theme";
import { type TabProps, memberName, money, openWhatsApp, uid } from "./shared";

export function SplitTab({ trip, me, update }: TabProps) {
  const t = useTheme();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(me.id);
  const [custom, setCustom] = useState(false);
  const [shares, setShares] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");
  const settle = settleUp(trip);
  const total = trip.expenses.reduce((a, e) => a + e.amount, 0);

  const add = () => {
    const n = Number(amount);
    if (!label.trim() || !(n > 0)) return setErr("Add what it was and how much.");
    let split: "equal" | Record<string, number> = "equal";
    if (custom) {
      split = Object.fromEntries(Object.entries(shares).map(([k, v]) => [k, Number(v) || 0]).filter(([, v]) => (v as number) > 0));
      const sum = Object.values(split).reduce((a, b) => a + b, 0);
      if (Math.abs(sum - n) > 1) return setErr(`The shares add up to ${money(trip, sum)}, not ${money(trip, n)}.`);
    }
    update((x) => ({ ...x, expenses: [...x.expenses, { id: uid(), label: label.trim(), amount: n, paidBy, split, at: new Date().toISOString() }] }));
    setLabel(""); setAmount(""); setShares({}); setErr("");
  };

  return (
    <View style={{ gap: 14 }}>
      <Muted>For costs someone paid on the spot, separate from the pot. We work out the fewest transfers to settle up.</Muted>
      <Card style={{ gap: 4 }}>
        <Between><H3>Settle up</H3><Muted style={{ fontSize: 13 }}>{money(trip, total)} shared</Muted></Between>
        {settle.length === 0 ? <Note>All square 🎉</Note> : settle.map((s, i) => (
          <Between key={i} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line }}>
            <Body><Strong>{memberName(trip, s.from)}</Strong> pays <Strong>{memberName(trip, s.to)}</Strong></Body>
            <Badge label={money(trip, s.amount)} t="easy" />
          </Between>
        ))}
        {settle.length > 0 && <Button label="Share on WhatsApp" kind="ghost" small onPress={() => openWhatsApp(`🧾 ${trip.name}: who owes whom\n${settle.map((s) => `• ${memberName(trip, s.from)} → ${memberName(trip, s.to)}: ${money(trip, s.amount)}`).join("\n")}`)} />}
      </Card>
      <Card style={{ gap: 12 }}>
        <H3>Add an expense</H3>
        <Row gap={10}>
          <Field label="What" value={label} onChangeText={setLabel} placeholder="Dinner at Forodhani" />
          <Field label={`Amount (${trip.currency})`} value={amount} onChangeText={(v) => setAmount(v.replace(/[^\d.]/g, ""))} keyboardType="decimal-pad" />
        </Row>
        <Muted style={{ fontSize: 13 }}>Paid by</Muted>
        <Row gap={6} wrap>{trip.members.map((m) => <Chip key={m.id} label={m.name} on={paidBy === m.id} onPress={() => setPaidBy(m.id)} />)}</Row>
        <Row gap={6}><Chip label="Split equally" on={!custom} onPress={() => setCustom(false)} /><Chip label="Custom amounts" on={custom} onPress={() => setCustom(true)} /></Row>
        {custom && trip.members.map((m) => <Field key={m.id} label={m.name} value={shares[m.id] ?? ""} onChangeText={(v) => setShares({ ...shares, [m.id]: v.replace(/[^\d.]/g, "") })} keyboardType="decimal-pad" />)}
        <Button label="Add expense" onPress={add} />
        {err ? <Muted>{err}</Muted> : null}
      </Card>
      {trip.expenses.length > 0 && (
        <Card style={{ gap: 4 }}>
          <H3>Expenses</H3>
          {[...trip.expenses].reverse().map((e) => (
            <Between key={e.id} style={{ paddingVertical: 10, borderTopWidth: 1, borderTopColor: t.line }}>
              <View style={{ flex: 1 }}><Body>{e.label}</Body><Muted style={{ fontSize: 12.5 }}>{memberName(trip, e.paidBy)} paid · {e.split === "equal" ? "equal split" : "custom"}</Muted></View>
              <Row gap={8}><Strong>{money(trip, e.amount)}</Strong><Button label="✕" kind="ghost" small onPress={() => update((x) => ({ ...x, expenses: x.expenses.filter((y) => y.id !== e.id) }))} /></Row>
            </Between>
          ))}
        </Card>
      )}
    </View>
  );
}
