import { Client, IMessage } from '@stomp/stompjs';
import { ChatMessage } from '../../domain/entities/Conversation';

/**
 * Spring Boot exposes STOMP endpoints natively (spring-boot-starter-websocket),
 * so we talk STOMP directly over a plain WebSocket rather than pulling in
 * SockJS (whose XHR-streaming fallback doesn't work in RN's JS environment
 * anyway — RN always has native WebSocket, so the fallback is dead weight).
 */

let client: Client | null = null;
const conversationSubscriptions = new Map<string, () => void>();

function getWsUrl(): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  return base.replace(/^http/, 'ws') + '/ws/chat';
}

function ensureConnected(): Promise<Client> {
  if (client?.connected) return Promise.resolve(client);

  return new Promise((resolve, reject) => {
    client = new Client({
      brokerURL: getWsUrl(),
      reconnectDelay: 4000,
      onConnect: () => resolve(client as Client),
      onStompError: (frame) => reject(new Error(frame.headers.message)),
    });
    client.activate();
  });
}

/**
 * Subscribes to a conversation's message topic. Returns an unsubscribe
 * function — call it from the screen's useEffect cleanup so leaving a
 * chat doesn't leak a subscription.
 */
export async function subscribeToConversation(
  conversationId: string,
  onMessage: (message: ChatMessage) => void,
): Promise<() => void> {
  const c = await ensureConnected();
  const subscription = c.subscribe(`/topic/conversations/${conversationId}`, (frame: IMessage) => {
    onMessage(JSON.parse(frame.body) as ChatMessage);
  });
  const unsubscribe = () => subscription.unsubscribe();
  conversationSubscriptions.set(conversationId, unsubscribe);
  return unsubscribe;
}

export async function publishMessage(conversationId: string, text: string, senderId: string): Promise<void> {
  const c = await ensureConnected();
  c.publish({
    destination: `/app/chat.send/${conversationId}`,
    body: JSON.stringify({ conversationId, text, senderId }),
  });
}

export function disconnectChatSocket(): void {
  client?.deactivate();
  client = null;
  conversationSubscriptions.clear();
}
