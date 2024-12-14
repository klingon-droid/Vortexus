export interface Message {
    text: string;
    isBot: boolean;
  }
  
  export interface WalletState {
    connected: boolean;
    address?: string;
  }