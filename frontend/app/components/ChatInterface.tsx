"use client";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowRight, Plus, Trash2, Menu, X, LogOut, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Connection } from "@solana/web3.js";
import { VersionedTransaction } from "@solana/web3.js";
import { Button } from "@mui/material";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { useRouter } from "next/navigation";

const people = [
  {
    id: 1,
    name: "This is ARCTURUS ◎",
    designation: "Click on + start",
    image: "/linear.png",
  },
];

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
  const { publicKey, sendTransaction, signTransaction, disconnect } = useWallet();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter(); // For navigation

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("chatSessions") || "[]");
    setSessions(storedSessions);
    if (storedSessions.length > 0) {
      setCurrentSessionId(storedSessions[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatSessions", JSON.stringify(sessions));
  }, [sessions]);

  const currentSession = sessions.find((session) => session.id === currentSessionId);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: "Session: New Chat",
      messages: [],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(sessions[0]?.id || null);
    }
  };

  const handleWalletDisconnect = async () => {
    try {
      await disconnect(); // Disconnect the wallet
      toast.success("Wallet disconnected successfully.");
      router.push("/"); // Redirect to the homepage
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast.error("Failed to disconnect the wallet.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentSessionId) return;

    const userMessage: Message = { text: input, isBot: false };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              name: session.messages.length === 0 ? input : session.name,
              messages: [...session.messages, userMessage],
            }
          : session
      )
    );
    setInput(""); // Clear input field

    try {
      const botResponse = await sendMessageToAPI(input);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: [
                  ...session.messages,
                  { text: botResponse, isBot: true },
                ],
              }
            : session
        )
      );
    } catch (error: any) {
      console.error("Error during handleSubmit:", error.message);
      toast.error("Failed to process your request.");
    }
  };

  const sendMessageToAPI = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://solana-agent.onrender.com/prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          walletAddress: publicKey ? publicKey.toBase58() : null,
        }),
      });

      const data = await response.json();

      if (data.output) {
        let outputData;

        try {
          outputData = JSON.parse(data.output);
        } catch {
          return data.output;
        }

        if (outputData && outputData.success && outputData.transaction) {
          const transactionBuffer = Buffer.from(outputData.transaction, "base64");
          const versionedTransaction = VersionedTransaction.deserialize(transactionBuffer);

          if (!publicKey) {
            toast.error("Wallet not connected. Please connect your wallet.");
            return "Wallet not connected.";
          }

          if (!signTransaction) {
            toast.error("Your wallet does not support signing transactions.");
            return "Wallet does not support signing transactions.";
          }

          toast.info("Please sign the transaction in your wallet.");
          const signedTransaction = await signTransaction(versionedTransaction);
          const connection = new Connection(
            `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
            "confirmed"
          );

          const txid = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          toast.success(`Transaction sent successfully! TXID: ${txid}`);
          return `Transaction sent successfully! TXID: ${txid}`;
        }
      }

      return data.response || "Received an empty response.";
    } catch (error: any) {
      console.error("API Error:", error.message);
      toast.error(`Error: ${error.message}`);
      return `Error: ${error.message}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen text-white">
      <ToastContainer />
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center backdrop-blur-lg z-0"></div>
      <div className="relative flex z-10 h-full w-full">
        {isSidebarOpen && (
          <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <AnimatedTooltip items={people} />
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
                    session.id === currentSessionId
                      ? "bg-indigo-600"
                      : "hover:bg-gray-700"
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
        <div
          className={`flex-1 flex flex-col ${isSidebarOpen ? "pl-0" : "pl-4"}`}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-700 bg-black/30">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="bg-gray-800 p-2 rounded hover:bg-gray-700"
              >
                {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
              <Button
                href="/"
                color="secondary"
                variant="contained"
                className="py-1 bg-gray-500 text-white rounded-lg hover:bg-indigo-700"
              >
                <Home />
              </Button>
            </div>
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
              <button
                onClick={handleWalletDisconnect}
                className="bg-red-600 p-2 rounded hover:bg-red-700 flex items-center"
              >
                <LogOut className="mr-2" />
                Disconnect
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentSession?.messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg break-words w-fit max-w-full sm:max-w-md ${
                  msg.isBot
                    ? "bg-gray-700 text-gray-200"
                    : "bg-indigo-600 text-white ml-auto"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
            {loading && (
              <p className="text-gray-400">ARCTURUS ◎ is Typing...</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-800 p-2 rounded text-gray-200 placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 p-2 rounded hover:bg-indigo-700"
                disabled={!currentSessionId || loading}
              >
                <ArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
