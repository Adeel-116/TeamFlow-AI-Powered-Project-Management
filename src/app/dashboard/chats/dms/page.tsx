'use client'

import { useState, useRef, useEffect } from 'react'
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
  Check
} from 'lucide-react'

// Types
interface User {
  uuid_id: string
  name: string
  email?: string
  avatar?: string
  isOnline?: boolean
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  isRead: boolean
}

export default function DirectMessagesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = '1' // Replace with actual user ID from your auth store

  // Fetch users from API on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chats-users', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) {
        console.error('Failed to fetch users:', response.status)
        return
      }
      
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserClick = async (user: User) => {
    setSelectedUser(user)
    // Here you can fetch messages for this specific user/conversation
    // For now, we'll clear messages when switching users
    setMessages([])
    
    // TODO: Fetch messages for this conversation from your API
    // const response = await fetch(`/api/messages/${user.uuid_id}`)
    // const data = await response.json()
    // setMessages(data.messages)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedUser) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: inputValue,
      timestamp: new Date(),
      isRead: false
    }

    // Optimistically add message to UI
    setMessages([...messages, newMessage])
    setInputValue('')

    // TODO: Send message to your API
    // try {
    //   const response = await fetch('/api/messages', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     credentials: 'include',
    //     body: JSON.stringify({
    //       recipientId: selectedUser.uuid_id,
    //       content: inputValue
    //     })
    //   })
    //   if (!response.ok) throw new Error('Failed to send message')
    // } catch (error) {
    //   console.error('Error sending message:', error)
    // }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const formatTime = (date: Date) => {
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
      {/* Sidebar - Users List */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
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

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <AnimatePresence>
                {filteredUsers.map(user => (
                  <motion.button
                    key={user.uuid_id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => handleUserClick(user)}
                    className={`w-full text-left p-4 rounded-xl transition-all mb-1 ${
                      selectedUser?.uuid_id === user.uuid_id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-lg">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email || 'Click to start chatting'}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-gray-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="font-semibold text-gray-900 text-lg">
                    {selectedUser.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {selectedUser.isOnline ? 'Online' : 'Offline'}
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

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === currentUserId
                      const showDate = index === 0 || 
                        new Date(messages[index - 1].timestamp).toDateString() !== 
                        new Date(message.timestamp).toDateString()

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="flex justify-center my-4">
                              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(message.timestamp).toLocaleDateString('en-US', {
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
                                  {getInitials(selectedUser.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                              <div
                                className={`px-4 py-3 rounded-2xl shadow-sm ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
                                }`}
                              >
                                <p className="text-sm leading-relaxed break-words">
                                  {message.content}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 px-2">
                                <span className="text-xs text-gray-400">
                                  {formatTime(message.timestamp)}
                                </span>
                                {isOwn && (
                                  message.isRead ? (
                                    <CheckCheck className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Check className="w-4 h-4 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )
                    })}
                  </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center gap-3 max-w-4xl mx-auto">
                <Input
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  className="flex-1 rounded-full bg-gray-100 border-0 px-5 h-12 focus:bg-gray-50 transition-colors"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-shrink-0 rounded-full w-12 h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Select a user
              </h3>
              <p className="text-gray-500">
                Choose a user from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}