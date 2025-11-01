"use client"
import React, {useState} from "react";
import { Input } from "@/components/ui/input";
import { Search, Wifi, WifiOff } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { UserListItem } from "./UserListItem";

interface ChatSidebarProps {
  users: Array<{
    uuid_id: string;
    name: string;
    email: string;
    role: string;
  }>;
  selectedUserId: string | null;
  onSelectUser: (user: any) => void;
  isConnected: boolean;
  currentUserId: string | null;
}

export function ChatSidebar({ 
  users, 
  selectedUserId, 
  onSelectUser, 
  isConnected,
  currentUserId 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <div className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span className="text-xs font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
    
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* User List - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <AnimatePresence>
            {filteredUsers.map((user) => (
              <UserListItem
                key={user.uuid_id}
                user={user}
                isSelected={selectedUserId === user.uuid_id}
                onSelect={() => onSelectUser(user)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}