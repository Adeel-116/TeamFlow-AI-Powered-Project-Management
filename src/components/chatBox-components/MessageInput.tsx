"use client"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 bg-white">
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        <Input
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 rounded-full bg-gray-100 border-0 px-5 h-12 focus:bg-gray-50 transition-colors"
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-shrink-0 rounded-full w-12 h-12 shadow-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}