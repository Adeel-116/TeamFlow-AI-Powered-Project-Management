"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface UserListItemProps {
  user: {
    uuid_id: string;
    name: string;
    email: string;
    isOnline: boolean
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function UserListItem({ user, isSelected, onSelect }: UserListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl transition-all mb-1 hover:bg-gray-50 ${
        isSelected ? "bg-blue-50 border-2 border-blue-200" : ""
      }`}
    >
      <div className="flex items-center gap-3 relative">
        <div className="relative">
          <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <span 
            className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-sm ${
              user.isOnline ? 'bg-green-500' : 'bg-gray-400'
            }`} 
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
    </motion.button>
  );
}