// "use client";

// import { useEffect, useState, useRef, Suspense } from "react";
// import { jwtDecode } from "jwt-decode";
// import { io } from "socket.io-client";
// import { ChatSidebar } from "@/components/chatBox-components/ChatSidebar";
// import { ChatHeader } from "@/components/chatBox-components/ChatHeader";
// import { MessageList } from "@/components/chatBox-components/MessageList";
// import { EmptyState } from "@/components/chatBox-components/EmptyState";
// import { MessageInput } from "@/components/chatBox-components/MessageInput";
// import { ChatLoader } from "@/components/chatBox-components/ChatLoader";
// // Loader UI


// interface ChatUser {
//   uuid_id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface Message {
//   senderId: string;
//   receiverId: string;
//   message: string;
//   timestamp: string;
//   messageId?: number;
//   isRead?: boolean;
// }

// export default function DirectMessagesPage() {
//   const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
//   const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [currentUser, setCurrentUser] = useState<{ uuid_id: string } | null>(null);
//   const [isSocketConnected, setIsSocketConnected] = useState(false);
//   const [isLoadingMessages, setIsLoadingMessages] = useState(false);

//   const socketRef = useRef<any>(null);

//   // 🍪 Utility: get cookie
//   function getCookie(name: string) {
//     const match = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
//     return match ? match.split("=")[1] : null;
//   }

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase())
//       .slice(0, 2)
//       .join("");

//   useEffect(() => {
//     const token = getCookie("token");
//     if (!token) {
//       console.error("❌ No token found");
//       return;
//     }

//     try {
//       const decoded: any = jwtDecode(token);
//       setCurrentUser({ uuid_id: decoded.uuid_id });

//       socketRef.current = io("http://localhost:3001", {
//         transports: ["websocket", "polling"],
//         reconnection: true,
//       });


//       socketRef.current.on("connect", () => {
//         console.log("✅ Socket connected");
//         setIsSocketConnected(true);
//         socketRef.current.emit("register", decoded.uuid_id);
//       });

//       socketRef.current.on("disconnect", () => {
//         console.log("❌ Socket disconnected");
//         setIsSocketConnected(false);
//       });

//       socketRef.current.on("receive_message", (data: Message) => {
//         console.log("📨 Message received:", data);

//         setMessages((prev) => {
//           const isDuplicate = prev.some(
//             (msg) => msg.timestamp === data.timestamp && msg.senderId === data.senderId
//           );
//           if (isDuplicate) return prev;

//           if (selectedUser && selectedUser.uuid_id === data.senderId) {
//             socketRef.current.emit("messages_read", {
//               senderId: data.senderId,
//               receiverId: currentUser?.uuid_id,
//             });

//             markMessagesAsReadDB(data.senderId);
//             return [...prev, { ...data, isRead: true }];
//           }

//           return [...prev, data];
//         });
//       });

//       socketRef.current.on("messages_read_ack", ({ senderId, receiverId }: any) => {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.senderId === senderId && msg.receiverId === receiverId
//               ? { ...msg, isRead: true }
//               : msg
//           )
//         );
//       });

//       fetchChatList();
//     } catch (err) {
//       console.error("❌ Error decoding token:", err);
//     }

//     return () => {
//       socketRef.current?.disconnect();
//     };
//   }, [selectedUser]); 

//   const fetchChatList = async () => {
//     try {
//       const res = await fetch("/api/chats-users");
//       const data = await res.json();
//       setChatUsers(data.users || []);
//     } catch (error) {
//       console.error("❌ Error fetching chat users:", error);
//     }
//   };

//   const fetchChatHistory = async (otherUserId: string) => {
//     if (!currentUser) return;
//     setIsLoadingMessages(true);

//     try {
//       const conversationRes = await fetch("/api/conversations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           senderId: currentUser.uuid_id,
//           receiverId: otherUserId,
//         }),
//       });

//       const conversationData = await conversationRes.json();
//       const conversationId = conversationData.conversationId;

//       const messagesRes = await fetch(`/api/chat-history/${conversationId}`);
//       const messagesData = await messagesRes.json();

//       const transformedMessages: Message[] = messagesData.map((msg: any) => ({
//         senderId: msg.sender_id,
//         receiverId: msg.receiver_id,
//         message: msg.content,
//         timestamp: msg.created_at,
//         messageId: msg.message_id,
//         isRead: msg.is_read,
//       }));

//       setMessages(transformedMessages);
//     } catch (error) {
//       console.error("❌ Error fetching chat history:", error);
//     } finally {
//       setIsLoadingMessages(false);
//     }
//   };

//   const markMessagesAsReadDB = async (senderId: string) => {
//     if (!currentUser) return;
//     try {
//       const response = await fetch(`/api/chat-history/mark-read`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           senderId,
//           receiverId: currentUser.uuid_id,
//         }),
//       });

//       if (response.ok) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.senderId === senderId && msg.receiverId === currentUser.uuid_id
//               ? { ...msg, isRead: true }
//               : msg
//           )
//         );
//       }
//     } catch (error) {
//       console.error("❌ Error marking messages as read:", error);
//     }
//   };

//   const handleUserSelect = async (user: ChatUser) => {
//     setSelectedUser(user);
//     await fetchChatHistory(user.uuid_id);

//     if (socketRef.current && currentUser) {
//       socketRef.current.emit("messages_read", {
//         senderId: user.uuid_id,
//         receiverId: currentUser.uuid_id,
//       });
//       markMessagesAsReadDB(user.uuid_id);
//     }
//   };

//   const handleSendMessage = async (message: string) => {
//     console.log(message)
//     if (!selectedUser || !currentUser || !socketRef.current) return;

//     const newMessage: Message = {
//       senderId: currentUser.uuid_id,
//       receiverId: selectedUser.uuid_id,
//       message,
//       timestamp: new Date().toISOString(),
//       isRead: false,
//     };

//     setMessages((prev) => [...prev, newMessage]);
//     socketRef.current.emit("send_message", newMessage);

//     try {
//       const conversationRes = await fetch("/api/conversations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           senderId: currentUser.uuid_id,
//           receiverId: selectedUser.uuid_id,
//         }),
//       });

//       const conversationData = await conversationRes.json();
//       const conversationId = conversationData.conversationId;

//       const messageRes = await fetch("/api/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           conversationId,
//           message: newMessage,
//         }),
//       });

//       const messageResult = await messageRes.json();
//       if (messageRes.ok) {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.timestamp === newMessage.timestamp ? { ...msg, messageId: messageResult.messageId } : msg
//           )
//         );
//       }
//     } catch (error) {
//       console.error("❌ Error saving message:", error);
//     }
//   };

//   const currentChatMessages =
//     selectedUser && currentUser
//       ? messages.filter(
//           (msg) =>
//             (msg.senderId === currentUser.uuid_id &&
//               msg.receiverId === selectedUser.uuid_id) ||
//             (msg.receiverId === currentUser.uuid_id &&
//               msg.senderId === selectedUser.uuid_id)
//         )
//       : [];

//   return (
//     <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
//       <ChatSidebar
//         users={chatUsers}
//         selectedUserId={selectedUser?.uuid_id || null}
//         onSelectUser={handleUserSelect}
//         isConnected={isSocketConnected}
//         currentUserId={currentUser?.uuid_id || null}
//       />

//       <div className="flex-1 flex flex-col bg-white">
//         {selectedUser ? (
//           <>
//             <ChatHeader
//               userName={selectedUser.name}
//               userInitials={getInitials(selectedUser.name)}
//             />

//             <Suspense fallback={<ChatLoader />}>
//               {isLoadingMessages ? (
//                 <ChatLoader />
//               ) : (
//                 <MessageList
//                   messages={currentChatMessages}
//                   currentUserId={currentUser?.uuid_id || ""}
//                   selectedUserName={selectedUser.name}
//                 />
//               )}
//             </Suspense>

//             <MessageInput  
//              socket={socketRef.current} 
//              onSend={handleSendMessage} 
//              disabled={!isSocketConnected} />
//           </>
//         ) : (
//           <EmptyState />
//         )}
//       </div>
//     </div>
//   );
// }
