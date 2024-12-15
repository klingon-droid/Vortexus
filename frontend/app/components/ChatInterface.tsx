"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  initialMessage: string;
}

interface Message {
  text: string;
  isBot: boolean;
}

export function ChatInterface({ initialMessage }: ChatInterfaceProps) {
  const { publicKey } = useWallet(); // Get wallet public key
  const [messages, setMessages] = useState<Message[]>([
    { text: initialMessage, isBot: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null); // To store threadId

  // Function to send a message to the API
  const sendMessageToAPI = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://solana-agent.onrender.com/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          threadId: threadId,
          walletAddress: publicKey ? publicKey.toBase58() : null,
        }),
      });

      const data = await response.json();

      if (data?.response) {
        // Add bot response to messages
        setMessages((prev) => [
          ...prev,
          { text: data.response, isBot: true },
        ]);

        // Update threadId if provided
        if (data.threadId) {
          setThreadId(data.threadId);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "Error: Invalid response from server.", isBot: true },
        ]);
      }
    } catch (error) {
      console.error("Error sending message to API:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error: Unable to reach server.", isBot: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setInput("");

    sendMessageToAPI(userMessage); // Call the API with the user's input
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800 bg-black/30">
        <div className="flex items-center gap-4">
          <Wallet className="text-indigo-400" />
          <div>
            <h1 className="text-lg font-semibold">Solana Assistant</h1>
            <p className="text-sm text-gray-400">
              Connected Wallet:{" "}
              {publicKey ? publicKey.toBase58() : "Wallet not connected"}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg max-w-md ${
                msg.isBot
                  ? "bg-gray-700 text-gray-200"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {/* Render markdown for bot responses */}
              {msg.isBot ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </motion.div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="p-3 rounded-lg bg-gray-700 text-gray-200"
            >
              Typing...
            </motion.div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-800 p-2 rounded text-gray-200 placeholder-gray-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 p-2 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            <ArrowRight />
          </button>
        </div>
      </form>
    </div>
  );
}
