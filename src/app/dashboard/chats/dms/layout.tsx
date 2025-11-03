"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { io, Socket } from "socket.io-client";
import { ChatSidebar } from "@/components/chatBox-components/ChatSidebar";
import { useChatStore } from "@/lib/chatStore";

interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

interface DecodedToken {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const router = useRouter();
  const { currentUser, selectedUser, setCurrentUser, setSelectedUser, setOnlineUsers } =
    useChatStore();
  const socketRef = useRef<Socket | null>(null);

  // Get cookie helper
  const getCookie = (name: string): string | null => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
    return match ? match.split("=")[1] : null;
  };

  // Initialize current user from token
  useEffect(() => {
    if (currentUser) return;

    const token = getCookie("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setCurrentUser({
        uuid_id: decoded.uuid_id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      });
      console.log("✅ Current user set:", decoded.name);
    } catch (err) {
      console.error("❌ Error decoding token:", err);
    }
  }, [currentUser, setCurrentUser]);

  // Socket connection
  useEffect(() => {
    if (!currentUser?.uuid_id) return;

    const socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsSocketConnected(true);
      socket.emit("register", currentUser.uuid_id);
      socket.emit("user_status", {
        status: true,
        currentUserID: currentUser.uuid_id,
      });
    });

    // Listen for user status updates
    socket.on("user_status", (data: { userId: string; status: boolean }[]) => {
      console.log("📡 User status update:", data);
      
      // Convert array to Record<string, boolean> and save to Zustand
      const onlineUsersMap: Record<string, boolean> = {};
      data.forEach((user) => {
        onlineUsersMap[user.userId] = user.status;
      });
      
      console.log("💾 Saving to Zustand:", onlineUsersMap);
      setOnlineUsers(onlineUsersMap);
    });

    socket.on("disconnect", async () => {
      console.log("❌ Socket disconnected");
      setIsSocketConnected(false);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser?.uuid_id, setOnlineUsers]);

  // Fetch chat users
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const res = await fetch("/api/chats-users");
        const data = await res.json();
        setChatUsers(data.users || []);
        console.log("✅ Chat users loaded:", data.users?.length);
      } catch (err) {
        console.error("❌ Error fetching chat users:", err);
      }
    };

    fetchChatUsers();
  }, []);

  const handleUserSelect = async (user: ChatUser) => {
    if (!currentUser) {
      console.error("❌ Current user not available");
      return;
    }

    console.log("👤 Selecting user:", user.name);

    setSelectedUser({
      uuid_id: user.uuid_id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    try {
      const conversationRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.uuid_id,
          receiverId: user.uuid_id,
        }),
      });

      const conversationData = await conversationRes.json();

      if (conversationData.conversationId) {
        console.log(
          "✅ Navigating to conversation:",
          conversationData.conversationId
        );
        router.push(`/dashboard/chats/dms/${conversationData.conversationId}`);
      }
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
      <ChatSidebar
        users={chatUsers}
        selectedUserId={selectedUser?.uuid_id || null}
        onSelectUser={handleUserSelect}
        isConnected={isSocketConnected}
      />

      <div className="flex-1 flex flex-col bg-white">{children}</div>
    </div>
  );
}