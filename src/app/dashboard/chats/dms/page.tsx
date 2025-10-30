"use client";

import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";
import { ChatSidebar } from "@/components/chatBox-components/ChatSidebar";
import { ChatHeader } from "@/components/chatBox-components/ChatHeader";
import { MessageList } from "@/components/chatBox-components/MessageList";
import { EmptyState } from "@/components/chatBox-components/EmptyState";
import { MessageInput } from "@/components/chatBox-components/MessageInput";
interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export default function DirectMessagesPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<{ uuid_id: string } | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const socketRef = useRef<any>(null);

  function getCookie(name: string) {
    const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return match ? match.split('=')[1] : null;
  }

  const getInitials = (name: string) => {
    return name.split(" ").map((word) => word.charAt(0).toUpperCase()).slice(0, 2).join("");
  };

  // Initialize socket
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log("👤 Current User:", decoded.uuid_id);
      setCurrentUser({ uuid_id: decoded.uuid_id });

      // Socket connection
      socketRef.current = io("http://localhost:3001", {
        transports: ['websocket', 'polling'],
        reconnection: true,
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected");
        setIsSocketConnected(true);
        socketRef.current.emit("register", decoded.uuid_id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsSocketConnected(false);
      });

      socketRef.current.on("receive_message", (data: Message) => {
        console.log("📨 Message received:", data);
        setMessages((prev) => {
          const isDuplicate = prev.some(
            msg => msg.timestamp === data.timestamp && msg.senderId === data.senderId
          );
          return isDuplicate ? prev : [...prev, data];
        });
      });

      fetchChatList();
    } catch (err) {
      console.error("❌ Error:", err);
    }

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchChatList = async () => {
    try {
      const res = await fetch("/api/chats-users");
      const data = await res.json();
      setChatUsers(data.users || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  const fetchChatHistory = async (userId: string) => {
    if (!currentUser) return;
    // try {
    //   const res = await fetch(`/api/messages?senderId=${currentUser.uuid_id}&receiverId=${userId}`);
    //   const data = await res.json();
    //   setMessages(data.messages || []);
    // } catch (error) {
    //   console.error("❌ Error fetching history:", error);
    //   setMessages([]);
    // }
  };

  const handleUserSelect = (user: ChatUser) => {
    console.log("👤 Selected:", user.name);
    setSelectedUser(user);
    fetchChatHistory(user.uuid_id);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedUser || !currentUser || !socketRef.current) return;

    const newMessage: Message = {
      senderId: currentUser.uuid_id,
      receiverId: selectedUser.uuid_id,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Sending:", newMessage);
    socketRef.current.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);

    try {
      const conversationTable = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUser.uuid_id,
          receiverId: selectedUser.uuid_id,
        }),
      });

      const responseData = await conversationTable.json();
      if (conversationTable.ok) {
        console.log("return Response is", responseData);
        const conversationId = responseData.conversationId;
        const isNew = responseData.isNew

        try {

            const response = await fetch("/api/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              conversationId: conversationId,
              message: newMessage,
            }),})

             const result = await response.json();
            if (result.ok) {
            console.log("Messages inserted", result);
            } else{
              console.log("Messages Not Inserted")
            }

        } catch (error) {
            console.log("Error Occurs on inserted", error)
        }

      } else {
          console.error("Failed to save conversation:", responseData);
        }
      } catch (error) {
        console.log("Error Occur", error);
      }
    };

    const currentChatMessages = selectedUser && currentUser
      ? messages.filter(
        (msg) =>
          (msg.senderId === currentUser.uuid_id && msg.receiverId === selectedUser.uuid_id) ||
          (msg.receiverId === currentUser.uuid_id && msg.senderId === selectedUser.uuid_id)
      )
      : [];

    return (
      <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
        <ChatSidebar
          users={chatUsers}
          selectedUserId={selectedUser?.uuid_id || null}
          onSelectUser={handleUserSelect}
          isConnected={isSocketConnected}
          currentUserId={currentUser?.uuid_id || null}
        />

        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              <ChatHeader
                userName={selectedUser.name}
                userInitials={getInitials(selectedUser.name)}
              />
              <MessageList
                messages={currentChatMessages}
                currentUserId={currentUser?.uuid_id || ""}
                selectedUserName={selectedUser.name}
              />
              <MessageInput
                onSend={handleSendMessage}
                disabled={!isSocketConnected}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    );
  }