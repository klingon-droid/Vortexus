import { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Message } from '../types';
import { INITIAL_BOT_MESSAGE, DEMO_RESPONSE } from '../lib/constants';

interface ChatInterfaceProps {
  initialMessage: string;
  walletAddress?: string;
}

export function ChatInterface({ initialMessage, walletAddress }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isBot: false },
    { text: INITIAL_BOT_MESSAGE, isBot: true },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: DEMO_RESPONSE, isBot: true }]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-gray-900"
    >
      {/* Chat Header */}
      <ChatHeader walletAddress={walletAddress} />
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <motion.div layout className="max-w-4xl p-4 mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isBot={message.isBot}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Chat Input */}
      <ChatInput input={input} setInput={setInput} onSubmit={handleSubmit} />
    </motion.div>
  );
}