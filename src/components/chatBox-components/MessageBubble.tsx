"use client";

import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
  senderInitials: string;
}

export function MessageBubble({
  message,
  timestamp,
  isOwn,
  isRead,
  senderInitials,
}: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar for received messages */}
      {!isOwn && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
          {senderInitials}
        </div>
      )}

      {/* Message container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`max-w-xs rounded-2xl px-3 py-2 border shadow-sm ${
          isOwn
            ? "border-gray-200 bg-transparent text-gray-900"
            : "border-gray-200 bg-transparent text-gray-900"
        }`}
      >
        {/* Message Text */}
        <p className="text-sm break-words">{message}</p>

        {/* Timestamp + Tick icons */}
        <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-500">
          <span>{formatTime(timestamp)}</span>

          {isOwn && (
            <>
              {isRead ? (
                <CheckCheck className="w-4 h-4 text-blue-500" />
              ) : (
                <Check className="w-4 h-4 text-gray-400" />
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
