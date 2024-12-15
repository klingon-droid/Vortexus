export interface Message {
  text: string;
  isBot: boolean;
  markdown?: boolean;
  isError?: boolean;
}

export interface WalletState {
  connected: boolean;
  address?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: string;
  threadId: string | null;
}

export interface ApiResponse {
  response: string;
  output: any;
  threadId: string;
}