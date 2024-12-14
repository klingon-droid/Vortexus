import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';

interface ConnectWalletProps {
  onConnect: () => void;
}

export function ConnectWallet({ onConnect }: ConnectWalletProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-8 right-8 z-50 p-6 bg-black/80 border border-silver/20 rounded-lg shadow-lg backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Wallet className="w-6 h-6 text-white" />
        </motion.div>
        <h3 className="text-white font-medium">Connect Your Wallet</h3>
        <p className="text-gray-300 text-sm text-center max-w-[240px]">
          Connect your Solana wallet to start minting NFTs and managing tokens
        </p>
        <motion.div className="w-full">
          <Button 
            onClick={onConnect} 
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
