"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface LandingPageProps {
  onStart: (message: string) => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onStart(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Optional Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Heading */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-8 text-center"
        >
          Ask Arcturus Anything
        </motion.h1>

        {/* Form */}
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl"
        >
          <div className="relative group">
            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here to take you to arcturus..."
              className="w-full bg-white/10 text-white placeholder-indigo-300 rounded-full px-6 py-4 pr-12 border border-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {/* Submit Button */}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.form>

        {/* Subtext */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-indigo-200 text-center"
        >
          <p>Ask about minting NFTs, deploying tokens, or checking your balance</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
