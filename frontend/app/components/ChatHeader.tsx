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
      className="border-b backdrop-blur-md"
    >
      <div className="mx-auto p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-gray-200 font-medium">Solana Assistant</h2>
            <p className="text-gray-400 text-sm">Connected to Mainnet</p>
          </div>
        </div>
        {walletAddress && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">{walletAddress}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
