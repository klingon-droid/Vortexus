"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Button from '@mui/material/Button';

export function ConnectWallet() {
  const { setVisible } = useWalletModal();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-8 right-8 z-50 p-6 bg-gray-900/90 border border-gray-700 rounded-xl shadow-2xl backdrop-blur-lg"
    >
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Wallet className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-white font-semibold text-lg">Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm text-center max-w-[240px]">
          Connect your Solana wallet to interact with the chat assistant.
        </p>
        <Button
          onClick={() => setVisible(true)}
          color="secondary"
          variant="contained" // Open wallet modal
          className="w-full bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Connect Wallet
        </Button>
      </div>
    </motion.div>
  );
}
