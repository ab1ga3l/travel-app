import { useCallback, useEffect, useState } from "react";
import { Switch, View } from "react-native";
import { Badge, Between, Body, Button, Card, Chip, Empty, Field, H3, Muted, Note, Progress, Row } from "@/components/ui";
import { useApp, type Vote } from "@/lib/store";
import { cloudEnabled } from "@/lib/supabase";
import type { Proposal } from "@/shared/tripTypes";
import { useTheme } from "@/theme";
import { type TabProps, memberName, openWhatsApp, uid } from "./shared";

const isOpen = (p: Proposal) => !p.revealed && (!p.deadline || Date.parse(p.deadline) > Date.now());
const DEADLINES: [number, string][] = [[0, "No deadline"], [24, "24 hours"], [72, "3 days"], [168, "1 week"]];

export function VoteTab({ trip, me, canManage, update }: TabProps) {
  const t = useTheme();
  const { session, castVote, myVotes, voteResults } = useApp();
  const shared = cloudEnabled && !!session;
  const [mine, setMine] = useState<Record<string, Vote>>({});
  const [results, setResults] = useState<Record<string, { yes: number; no: number; abstain: number }>>({});
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [hours, setHours] = useState(72);
  const [sealed, setSealed] = useState(true);

  const refresh = useCallback(async () => {
    if (!shared) return;
    const [m, r] = await Promise.all([myVotes(trip.id), voteResults(trip.id)]);
    setMine(m); setResults(r);
  }, [shared, trip.id, myVotes, voteResults]);
  useEffect(() => { refresh(); }, [refresh, trip.updatedAt]);

  const propose = () => {
    if (!title.trim()) return;
    const p: Proposal = { id: uid(), title: title.trim(), detail: detail.trim() || undefined, kind: "activity", deadline: hours ? new Date(Date.now() + hours * 3600e3).toISOString() : undefined, sealed, createdBy: me.id, at: new Date().toISOString() };
    update((x) => ({ ...x, proposals: [p, ...x.proposals] }));
    setTitle(""); setDetail("");
  };
  const vote = async (p: Proposal, v: Vote) => { await castVote(trip, p.id, v); setMine((m) => ({ ...m, [p.id]: v })); refresh(); };

  return (
    <View style={{ gap: 14 }}>
      {!shared && trip.members.length > 1 && <Note>Friends&apos; votes sync once accounts are on. For now you can collect ideas and record your own vote.</Note>}
      <Card style={{ gap: 12 }}>
        <H3>🗳️ Propose something</H3>
        <Field value={title} onChangeText={setTitle} placeholder="Sunset dhow cruise on Saturday?" maxLength={100} />
        <Field value={detail} onChangeText={setDetail} placeholder="Details (optional): KES 3,500 each, 2 hours" maxLength={200} />
        <Row gap={6} wrap>{DEADLINES.map(([h, l]) => <Chip key={h} label={l} on={hours === h} onPress={() => setHours(h)} />)}</Row>
        <Between><Body>🔒 Keep votes sealed until it closes</Body><Switch value={sealed} onValueChange={setSealed} trackColor={{ true: t.brand, false: t.line }} thumbColor="#fff" /></Between>
        <Button label="Start the vote" disabled={!title.trim()} onPress={propose} />
      </Card>
      {trip.proposals.length === 0 ? <Empty emoji="🗳️" title="No votes yet." text="Propose the first activity, place or date." /> : trip.proposals.map((p) => {
        const r = results[p.id];
        const my = shared ? mine[p.id] : p.localVote;
        const total = r ? r.yes + r.no + r.abstain : 0;
        const open = isOpen(p);
        const verdict = r && !open ? (r.yes > r.no ? "approved" : "declined") : null;
        return (
          <Card key={p.id} style={{ gap: 10 }}>
            <Between>
              <Badge label={open ? "Voting" : verdict === "approved" ? "✅ Approved" : verdict ? "❌ Declined" : "Closed"} t={open ? "lilac" : verdict === "approved" ? "free" : verdict ? "hard" : "unknown"} />
              <Muted style={{ fontSize: 12 }}>by {memberName(trip, p.createdBy)}</Muted>
            </Between>
            <H3>{p.title}</H3>
            {p.detail ? <Muted>{p.detail}</Muted> : null}
            {p.deadline ? <Muted style={{ fontSize: 12 }}>{open ? "Closes" : "Closed"} {new Date(p.deadline).toLocaleString()}</Muted> : null}
            <Row gap={8}>{(["yes", "no", "abstain"] as Vote[]).map((v) => <Chip key={v} label={v === "yes" ? "👍 Yes" : v === "no" ? "👎 No" : "🤷🏾 Pass"} on={my === v} onPress={open ? () => vote(p, v) : undefined} />)}</Row>
            {my ? <Muted style={{ fontSize: 13 }}>Your vote: {my}{p.sealed && open ? " (only you can see this)" : ""}</Muted> : null}
            {r && total > 0 ? (["yes", "no", "abstain"] as const).map((k) => (
              <Row key={k} gap={10}><Muted style={{ width: 58, fontSize: 13 }}>{k}</Muted><View style={{ flex: 1 }}><Progress value={(r[k] / total) * 100} color={k === "yes" ? t.go : k === "no" ? t.stop : t.muted} /></View><Muted style={{ width: 20 }}>{r[k]}</Muted></Row>
            )) : shared && p.sealed && open ? <Muted>🔒 Sealed until it closes.</Muted> : null}
            <Row gap={8} wrap>
              <Button label="Share" kind="ghost" small onPress={() => openWhatsApp(`🗳️ Vote on "${p.title}" for ${trip.name}! Open Tokende → Trips → Vote. New? Join with code ${trip.code}.`)} />
              {canManage && open && <Button label="Reveal now" kind="ghost" small onPress={() => update((x) => ({ ...x, proposals: x.proposals.map((q) => (q.id === p.id ? { ...q, revealed: true } : q)) }))} />}
              {canManage && <Button label="Delete" kind="danger" small onPress={() => update((x) => ({ ...x, proposals: x.proposals.filter((q) => q.id !== p.id) }))} />}
            </Row>
          </Card>
        );
      })}
    </View>
  );
}
