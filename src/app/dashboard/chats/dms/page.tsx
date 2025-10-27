// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'
// import { ScrollArea } from '@/components/ui/scroll-area'
// // import { Alert, AlertDescription } from '@/components/ui/alert'
// import {
//   Send,
//   Search,
//   MoreVertical,
//   Phone,
//   Video,
//   CheckCheck,
//   Check,
//   Wifi,
//   WifiOff
// } from 'lucide-react'
// import { initializeSocket, getSocket, disconnectSocket, sendMessage, startTyping, stopTyping } from '@/lib/socket_client'

// // Types
// interface User {
//   uuid_id: string
//   name: string
//   email?: string
//   avatar?: string
//   isOnline?: boolean
// }

// interface Message {
//   id: string
//   senderId: string
//   content: string
//   timestamp: Date
//   isRead: boolean
//   status?: 'sending' | 'delivered' | 'failed'
// }

// export default function DirectMessagesPage() {
//   const [users, setUsers] = useState<User[]>([])
//   const [selectedUser, setSelectedUser] = useState<User | null>(null)
//   const [messages, setMessages] = useState<Message[]>([])
//   const [inputValue, setInputValue] = useState('')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSocketConnected, setIsSocketConnected] = useState(false)
//   const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
//   const [conversationId, setConversationId] = useState<string>('')
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const typingTimeoutRef = useRef<NodeJS.Timeout>()
  
//   // Replace with actual user ID from your auth store
//   const currentUserId = '1'
//   // Replace with actual JWT token from your auth store
//   const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkX2lkIjoiMGMzODYyOGUtMTBhYi00NzNkLWFiMTctMzI0NTk2YTQ1MzQ2IiwibmFtZSI6Ik11aGFtbWFkIEFkZWVsIiwiZW1haWwiOiJtYW5hZ2VyQGRpZ2l2ZXhzb2x1dGlvbi5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTc2MTU3MDYxNSwiZXhwIjoxNzYxNTc0MjE1fQ.KXzH6WLrav060W7Fp2uLYABjiWDZvo8Mf7McETDXsSc'

//   // Initialize socket connection
//   useEffect(() => {
//     try {
//       const socket = initializeSocket(jwtToken)
//       setIsSocketConnected(socket.connected)

//       // Socket event listeners
//       socket.on('connect', () => {
//         console.log('✅ Connected to socket server')
//         setIsSocketConnected(true)
//       })

//       socket.on('disconnect', () => {
//         console.log('❌ Disconnected from socket server')
//         setIsSocketConnected(false)
//       })

//       socket.on('user_status', (data: { userId: string; isOnline: boolean }) => {
//         console.log('👤 User status update:', data)
//         setUsers(prev => 
//           prev.map(user => 
//             user.uuid_id === data.userId 
//               ? { ...user, isOnline: data.isOnline }
//               : user
//           )
//         )
//       })

//       socket.on('receive_message', (messageData: any) => {
//         console.log('📨 Received message:', messageData)
//         const newMessage: Message = {
//           id: messageData.id,
//           senderId: messageData.senderId,
//           content: messageData.content,
//           timestamp: new Date(messageData.timestamp),
//           isRead: messageData.isRead,
//           status: 'delivered'
//         }
//         setMessages(prev => [...prev, newMessage])
//       })

//       socket.on('message_sent', (data: any) => {
//         console.log('✅ Message sent confirmation:', data)
//         setMessages(prev => 
//           prev.map(msg => 
//             msg.id === data.id 
//               ? { ...msg, status: data.status }
//               : msg
//           )
//         )
//       })

//       socket.on('message_error', (data: any) => {
//         console.error('❌ Message error:', data)
//       })

//       socket.on('user_typing', (data: { userId: string; conversationId: string; isTyping: boolean }) => {
//         console.log('⌨️ Typing indicator:', data)
//         if (data.conversationId === conversationId) {
//           setTypingUsers(prev => {
//             const updated = new Set(prev)
//             if (data.isTyping) {
//               updated.add(data.userId)
//             } else {
//               updated.delete(data.userId)
//             }
//             return updated
//           })
//         }
//       })

//       return () => {
//         disconnectSocket()
//       }
//     } catch (error) {
//       console.error('Failed to initialize socket:', error)
//     }
//   }, [jwtToken])

//   // Fetch users from API on mount
//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const fetchUsers = async () => {
//     try {
//       setIsLoading(true)
//       const response = await fetch('/api/chats-users', {
//         method: 'GET',
//         credentials: 'include'
//       })
      
//       if (!response.ok) {
//         console.error('Failed to fetch users:', response.status)
//         return
//       }
      
//       const data = await response.json()
//       setUsers(data.users || [])
//     } catch (error) {
//       console.error('Error fetching users:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleUserClick = async (user: User) => {
//     setSelectedUser(user)
//     setMessages([])
//     // Generate a simple conversation ID (you should get this from your API)
//     const convId = `conv_${currentUserId}_${user.uuid_id}`
//     setConversationId(convId)
    
//     console.log(`💬 Selected user: ${user.name}, conversation: ${convId}`)
//   }

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || !selectedUser || !isSocketConnected) return

//     const messageId = `msg_${Date.now()}`
//     const newMessage: Message = {
//       id: messageId,
//       senderId: currentUserId,
//       content: inputValue,
//       timestamp: new Date(),
//       isRead: false,
//       status: 'sending'
//     }

//     // Optimistically add message to UI
//     setMessages([...messages, newMessage])
//     setInputValue('')

//     // Stop typing indicator
//     try {
//       stopTyping(selectedUser.uuid_id, conversationId)
//     } catch (error) {
//       console.error('Error stopping typing:', error)
//     }

//     // Send via socket
//     try {
//       sendMessage({
//         conversationId,
//         recipientId: selectedUser.uuid_id,
//         content: newMessage.content
//       })
//       console.log('📤 Message sent via socket:', newMessage.content)
//     } catch (error) {
//       console.error('Error sending message:', error)
//       setMessages(prev => 
//         prev.map(msg => 
//           msg.id === messageId 
//             ? { ...msg, status: 'failed' }
//             : msg
//         )
//       )
//     }
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setInputValue(e.target.value)

//     if (!selectedUser || !isSocketConnected) return

//     // Clear existing timeout
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current)
//     }

//     // Start typing
//     try {
//       startTyping(selectedUser.uuid_id, conversationId)
//     } catch (error) {
//       console.error('Error starting typing:', error)
//     }

//     // Stop typing after 2 seconds of inactivity
//     typingTimeoutRef.current = setTimeout(() => {
//       try {
//         stopTyping(selectedUser.uuid_id, conversationId)
//       } catch (error) {
//         console.error('Error stopping typing:', error)
//       }
//     }, 2000)
//   }

//   const getInitials = (name: string) => {
//     if (!name) return '?'
//     return name
//       .split(' ')
//       .map(word => word.charAt(0).toUpperCase())
//       .slice(0, 2)
//       .join('')
//   }

//   const formatTime = (date: Date) => {
//     const now = new Date()
//     const messageDate = new Date(date)
//     const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

//     if (diffInHours < 24) {
//       return messageDate.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       })
//     } else if (diffInHours < 168) {
//       return messageDate.toLocaleDateString('en-US', { weekday: 'short' })
//     } else {
//       return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//     }
//   }

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   return (
//     <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
//       {/* Sidebar - Users List */}
//       <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
//         {/* Header */}
//         <div className="p-5 border-b border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
//             <div className="flex items-center gap-2">
//               {isSocketConnected ? (
//                 <div className="flex items-center gap-1 text-green-600">
//                   <Wifi className="w-4 h-4" />
//                   <span className="text-xs font-medium">Connected</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1 text-red-600">
//                   <WifiOff className="w-4 h-4" />
//                   <span className="text-xs font-medium">Disconnected</span>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <Input
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-12 h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors"
//             />
//           </div>
//         </div>

//         {/* Users List */}
//         <ScrollArea className="flex-1">
//           <div className="p-2">
//             {isLoading ? (
//               <div className="flex items-center justify-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
//               </div>
//             ) : filteredUsers.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 No users found
//               </div>
//             ) : (
//               <AnimatePresence>
//                 {filteredUsers.map(user => (
//                   <motion.button
//                     key={user.uuid_id}
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     onClick={() => handleUserClick(user)}
//                     className={`w-full text-left p-4 rounded-xl transition-all mb-1 ${
//                       selectedUser?.uuid_id === user.uuid_id
//                         ? 'bg-blue-50 border border-blue-200'
//                         : 'hover:bg-gray-50'
//                     }`}
//                   >
//                     <div className="flex items-center gap-3">
//                       <div className="relative flex-shrink-0">
//                         <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
//                           <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold text-lg">
//                             {getInitials(user.name)}
//                           </AvatarFallback>
//                         </Avatar>
//                         {user.isOnline && (
//                           <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
//                         )}
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-1">
//                           <h3 className="font-semibold text-gray-900 truncate">
//                             {user.name}
//                           </h3>
//                         </div>
//                         <p className="text-sm text-gray-500 truncate">
//                           {user.email || 'Click to start chatting'}
//                         </p>
//                       </div>
//                     </div>
//                   </motion.button>
//                 ))}
//               </AnimatePresence>
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col bg-white">
//         {selectedUser ? (
//           <>
//             {/* Chat Header */}
//             <div className="h-20 border-b border-gray-200 px-6 flex items-center justify-between bg-white shadow-sm">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-12 h-12 border-2 border-gray-100">
//                   <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
//                     {getInitials(selectedUser.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h1 className="font-semibold text-gray-900 text-lg">
//                     {selectedUser.name}
//                   </h1>
//                   <p className="text-sm text-gray-500">
//                     {selectedUser.isOnline ? 'Online' : 'Offline'}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
//                   <Phone className="w-5 h-5" />
//                 </Button>
//                 <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
//                   <Video className="w-5 h-5" />
//                 </Button>
//                 <Button size="icon" variant="ghost" className="text-gray-600 hover:bg-gray-100 rounded-full">
//                   <MoreVertical className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>

//             {/* Connection Alert */}
//             {/* {!isSocketConnected && (
//               <Alert className="m-4 border-orange-200 bg-orange-50">
//                 <WifiOff className="h-4 w-4 text-orange-600" />
//                 <AlertDescription className="text-orange-800">
//                   Connection lost. Trying to reconnect...
//                 </AlertDescription>
//               </Alert>
//             )} */}

//             {/* Messages Area */}
//             <ScrollArea className="flex-1 px-6 py-6 bg-gradient-to-b from-gray-50 to-white">
//               <div className="space-y-4 max-w-4xl mx-auto">
//                 {messages.length === 0 ? (
//                   <div className="flex items-center justify-center h-full">
//                     <div className="text-center text-gray-400">
//                       <p className="text-sm">No messages yet</p>
//                       <p className="text-xs mt-1">Start the conversation!</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <AnimatePresence>
//                     {messages.map((message, index) => {
//                       const isOwn = message.senderId === currentUserId
//                       const showDate = index === 0 || 
//                         new Date(messages[index - 1].timestamp).toDateString() !== 
//                         new Date(message.timestamp).toDateString()

//                       return (
//                         <div key={message.id}>
//                           {showDate && (
//                             <div className="flex justify-center my-4">
//                               <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
//                                 {new Date(message.timestamp).toLocaleDateString('en-US', {
//                                   weekday: 'long',
//                                   month: 'long',
//                                   day: 'numeric'
//                                 })}
//                               </span>
//                             </div>
//                           )}
                          
//                           <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
//                           >
//                             {!isOwn && (
//                               <Avatar className="w-8 h-8 flex-shrink-0">
//                                 <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs">
//                                   {getInitials(selectedUser.name)}
//                                 </AvatarFallback>
//                               </Avatar>
//                             )}

//                             <div className={`max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
//                               <div
//                                 className={`px-4 py-3 rounded-2xl shadow-sm ${
//                                   isOwn
//                                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
//                                     : 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
//                                 }`}
//                               >
//                                 <p className="text-sm leading-relaxed break-words">
//                                   {message.content}
//                                 </p>
//                               </div>

//                               <div className="flex items-center gap-1 px-2">
//                                 <span className="text-xs text-gray-400">
//                                   {formatTime(message.timestamp)}
//                                 </span>
//                                 {isOwn && (
//                                   message.status === 'sending' ? (
//                                     <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
//                                   ) : message.status === 'failed' ? (
//                                     <span className="text-xs text-red-500">Failed</span>
//                                   ) : message.isRead ? (
//                                     <CheckCheck className="w-4 h-4 text-blue-500" />
//                                   ) : (
//                                     <Check className="w-4 h-4 text-gray-400" />
//                                   )
//                                 )}
//                               </div>
//                             </div>
//                           </motion.div>
//                         </div>
//                       )
//                     })}
//                   </AnimatePresence>
//                 )}

//                 {/* Typing Indicator */}
//                 {typingUsers.size > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="flex items-center gap-2"
//                   >
//                     <Avatar className="w-8 h-8 flex-shrink-0">
//                       <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs">
//                         {getInitials(selectedUser.name)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="bg-gray-100 rounded-2xl px-4 py-3">
//                       <div className="flex gap-1">
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 <div ref={messagesEndRef} />
//               </div>
//             </ScrollArea>

//             {/* Input Area */}
//             <div className="border-t border-gray-200 px-6 py-4 bg-white">
//               <div className="flex items-center gap-3 max-w-4xl mx-auto">
//                 <Input
//                   placeholder="Type a message..."
//                   value={inputValue}
//                   onChange={handleInputChange}
//                   onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
//                   disabled={!isSocketConnected}
//                   className="flex-1 rounded-full bg-gray-100 border-0 px-5 h-12 focus:bg-gray-50 transition-colors disabled:opacity-50"
//                 />

//                 <Button
//                   onClick={handleSendMessage}
//                   disabled={!inputValue.trim() || !isSocketConnected}
//                   size="icon"
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex-shrink-0 rounded-full w-12 h-12 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Send className="w-5 h-5" />
//                 </Button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
//             <div className="text-center">
//               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Send className="w-12 h-12 text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                 Select a user
//               </h3>
//               <p className="text-gray-500">
//                 Choose a user from the list to start messaging
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }


















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
  Check,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react'
import { initializeSocket, disconnectSocket, sendMessage, startTyping, stopTyping, markMessagesAsRead } from '@/lib/socket_client'

// Types
interface User {
  uuid_id: string
  name: string
  email?: string
  role?: string
  avatar?: string
  isOnline?: boolean
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  isRead: boolean
  status?: 'sending' | 'delivered' | 'failed'
  tempId?: string
}

export default function DirectMessagesPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [conversationId, setConversationId] = useState<string>('')
  const [currentUser, setCurrentUser] = useState<{ uuid_id: string; name: string; email: string } | null>(null)
  const [jwtToken, setJwtToken] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Get user data and token from cookies on mount
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }

    const token = getCookie('token')
    if (token) {
      setJwtToken(token)
      
      // Decode JWT to get user info
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
        
        const decoded = JSON.parse(jsonPayload)
        setCurrentUser({
          uuid_id: decoded.uuid_id,
          name: decoded.name,
          email: decoded.email
        })
      } catch (error) {
        console.error('Failed to decode token:', error)
      }
    }
  }, [])

  // Initialize socket connection
  useEffect(() => {
    if (!jwtToken || !currentUser) return

    try {
      const socket = initializeSocket(jwtToken)
      setIsSocketConnected(socket.connected)

      // Socket event listeners
      socket.on('connect', () => {
        console.log('✅ Connected to socket server')
        setIsSocketConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('❌ Disconnected from socket server')
        setIsSocketConnected(false)
      })

      socket.on('user_status', (data: { userId: string; isOnline: boolean }) => {
        console.log('👤 User status update:', data)
        setUsers(prev => 
          prev.map(user => 
            user.uuid_id === data.userId 
              ? { ...user, isOnline: data.isOnline }
              : user
          )
        )
        
        // Update selected user status
        if (selectedUser?.uuid_id === data.userId) {
          setSelectedUser(prev => prev ? { ...prev, isOnline: data.isOnline } : null)
        }
      })

      socket.on('receive_message', (messageData: any) => {
        console.log('📨 Received message:', messageData)
        
        const newMessage: Message = {
          id: messageData.id,
          senderId: messageData.senderId,
          receiverId: messageData.receiverId,
          content: messageData.content,
          timestamp: new Date(messageData.timestamp),
          isRead: messageData.isRead,
          status: 'delivered'
        }
        
        setMessages(prev => [...prev, newMessage])
        
        // Auto-mark as read if conversation is open
        if (messageData.senderId === selectedUser?.uuid_id) {
          setTimeout(() => {
            markMessagesAsRead(conversationId, [messageData.id])
          }, 1000)
        }
      })

      socket.on('message_sent', (data: any) => {
        console.log('✅ Message sent confirmation:', data)
        setMessages(prev => 
          prev.map(msg => 
            msg.tempId === data.tempId
              ? { 
                  ...msg, 
                  id: data.message.id, 
                  timestamp: new Date(data.message.timestamp),
                  status: 'delivered',
                  tempId: undefined 
                }
              : msg
          )
        )
      })

      socket.on('message_error', (data: any) => {
        console.error('❌ Message error:', data)
        setMessages(prev =>
          prev.map(msg =>
            msg.tempId === data.tempId
              ? { ...msg, status: 'failed' }
              : msg
          )
        )
      })

      socket.on('user_typing', (data: { userId: string; conversationId: string; isTyping: boolean }) => {
        console.log('⌨️ Typing indicator:', data)
        if (data.conversationId === conversationId) {
          setTypingUsers(prev => {
            const updated = new Set(prev)
            if (data.isTyping) {
              updated.add(data.userId)
            } else {
              updated.delete(data.userId)
            }
            return updated
          })
        }
      })

      socket.on('messages_read', (data: { conversationId: string; messageIds: string[] }) => {
        console.log('📖 Messages read:', data)
        setMessages(prev =>
          prev.map(msg =>
            data.messageIds.includes(msg.id)
              ? { ...msg, isRead: true }
              : msg
          )
        )
      })

      return () => {
        disconnectSocket()
      }
    } catch (error) {
      console.error('Failed to initialize socket:', error)
    }
  }, [jwtToken, currentUser, conversationId, selectedUser])

  // Fetch users from API
  useEffect(() => {
    if (currentUser) {
      fetchUsers()
    }
  }, [currentUser])

  // Auto-scroll to bottom
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
    if (!currentUser) return
    
    setSelectedUser(user)
    setMessages([])
    setIsLoadingMessages(true)
    
    try {
      // Create or get conversation
      const convResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipientId: user.uuid_id })
      })
      
      if (!convResponse.ok) {
        throw new Error('Failed to create/get conversation')
      }
      
      const convData = await convResponse.json()
      const convId = convData.conversationId
      setConversationId(convId)
      
      console.log(`💬 Conversation ID: ${convId}`)
      
      // Fetch existing messages
      const messagesResponse = await fetch(`/api/messages/${convId}`, {
        credentials: 'include'
      })
      
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json()
        const formattedMessages: Message[] = messagesData.messages.map((msg: any) => ({
          id: msg.id,
          senderId: msg.senderId,
          receiverId: msg.receiverId || user.uuid_id,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          isRead: msg.isRead,
          status: 'delivered'
        }))
        setMessages(formattedMessages)
        
        // Mark unread messages as read
        const unreadMessageIds = formattedMessages
          .filter(msg => !msg.isRead && msg.receiverId === currentUser.uuid_id)
          .map(msg => msg.id)
        
        if (unreadMessageIds.length > 0 && isSocketConnected) {
          markMessagesAsRead(convId, unreadMessageIds)
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedUser || !isSocketConnected || !currentUser) return

    const tempId = `temp_${Date.now()}`
    const newMessage: Message = {
      id: tempId,
      tempId: tempId,
      senderId: currentUser.uuid_id,
      receiverId: selectedUser.uuid_id,
      content: inputValue,
      timestamp: new Date(),
      isRead: false,
      status: 'sending'
    }

    // Optimistically add message
    setMessages(prev => [...prev, newMessage])
    setInputValue('')

    // Stop typing indicator
    try {
      stopTyping(selectedUser.uuid_id, conversationId)
    } catch (error) {
      console.error('Error stopping typing:', error)
    }

    // Send via socket
    try {
      sendMessage({
        conversationId,
        recipientId: selectedUser.uuid_id,
        content: newMessage.content,
        tempId: tempId
      })
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev =>
        prev.map(msg =>
          msg.tempId === tempId
            ? { ...msg, status: 'failed' }
            : msg
        )
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    if (!selectedUser || !isSocketConnected) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    try {
      startTyping(selectedUser.uuid_id, conversationId)
    } catch (error) {
      console.error('Error starting typing:', error)
    }

    typingTimeoutRef.current = setTimeout(() => {
      try {
        stopTyping(selectedUser.uuid_id, conversationId)
      } catch (error) {
        console.error('Error stopping typing:', error)
      }
    }, 2000)
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
      {/* Sidebar */}
      <div className="w-96 border-r border-gray-200 bg-white flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
            <div className="flex items-center gap-2">
              {isSocketConnected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs font-medium">Disconnected</span>
                </div>
              )}
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

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
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
                    {selectedUser.isOnline ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      'Offline'
                    )}
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
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === currentUser?.uuid_id
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
                            className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
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
                                  message.status === 'sending' ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                                  ) : message.status === 'failed' ? (
                                    <span className="text-xs text-red-500">Failed</span>
                                  ) : message.isRead ? (
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

                {/* Typing Indicator */}
                {typingUsers.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white text-xs">
                        {getInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
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
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={!isSocketConnected}
                  className="flex-1 rounded-full bg-gray-100 border-0 px-5 h-12 focus:bg-gray-50 transition-colors disabled:opacity-50"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !isSocketConnected}
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