"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

interface ChatHeaderProps {
  walletAddress?: string;
}

export function ChatHeader({ walletAddress }: ChatHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="border-b backdrop-blur-lg bg-black/50"
    >
      <div className="mx-auto p-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-gray-100 font-semibold text-lg tracking-wide">
              Solana Assistant
            </h2>
            <p className="text-gray-400 text-xs">Connected to Mainnet</p>
          </div>
        </div>

        {/* Wallet Status */}
        {walletAddress ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-mono">
              {walletAddress}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Wallet not connected</span>
        )}
      </div>
    </motion.div>
  );
}
