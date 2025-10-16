'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Send,
  Smile,
  Paperclip,
  Search,
  MessageCircle,
  Clock,
  MoreVertical,
  ChevronDown,
  Phone,
  Video,
  Info
} from 'lucide-react'

// Mock Data
const USERS = [
  { id: '1', name: 'Sarah Johnson', role: 'Project Lead', avatar: 'SJ', color: 'bg-blue-100' },
  { id: '2', name: 'Mike Chen', role: 'Developer', avatar: 'MC', color: 'bg-green-100' },
  { id: '3', name: 'Emily Davis', role: 'Designer', avatar: 'ED', color: 'bg-purple-100' },
  { id: '4', name: 'David Kim', role: 'Developer', avatar: 'DK', color: 'bg-orange-100' }
]

const DM_USERS = USERS.filter(u => u.id !== '1')

const DM_MESSAGES = [
  {
    id: '1',
    dmId: 'dm-1-2',
    senderId: '1',
    content: 'Hey Mike! Can you review the latest API implementation?',
    timestamp: new Date(Date.now() - 7200000),
    reactions: { '👍': ['2'] }
  },
  {
    id: '2',
    dmId: 'dm-1-2',
    senderId: '2',
    content: 'Sure! I\'ll check it out this morning.',
    timestamp: new Date(Date.now() - 6900000),
    reactions: {}
  },
  {
    id: '3',
    dmId: 'dm-1-2',
    senderId: '2',
    content: 'Looks great! Just a few optimization suggestions.',
    timestamp: new Date(Date.now() - 6600000),
    reactions: { '🔥': ['1'] }
  },
  {
    id: '4',
    dmId: 'dm-1-2',
    senderId: '1',
    content: 'Thanks for the feedback! I\'ll implement those changes.',
    timestamp: new Date(Date.now() - 6300000),
    reactions: { '✨': ['2'] }
  },
  {
    id: '5',
    dmId: 'dm-1-3',
    senderId: '1',
    content: 'Hi Emily! The landing page mockups are looking amazing!',
    timestamp: new Date(Date.now() - 5400000),
    reactions: { '❤️': ['3'] }
  },
  {
    id: '6',
    dmId: 'dm-1-3',
    senderId: '3',
    content: 'Thanks! I incorporated your feedback from yesterday.',
    timestamp: new Date(Date.now() - 5100000),
    reactions: {}
  },
  {
    id: '7',
    dmId: 'dm-1-3',
    senderId: '3',
    content: 'Should we do a design sync meeting this week?',
    timestamp: new Date(Date.now() - 4800000),
    reactions: {}
  },
  {
    id: '8',
    dmId: 'dm-1-3',
    senderId: '1',
    content: 'Absolutely! How about Wednesday at 2 PM?',
    timestamp: new Date(Date.now() - 4500000),
    reactions: { '👍': ['3'] }
  },
  {
    id: '9',
    dmId: 'dm-1-4',
    senderId: '4',
    content: 'Sarah, database optimization is complete!',
    timestamp: new Date(Date.now() - 3600000),
    reactions: { '🎉': ['1'] }
  },
  {
    id: '10',
    dmId: 'dm-1-4',
    senderId: '1',
    content: 'Excellent work! What were the performance improvements?',
    timestamp: new Date(Date.now() - 3300000),
    reactions: {}
  },
  {
    id: '11',
    dmId: 'dm-1-4',
    senderId: '4',
    content: 'Query response time improved by 45%. Ready for production!',
    timestamp: new Date(Date.now() - 3000000),
    reactions: { '🚀': ['1'] }
  }
]

const EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '🎉', '🚀', '✨']

interface Message {
  id: string
  dmId: string
  senderId: string
  content: string
  timestamp: Date
  reactions: Record<string, string[]>
}

interface DMUser {
  id: string
  name: string
  role: string
  avatar: string
  color: string
}

function DMListItem({
  user,
  lastMessage,
  unreadCount,
  isSelected,
  onClick
}: {
  user: DMUser
  lastMessage: Message | undefined
  unreadCount: number
  isSelected: boolean
  onClick: () => void
}) {
  const sender = lastMessage
    ? USERS.find(u => u.id === lastMessage.senderId)
    : null

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const isOnline = Math.random() > 0.3

  return (
    <motion.button
      className={`w-full text-left p-3 rounded-lg transition-all ${
        isSelected
          ? 'bg-gray-100'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12">
            <AvatarFallback className={`text-sm font-semibold ${user.color}`}>
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {lastMessage ? formatTime(lastMessage.timestamp) : ''}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-1">{user.role}</p>
          <p className="text-sm text-gray-600 w-55 truncate">
            {sender?.id === '1' ? 'You' : sender?.name}:{' '}
            {lastMessage?.content || 'No messages'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Badge  variant="destructive" className="absolute right-3">
            {unreadCount}
          </Badge>
        )}
      </div>
    </motion.button>
  )
}

function MessageItem({
  message,
  currentUserId,
  onAddReaction,
  isLastMessage
}: {
  message: Message
  currentUserId: string
  onAddReaction: (messageId: string, emoji: string) => void
  isLastMessage: boolean
}) {
  const sender = USERS.find(u => u.id === message.senderId)
  const isOwn = message.senderId === currentUserId

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      {!isOwn && (
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarFallback className={`text-xs font-semibold ${sender?.color}`}>
            {sender?.avatar}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isOwn && (
          <span className="text-xs text-gray-500 px-2">{sender?.name}</span>
        )}

        <div
          className={`px-3 py-2 rounded-lg ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm break-words">{message.content}</p>
        </div>

        <span className={`text-xs px-2 ${
          isLastMessage 
            ? 'text-blue-600 font-semibold' 
            : 'text-gray-400'
        }`}>
          {formatMessageTime(message.timestamp)}
        </span>

        {Object.keys(message.reactions).length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex gap-1 px-2 flex-wrap"
          >
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onAddReaction(message.id, emoji)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
              >
                <span>{emoji}</span>
                <span className="text-gray-600 text-xs">{users.length}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {!isOwn && (
        <Popover>
          <PopoverTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="opacity-0 w-6 h-6 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full transition-all duration-200 flex-shrink-0"
            >
              <Smile className="w-3 h-3" />
            </motion.button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onAddReaction(message.id, emoji)}
                  className="text-xl hover:scale-125 transition-transform duration-200 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </motion.div>
  )
}

export default function DirectMessagesPage() {
  const [selectedDM, setSelectedDM] = useState<string>('dm-1-2')
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>(DM_MESSAGES)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = '1'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getSelectedUserId = () => {
    const match = selectedDM.match(/dm-1-(\d)/)
    return match ? match[1] : '2'
  }

  const selectedUser = DM_USERS.find(u => u.id === getSelectedUserId())
  const dmMessages = messages.filter(m => m.dmId === selectedDM)

  const getLastMessage = (userId: string) => {
    const dmId = `dm-1-${userId}`
    const msgs = messages.filter(m => m.dmId === dmId)
    return msgs.length > 0 ? msgs[msgs.length - 1] : undefined
  }

  const getUnreadCount = (userId: string) => {
    const unreadMap: Record<string, number> = { '3': 2, '4': 1 }
    return unreadMap[userId] || 0
  }

  const filteredUsers = DM_USERS.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: String(Date.now()),
        dmId: selectedDM,
        senderId: currentUserId,
        content: inputValue,
        timestamp: new Date(),
        reactions: {}
      }
      setMessages([...messages, newMessage])
      setInputValue('')
    }
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions }
          if (!reactions[emoji]) {
            reactions[emoji] = []
          }
          if (!reactions[emoji].includes(currentUserId)) {
            reactions[emoji].push(currentUserId)
          }
          return { ...msg, reactions }
        }
        return msg
      })
    )
  }

  const handleAttachFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e: any) => {
      const file = e.target.files?.[0]
      if (file) {
        setInputValue(inputValue + ` [${file.name}]`)
      }
    }
    input.click()
  }

  return (
    <div className="flex h-[calc(100dvh-133px)] 2xl:w-[calc(100vw-300px)] lg:w-[calc(100vw-200px)] w-full  overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className="w-90 border-r border-gray-200 bg-white rounded-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-full bg-gray-100 border-0"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <AnimatePresence>
              {filteredUsers.map(user => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <DMListItem
                    user={user}
                    lastMessage={getLastMessage(user.id)}
                    unreadCount={getUnreadCount(user.id)}
                    isSelected={selectedDM === `dm-1-${user.id}`}
                    onClick={() => setSelectedDM(`dm-1-${user.id}`)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="w-full flex flex-col">
        {/* Chat Header */}
        <div className="h-16 border-b border-gray-200 bg-white rounded-tr-2xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 w-90">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={`text-sm font-semibold ${selectedUser?.color}`}>
                {selectedUser?.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-900">{selectedUser?.name}</h1>
              <p className="text-xs text-gray-500">{selectedUser?.role}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="text-gray-500 hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Phone className="w-4 h-4" />
                <span>Start Call</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Video className="w-4 h-4" />
                <span>Start Video Call</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Info className="w-4 h-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
                <span>Clear Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="space-y-4 flex flex-col">
            <AnimatePresence>
              {dmMessages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={currentUserId}
                  onAddReaction={handleAddReaction}
                  isLastMessage={index === dmMessages.length - 1}
                />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="h-20 border-t border-gray-200 px-6 py-4 flex items-center gap-3 bg-white">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="text-gray-600 flex-shrink-0">
                <Smile className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setInputValue(inputValue + emoji)}
                    className="text-2xl hover:scale-125 transition-transform duration-200 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            onClick={handleAttachFile}
            size="icon" 
            variant="ghost" 
            className="text-gray-600 flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 rounded-full bg-gray-100 border-0 px-4"
          />

          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}