"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { ChatSidebar } from "@/components/chatBox-components/ChatSidebar";
import { EmptyState } from "@/components/chatBox-components/EmptyState";
import { useChatID } from "@/lib/chat_id";

interface ChatUser {
  uuid_id: string;
  name: string;
  email: string;
  role: string;
}

export default function DirectMessagesPage() {
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const router = useRouter();
  const { currentUserID, selectedUserID, setCurrentID, setSelectedID } = useChatID();

  // Log Zustand state changes
  useEffect(() => {
    console.log("🔄 Zustand State Update:", {
      currentUserID,
      selectedUserID,
    });
  }, [currentUserID, selectedUserID]);

  function getCookie(name: string) {
    const match = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
    const value = match ? match.split("=")[1] : null;
    console.log(`🍪 Cookie "${name}":`, value ? "Found" : "Not Found");
    return value;
  }

  // Set current user
  useEffect(() => {
    console.log("🚀 Starting to decode token...");
    const token = getCookie("token");
    
    if (!token) {
      console.error("❌ No token found in cookies");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log("📦 Decoded Token:", decoded);
      console.log("👤 UUID from token:", decoded.uuid_id);
      
      setCurrentID(decoded.uuid_id);
      console.log("✅ setCurrentID called with:", decoded.uuid_id);
      
      // Verify it was set
      setTimeout(() => {
        console.log("🔍 Verifying Zustand after 100ms - currentUserID:", currentUserID);
      }, 100);
    } catch (err) {
      console.error("❌ Error decoding token:", err);
    }
  }, [setCurrentID]); // currentUserID ko dependency mein mat add karein

  // Fetch chat users
  useEffect(() => {
    console.log("📡 Fetching chat users...");
    const fetchChatUsers = async () => {
      try {
        const res = await fetch("/api/chats-users");
        const data = await res.json();
        console.log("👥 Chat users fetched:", data.users?.length || 0, "users");
        setChatUsers(data.users || []);
      } catch (err) {
        console.error("❌ Error fetching chat users:", err);
      }
    };

    fetchChatUsers();
  }, []);

  // Handle chat user selection
  const handleUserSelect = async (user: ChatUser) => {
    console.log("🎯 User selected:", user.name, user.uuid_id);
    console.log("📊 Current state - currentUserID:", currentUserID);
    
    if (!currentUserID) {
      console.error("❌ Current user not found in Zustand");
      return;
    }

    console.log("💾 Setting selected user ID:", user.uuid_id);
    setSelectedID(user.uuid_id);

    try {
      console.log("🔗 Creating/finding conversation...");
      const conversationRes = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserID,
          receiverId: user.uuid_id,
        }),
      });

      const conversationData = await conversationRes.json();
      console.log("📬 Conversation response:", conversationData);
      
      const conversationId = conversationData.conversationId;
      console.log("💬 Conversation ID:", conversationId);

      if (conversationId) {
        console.log("🧭 Navigating to:", `/dashboard/chats/dms/${conversationId}`);
        router.push(`/dashboard/chats/dms/${conversationId}`);
      } else {
        console.error("❌ No conversation ID returned");
      }
    } catch (error) {
      console.error("❌ Error selecting user:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-133px)] w-full overflow-hidden bg-gray-50">
      <ChatSidebar
        users={chatUsers}
        selectedUserId={selectedUserID || null}
        onSelectUser={handleUserSelect}
        isConnected={true}
        currentUserId={currentUserID || null}
      />

      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      </div>
    </div>
  );
}