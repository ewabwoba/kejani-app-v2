export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  sentAt: string; // ISO timestamp
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingRentKsh: number;
  otherParty: { id: string; name: string; verified: boolean; online: boolean };
  lastMessage?: ChatMessage;
}
