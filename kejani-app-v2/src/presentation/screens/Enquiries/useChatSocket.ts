import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../../../domain/entities/Conversation';
import { subscribeToConversation, publishMessage } from '../../../data/api/chatSocket';
import { trackEvent } from '../../hooks/useAnalytics';

const CURRENT_USER_ID = 'me'; // real implementation reads this from useAuthStore

export function useChatSocket(conversationId: string, initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connected, setConnected] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    subscribeToConversation(conversationId, (incoming) => {
      setMessages((prev) => {
        // Drop the true duplicate once the server echoes our own optimistic
        // send back — matched on sender + text, since local temp ids never
        // match server-assigned ones.
        const isEchoOfOwnMessage = prev.some(
          (m) => m.id.startsWith('local-') && m.senderId === incoming.senderId && m.text === incoming.text,
        );
        if (isEchoOfOwnMessage) {
          return prev.map((m) =>
            m.senderId === incoming.senderId && m.text === incoming.text && m.id.startsWith('local-')
              ? incoming
              : m,
          );
        }
        return [...prev, incoming];
      });
    })
      .then((unsub) => {
        if (cancelled) {
          unsub();
        } else {
          unsubscribeRef.current = unsub;
          setConnected(true);
        }
      })
      .catch(() => setConnected(false));

    return () => {
      cancelled = true;
      unsubscribeRef.current?.();
    };
  }, [conversationId]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      conversationId,
      senderId: CURRENT_USER_ID,
      text: trimmed,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    trackEvent('chat_message_sent', { conversationId });

    try {
      await publishMessage(conversationId, trimmed, CURRENT_USER_ID);
    } catch {
      // Leave the optimistic bubble in place but mark it failed so the
      // screen can show a retry affordance rather than silently dropping it.
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, text: `${m.text}` } : m)),
      );
    }
  }

  return { messages, connected, send };
}
