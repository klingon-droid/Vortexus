import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "../lib/utils";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(({ message, isBot = false }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg shadow-md",
        isBot ? "bg-gray-700/70 text-gray-200" : "bg-indigo-600/90 text-white"
      )}
    >
      <div className="flex-shrink-0">
        {isBot ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gray-400" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 leading-relaxed text-sm">{message}</div>
    </motion.div>
  );
});

ChatMessage.displayName = "ChatMessage";

export { ChatMessage };
