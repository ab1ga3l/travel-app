// Chat with Aviora (runs on the web app's /api/chat).
import { useRef, useState } from "react";
import { FlatList, type FlatListInstance, KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Chip, H1, Hi, Muted, Note, Row } from "@/components/ui";
import { useApp } from "@/lib/store";
import { API_URL } from "@/lib/supabase";
import { APP } from "@/shared/site";
import { nameOf } from "@/shared/world";
import { FONT, R, useTheme } from "@/theme";

type Msg = { role: "user" | "assistant"; content: string };

export default function Ask() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const nick = profile?.assistantNickname || APP.assistant;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<FlatListInstance>(null);
  const starters = profile ? [`Where can I go visa-free with my ${nameOf(profile.passport)} passport next month?`, "Plan 5 days for my vibe", "What do I need for a Schengen visa?"] : [];

  const send = async (q: string) => {
    if (!q.trim() || busy) return;
    const next = [...msgs, { role: "user" as const, content: q.trim() }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch(`${API_URL}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, profile: profile ? { name: profile.name, passport: profile.passport, home: profile.home, vibes: profile.vibes, interests: profile.interests, budget: profile.budget, company: profile.company, pace: profile.pace, assistantStyle: profile.assistantStyle, assistantNickname: profile.assistantNickname } : undefined }) });
      const j = await r.json();
      setMsgs([...next, { role: "assistant", content: r.ok ? j.reply : j.error ?? "Something went wrong. Try again." }]);
    } catch { setMsgs([...next, { role: "assistant", content: "I couldn't connect. Check your internet and try again." }]); }
    finally { setBusy(false); setTimeout(() => list.current?.scrollToEnd({ animated: true }), 100); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
      <FlatList ref={list} data={msgs} keyExtractor={(_, i) => String(i)} contentContainerStyle={{ padding: 18, gap: 10 }}
        ListHeaderComponent={<View style={{ gap: 12, marginBottom: 6 }}>
          <H1>Ask <Hi>{nick}</Hi></H1>
          <Muted>Visas, budgets, where to go, what to do. {nick} knows your passport and your vibe.</Muted>
          {!API_URL && <Note>{nick} switches on when the app is connected to the server (EXPO_PUBLIC_API_URL).</Note>}
          {msgs.length === 0 && <Row gap={6} wrap>{starters.map((s) => <Chip key={s} label={s} onPress={() => send(s)} />)}</Row>}
        </View>}
        renderItem={({ item }) => (
          <View style={{ alignSelf: item.role === "user" ? "flex-end" : "flex-start", maxWidth: "88%", backgroundColor: item.role === "user" ? t.brand : t.surface, borderRadius: 18, borderBottomRightRadius: item.role === "user" ? 6 : 18, borderBottomLeftRadius: item.role === "user" ? 18 : 6, padding: 12, borderWidth: item.role === "user" ? 0 : 1, borderColor: t.line }}>
            <Text style={{ fontFamily: FONT.body, fontSize: 15, lineHeight: 21, color: item.role === "user" ? t.onBrand : t.ink }}>{item.content}</Text>
          </View>
        )}
        ListFooterComponent={busy ? <Muted>{nick} is thinking…</Muted> : undefined} />
      <View style={{ flexDirection: "row", gap: 8, padding: 12, paddingBottom: insets.bottom + 12, borderTopWidth: 1, borderTopColor: t.line, backgroundColor: t.bg }}>
        <TextInput value={text} onChangeText={setText} placeholder={`Message ${nick}`} placeholderTextColor={t.muted} multiline maxLength={2000}
          style={{ flex: 1, maxHeight: 120, backgroundColor: t.surface2, borderRadius: R.md, borderWidth: 1, borderColor: t.line, color: t.ink, fontFamily: FONT.body, fontSize: 15.5, paddingHorizontal: 14, paddingVertical: 10 }} />
        <Button label="Send" disabled={!text.trim() || !API_URL} busy={busy} onPress={() => send(text)} style={{ alignSelf: "flex-end" }} />
      </View>
      <Muted style={{ fontSize: 11, textAlign: "center", paddingBottom: 4 }}>AI can make mistakes. Confirm visa rules on official sites.</Muted>
    </KeyboardAvoidingView>
  );
}
