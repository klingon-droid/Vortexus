import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ input, setInput, onSubmit }: ChatInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={onSubmit}
          className="w-full py-4 px-10"
        >
          <div className="relative group">
            {/* Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
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
    </motion.div>
  );
}
