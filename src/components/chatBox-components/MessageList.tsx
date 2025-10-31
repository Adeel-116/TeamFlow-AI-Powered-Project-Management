"use client"
import { useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MessageBubble } from "./MessageBubble";

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  messageId?: number;
  isRead?: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  selectedUserName: string;
}

export function MessageList({ messages, currentUserId, selectedUserName }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center text-gray-400 py-8">
          No messages yet. Start the conversation! 💬
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="space-y-4 max-w-4xl mx-auto">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUserId;
            const showDate =
              index === 0 ||
              new Date(messages[index - 1].timestamp).toDateString() !==
                new Date(msg.timestamp).toDateString();

            return (
              <div key={`${msg.timestamp}-${index}`}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <MessageBubble
                  message={msg.message}
                  timestamp={msg.timestamp}
                  isOwn={isOwn}
                  isRead={msg.isRead}
                  senderInitials={getInitials(isOwn ? "You" : selectedUserName)}
                />
              </div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}