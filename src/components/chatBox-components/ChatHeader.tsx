"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  userName: string;
  userInitials: string;
}

export function ChatHeader({ userName, userInitials }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 h-20 border-b border-gray-200 px-6 flex items-center justify-between bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12 border-2 border-gray-100">
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-gray-900 text-lg">{userName}</h1>
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
  );
}