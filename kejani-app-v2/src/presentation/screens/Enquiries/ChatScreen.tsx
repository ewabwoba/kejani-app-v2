import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatSocket } from './useChatSocket';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { EnquiriesStackParamList } from '../../navigation/MainTabs';

type Props = NativeStackScreenProps<EnquiriesStackParamList, 'Chat'>;

const CURRENT_USER_ID = 'me';

export function ChatScreen({ route }: Props) {
  const { conversation } = route.params;
  const { messages, connected, send } = useChatSocket(conversation.id, route.params.initialMessages ?? []);
  const [draft, setDraft] = useState('');

  function handleSend() {
    if (!draft.trim()) return;
    send(draft);
    setDraft('');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerName}>{conversation.otherParty.name}</Text>
        {conversation.otherParty.verified && <VerifiedBadge compact />}
        <View style={[styles.statusDot, { backgroundColor: connected ? color.mpesaGreen : color.inkMuted }]} />
      </View>
      <View style={styles.listingStrip}>
        <Text style={styles.listingTitle} numberOfLines={1}>{conversation.listingTitle}</Text>
        <Text style={styles.listingPrice}>Ksh {conversation.listingRentKsh.toLocaleString()}/mo</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing(4) }}
          renderItem={({ item }) => {
            const mine = item.senderId === CURRENT_USER_ID;
            return (
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={mine ? styles.bubbleTextMine : styles.bubbleTextTheirs}>{item.text}</Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message"
            placeholderTextColor={color.inkMuted}
            style={styles.input}
            multiline
          />
          <Pressable onPress={handleSend} style={styles.sendButton} accessibilityLabel="Send message">
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: spacing(4), paddingBottom: spacing(2) },
  headerName: { fontFamily: font.bodyMedium, fontSize: 16, color: color.ink },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 'auto' },
  listingStrip: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: color.white, borderBottomWidth: 1, borderBottomColor: color.border, paddingHorizontal: spacing(4), paddingVertical: spacing(2) },
  listingTitle: { fontFamily: font.body, fontSize: 12, color: color.ink, flexShrink: 1 },
  listingPrice: { fontFamily: font.data, fontSize: 12, color: color.msitu700 },
  bubble: { maxWidth: '78%', borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8, marginBottom: spacing(2) },
  bubbleMine: { backgroundColor: color.msitu700, alignSelf: 'flex-end' },
  bubbleTheirs: { backgroundColor: color.white, alignSelf: 'flex-start', borderWidth: 1, borderColor: color.border },
  bubbleTextMine: { color: color.white, fontFamily: font.body, fontSize: 13 },
  bubbleTextTheirs: { color: color.ink, fontFamily: font.body, fontSize: 13 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: spacing(3), borderTopWidth: 1, borderTopColor: color.border, backgroundColor: color.parchment },
  input: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: color.white, borderWidth: 1, borderColor: color.border, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 8, fontFamily: font.body, fontSize: 13, color: color.ink },
  sendButton: { backgroundColor: color.sisal600, borderRadius: radius.md, paddingHorizontal: 16, height: 40, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: color.white, fontFamily: font.bodyMedium, fontSize: 13 },
});
