"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { ChatHeader } from "@/components/chatBox-components/ChatHeader";
import { MessageList } from "@/components/chatBox-components/MessageList";
import { MessageInput } from "@/components/chatBox-components/MessageInput";
import { ChatLoader } from "@/components/chatBox-components/ChatLoader";
import { useChatStore } from "@/lib/chatStore";

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  messageId?: number;
  isRead?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { currentUser, selectedUser } = useChatStore();
  const params = useParams();
  const conversationId = params?.conversationId as string;
  const socketRef = useRef<Socket | null>(null);

  // Mark messages as read when viewing conversation
  useEffect(() => {
    if (
      !socketRef.current ||
      !currentUser ||
      !selectedUser ||
      !isSocketConnected
    )
      return;

    const unreadMessages = messages.filter(
      (msg) =>
        msg.senderId === selectedUser.uuid_id &&
        msg.receiverId === currentUser.uuid_id &&
        !msg.isRead
    );

    if (unreadMessages.length > 0) {
      socketRef.current.emit("messages_read", {
        senderId: selectedUser.uuid_id,
        receiverId: currentUser.uuid_id,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === selectedUser.uuid_id &&
          msg.receiverId === currentUser.uuid_id
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  }, [
    selectedUser?.uuid_id,
    currentUser?.uuid_id,
    isSocketConnected,
    messages.length,
  ]);

  // Socket connection for chat page
  useEffect(() => {
    if (!currentUser?.uuid_id) return;

    const socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Chat page socket connected");
      setIsSocketConnected(true);
      socket.emit("register", currentUser.uuid_id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Chat page socket disconnected");
      setIsSocketConnected(false);
    });

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.timestamp === data.timestamp && msg.senderId === data.senderId
        );
        if (isDuplicate) return prev;

        if (selectedUser && selectedUser.uuid_id === data.senderId) {
          socket.emit("messages_read", {
            senderId: data.senderId,
            receiverId: currentUser.uuid_id,
          });

          return [...prev, { ...data, isRead: true }];
        }

        return [...prev, data];
      });
    });

    socket.on("messages_read_ack", ({ senderId, receiverId }: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === senderId && msg.receiverId === receiverId
            ? { ...msg, isRead: true }
            : msg
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.uuid_id, selectedUser]);

  // Fetch chat history
  useEffect(() => {
    if (!conversationId || !selectedUser) return;

    const fetchChatHistory = async () => {
      setIsLoadingMessages(true);

      try {
        const messagesRes = await fetch(
          `/api/chat-history/${conversationId}`
        );
        const messagesData = await messagesRes.json();

        const transformedMessages: Message[] = messagesData.map(
          (msg: any) => ({
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            message: msg.content,
            timestamp: msg.created_at,
            messageId: msg.message_id,
            isRead: msg.is_read,
          })
        );

        setMessages(transformedMessages);
      } catch (error) {
        console.error("❌ Error fetching chat history:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchChatHistory();
  }, [conversationId, selectedUser]);

  const handleSendMessage = async (message: string) => {
    if (
      !selectedUser ||
      !currentUser ||
      !socketRef.current ||
      !conversationId
    )
      return;

    const newMessage: Message = {
      senderId: currentUser.uuid_id,
      receiverId: selectedUser.uuid_id,
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    socketRef.current.emit("send_message", newMessage);

    try {
      const messageRes = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: newMessage,
        }),
      });

      const messageResult = await messageRes.json();
      if (messageRes.ok) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === newMessage.timestamp
              ? { ...msg, messageId: messageResult.messageId }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  };

  const currentChatMessages =
    selectedUser && currentUser
      ? messages.filter(
          (msg) =>
            (msg.senderId === currentUser.uuid_id &&
              msg.receiverId === selectedUser.uuid_id) ||
            (msg.receiverId === currentUser.uuid_id &&
              msg.senderId === selectedUser.uuid_id)
        )
      : [];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <ChatLoader />
      </div>
    );
  }

  return (
    <>
      <ChatHeader
        userName={selectedUser.name}
        userInitials={getInitials(selectedUser.name)}
      />

      {isLoadingMessages ? (
        <ChatLoader />
      ) : (
        <MessageList
          messages={currentChatMessages}
          currentUserId={currentUser?.uuid_id || ""}
          selectedUserName={selectedUser.name}
        />
      )}

      <MessageInput
        socket={socketRef.current}
        onSend={handleSendMessage}
        disabled={!isSocketConnected}
      />
    </>
  );
}