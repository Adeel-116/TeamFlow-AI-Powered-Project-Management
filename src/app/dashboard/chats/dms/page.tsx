'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Check,
  Wifi,
} from 'lucide-react'
import { io } from 'socket.io-client'

// Mock data
interface ChatUser {
  uuid_id: number;
  name: string;
  email: string;
  role: string;
}

interface Message{
  senderId: string, 
  receiverId: any,
  message: string, 
  timestamp: string, 
}

const mockUsers = [
  { uuid_id: '1', name: 'Alex Johnson', email: 'alex@example.com', isOnline: true },
  { uuid_id: '2', name: 'Sarah Chen', email: 'sarah@example.com', isOnline: true },
  { uuid_id: '3', name: 'Mike Davis', email: 'mike@example.com', isOnline: false },
  { uuid_id: '4', name: 'Emma Wilson', email: 'emma@example.com', isOnline: true },
  { uuid_id: '5', name: 'James Brown', email: 'james@example.com', isOnline: false },
]

export default function DirectMessagesPage() {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [chatUser, setChatUser] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser>();
  const [messages, setMessages] = useState<Message[]>([]);
  
  // ✅ USE REF FOR SOCKETS
  const managerSocketRef = useRef<any>(null);
  const hassanSocketRef = useRef<any>(null);
  
  const managerUserID = "0c38628e-10ab-473d-ab17-324596a45346";
  const hassanUserID = "9faaed8d-0953-42ae-b6b9-c0d3d52e4644";

  const getInitials = (name: string | null ) => {
    if (!name) return null;

    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const fetchChatList = async () => {
    try {
      const res = await fetch("/api/chats-users");
      const data = await res.json();
      console.log(data)
      setChatUser(data.users);
    } catch (err) {
      console.error("❌ Failed to load chat list:", err);
    }
  }

  useEffect(() => {
    // ✅ CREATE SOCKETS INSIDE useEffect
    managerSocketRef.current = io("http://localhost:3001");
    hassanSocketRef.current = io("http://localhost:3001");

    // 🧑‍💼 Register Manager
    managerSocketRef.current.on("connect", () => {
      console.log("🧑‍💼 Manager connected:", managerSocketRef.current.id);
      managerSocketRef.current.emit("register", managerUserID);
    });

    // 🧑‍💻 Register Hassan
    hassanSocketRef.current.on("connect", () => {
      console.log("🧑‍💻 Hassan connected:", hassanSocketRef.current.id);
      hassanSocketRef.current.emit("register", hassanUserID);
    });

    // 📨 Listen for messages on both sockets
    managerSocketRef.current.on("receive_message", (data: Message) => {
      console.log("📩 Manager received:", data);
      setMessages((prev) => [...prev, data]);
    });

    hassanSocketRef.current.on("receive_message", (data: Message) => {
      console.log("📨 Hassan received:", data);
      setMessages((prev) => [...prev, data]);
    });

    // 🔄 Fetch initial chat list
    fetchChatList();

    // 🧹 Cleanup sockets on unmount
    return () => {
      console.log("🔌 Disconnecting sockets...");
      if (managerSocketRef.current) {
        managerSocketRef.current.disconnect();
      }
      if (hassanSocketRef.current) {
        hassanSocketRef.current.disconnect();
      }
    };
  }, []); // ✅ Empty dependency array - run once

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      senderId: managerUserID,
      receiverId: hassanUserID,
      message: inputValue,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending message:", newMessage);

    // ✅ Use .current to access socket
    managerSocketRef.current.emit("send_message", newMessage);

    // Add to local message list
    setMessages(prev => [...prev, newMessage]);

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const formatTime = (date: Date | string) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const filteredUsers = chatUser.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentChatMessages = selectedUser 
    ? messages.filter(msg => 
        (msg.senderId === managerUserID && msg.receiverId == selectedUser.uuid_id) ||
        (msg.receiverId === managerUserID && msg.senderId == selectedUser.uuid_id)
      )
    : [];

  return (
    <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium">Connected</span>
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

        <ScrollArea className="flex-1">
          <div className="p-2">
            <AnimatePresence>
              {filteredUsers.map(user => (
                <motion.button
                  key={user.uuid_id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() =>
                    setSelectedUser({
                      uuid_id: user.uuid_id,
                      name: user.name,
                      email: user.email,
                      role: user.role,
                    })
                  }
                  className="w-full text-left p-4 rounded-xl transition-all mb-1 hover:bg-gray-50 hover:cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-lg">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {(selectedUser)? (
        <>
         <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 border-2 border-gray-100">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                {getInitials(selectedUser?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-900 text-lg">
              {selectedUser?.name}
              </h1>
              <p className="text-sm text-gray-500">
                <span className="text-green-600">Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {currentChatMessages.map((msg, index) => {
                const isOwn = msg.senderId === managerUserID
                const showDate = index === 0 ||
                  new Date(currentChatMessages[index - 1].timestamp).toDateString() !==
                  new Date(msg.timestamp).toDateString()

                return (
                  <div key={`${msg.timestamp}-${index}`}>
                    {showDate && (
                      <div className="flex justify-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(msg.timestamp).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwn && (
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs">
                            {getInitials(selectedUser?.name)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${isOwn
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
                            }`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 px-2">
                          <span className="text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                          {isOwn && (
                            <Check className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </AnimatePresence>

            <div className="h-1" />
          </div>
        </ScrollArea>

        <div className="border-t border-gray-200 px-6 py-4 bg-white">
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
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-shrink-0 rounded-full w-12 h-12 shadow-lg disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
        </>  

        ): (
          <>
            <div className="flex flex-col items-center justify-center h-full text-gray-400 select-none">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 rounded-full shadow-lg hover:scale-105 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-14 h-14 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.47-1.03L3 20l1.59-3.42A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-600">
                Select a user to start chat
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Choose a contact from the list and start your conversation 💬
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}