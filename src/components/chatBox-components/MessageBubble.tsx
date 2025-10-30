"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  senderInitials: string;
}

export function MessageBubble({ message, timestamp, isOwn, senderInitials }: MessageBubbleProps) {
  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {!isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs">
            {senderInitials}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-md ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
          }`}
        >
          <p className="text-sm leading-relaxed break-words">{message}</p>
        </div>

        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
          {isOwn && <Check className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
    </motion.div>
)}