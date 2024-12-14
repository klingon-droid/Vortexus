"use client"

import { useState } from 'react';
import { LandingPage } from '../components/ChatHero';
import { ChatInterface } from '../components/ChatInterface';
import { ConnectWallet } from '../components/ConnectWallet';
import { WalletState } from '../types';

export default function Chat() {
  const [started, setStarted] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
  });

  const handleStart = (message: string) => {
    setInitialMessage(message);
    setStarted(true);
  };

  const handleConnect = () => {
    // Simulate wallet connection
    setWalletState({
      connected: true,
      address: '8xzt...3dj9', // Demo address
    });
  };

  if (!walletState.connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-chat-bg via-indigo/20 to-chat-bg animate-gradient">
        <ConnectWallet onConnect={handleConnect} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-bg via-indigo/20 to-chat-bg animate-gradient">
      {!started ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <ChatInterface initialMessage={initialMessage} walletAddress={walletState.address} />
      )}
    </div>
  );
}