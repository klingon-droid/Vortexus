"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction , VersionedTransaction } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Plus, Trash2, Menu, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
}

export function ChatInterface() {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
    setSessions(storedSessions);
    if (storedSessions.length > 0) setCurrentSessionId(storedSessions[0].id);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: "New Chat",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    if (currentSessionId === id) setCurrentSessionId(sessions[0]?.id || null);
  };

  const sendMessageToAPI = async (message: string) => {
    setLoading(true);
    try {
      if (!publicKey) {
        toast.error("Please connect your wallet before sending a message.");
        return "Wallet not connected.";
      }
  
      const response = await fetch("https://solana-agent.onrender.com/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          walletAddress: publicKey.toBase58(),
        }),
      });
  
      const data = await response.json();
  
      if (data.output && data.output.transaction) {
        const transactionBase64 = data.output.transaction;
  
        if (!transactionBase64) throw new Error("No transaction data received from API.");
  
        // Decode the base64 transaction
        const buffer = Buffer.from(transactionBase64, "base64");
        let transaction;
  
        try {
          // Try as VersionedTransaction
          transaction = VersionedTransaction.deserialize(buffer);
        } catch {
          // Fallback to legacy Transaction
          transaction = Transaction.from(buffer);
        }
  
        console.log("Decoded transaction:", transaction);
  
        if (!signTransaction) {
          throw new Error("Wallet does not support signing transactions.");
        }
  
        // Sign the transaction
        const signedTransaction = await signTransaction(transaction);
        console.log("Signed transaction:", signedTransaction);
  
        // Send the transaction
        const txid = await sendTransaction(signedTransaction, [], {
          skipPreflight: false,
          preflightCommitment: "confirmed",
        });
  
        console.log("Transaction ID:", txid);
        toast.success(`Transaction successful! TXID: ${txid}`);
        return "Transaction successful!";
      }
  
      return data?.response || "No response from server.";
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Error processing request: " + error.message);
      return "Error: Unable to process request.";
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSessionId) return;

    const userMessage: Message = { text: input, isBot: false };
    const botResponse = await sendMessageToAPI(input);

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              name: session.messages.length === 0 ? input : session.name,
              messages: [...session.messages, userMessage, { text: botResponse, isBot: true }],
            }
          : session
      )
    );

    setInput("");
  };

  return (
    <div className="relative flex h-screen text-white">
      <Toaster />
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center backdrop-blur-lg z-0"></div>

      <div className="relative flex z-10 h-full w-full">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <button
                onClick={createNewSession}
                className="bg-indigo-600 p-2 rounded hover:bg-indigo-700"
              >
                <Plus />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`p-2 cursor-pointer flex justify-between items-center ${
                    session.id === currentSessionId ? "bg-indigo-600" : "hover:bg-gray-700"
                  }`}
                >
                  <span className="truncate">{session.name}</span>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Chat Window */}
        <div className={`flex-1 flex flex-col ${isSidebarOpen ? "pl-0" : "pl-4"}`}>
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-black/30">
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="bg-gray-800 p-2 rounded hover:bg-gray-700"
            >
              {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-4">
              <Wallet className="text-indigo-400" />
              <div>
                <h1 className="text-lg font-semibold">
                  {currentSession ? currentSession.name : "No Chat Selected"}
                </h1>
                <p className="text-sm text-gray-400">
                  Wallet: {publicKey ? publicKey.toBase58() : "Not connected"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentSession?.messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg max-w-md ${
                  msg.isBot
                    ? "bg-gray-700 text-gray-200"
                    : "bg-indigo-600 text-white ml-auto"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
            {loading && <p className="text-gray-400">Typing...</p>}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 flex gap-2 border-t border-gray-700 bg-black/30"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 border border-gray-700 text-white"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-indigo-600 p-2 rounded hover:bg-indigo-700 flex items-center"
            >
              <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
