"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ChatSidebar } from "@/components/chatBox-components/ChatSidebar";
import { useChatStore } from "@/lib/chat_id";

interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, selectedUser, setCurrentUser, setSelectedUser } = useChatStore();

  function getCookie(name: string) {
    const match = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
    return match ? match.split("=")[1] : null;
  }

  // Set current user from token
  useEffect(() => {
    if (currentUser) return;

    const token = getCookie("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
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

  // Fetch chat users list
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

  // Handle user selection from sidebar
  const handleUserSelect = async (user: ChatUser) => {
    if (!currentUser) {
      console.error("❌ Current user not available");
      return;
    }

    console.log("👤 Selecting user:", user.name);

    // Set selected user in store
    setSelectedUser({
      uuid_id: user.uuid_id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    try {
      // Create or get conversation
      const conversationRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.uuid_id,
          receiverId: user.uuid_id,
        }),
      });

      const conversationData = await conversationRes.json();
      const conversationId = conversationData.conversationId;

      if (conversationId) {
        console.log("✅ Navigating to conversation:", conversationId);
        router.push(`/dashboard/chats/dms/${conversationId}`);
      }
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
      {/* Sidebar - Always visible */}
      <ChatSidebar
        users={chatUsers}
        selectedUserId={selectedUser?.uuid_id || null}
        onSelectUser={handleUserSelect}
        isConnected={isSocketConnected}
        currentUserId={currentUser?.uuid_id || null}
      />

      {/* Main Chat Area - Dynamic content */}
      <div className="flex-1 flex flex-col bg-white">
        {children}
      </div>
    </div>
  );
}