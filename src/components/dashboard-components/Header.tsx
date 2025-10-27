"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  ChevronDown,
  X,
  Menu,
  BarChart3,
  HelpCircle,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/useAuthStore";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const createAvatar = (fullName: string): string => {
  if (!fullName) return "";
  const names = fullName.split(" ");
  return names.map(n => n.charAt(0).toUpperCase()).slice(0, 2).join("");
};

const NotificationsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="flex flex-col items-start py-3">
        <div className="font-medium">New task assigned</div>
        <div className="text-sm text-gray-500">Design homepage mockup</div>
        <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex flex-col items-start py-3">
        <div className="font-medium">Project deadline approaching</div>
        <div className="text-sm text-gray-500">Marketing Campaign due in 2 days</div>
        <div className="text-xs text-gray-400 mt-1">5 hours ago</div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex flex-col items-start py-3">
        <div className="font-medium">Team member joined</div>
        <div className="text-sm text-gray-500">Sarah Johnson joined Mobile App Launch</div>
        <div className="text-xs text-gray-400 mt-1">1 day ago</div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="justify-center text-blue-600 cursor-pointer">
        View all notifications
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const ProfileDropdown = ({ user }: { user: any }) => {
  const isManager = user.role === "manager";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-blue-600 text-white">
              {createAvatar(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
          </div>
          <ChevronDown className="w-4 h-4 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <Badge variant="outline" className="w-fit mt-1 capitalize">
              {user.role}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem>
        
        {isManager && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BarChart3 className="w-4 h-4 mr-2" />
              Manager Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="w-4 h-4 mr-2" />
              Team Management
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user } = useAuthStore();

  if (!user) return null;

  const isManager = user.role === "manager";
  const welcomeMessage = isManager
    ? "Welcome back! Here's what's happening today."
    : `Welcome back, ${user.name}! Here are your tasks today.`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex flex-col">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">Dashboard</h2>
            <p className="hidden sm:block text-sm text-gray-500">{welcomeMessage}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NotificationsDropdown />
          <ProfileDropdown user={user} />
          
          {isManager && (
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button size="sm">New Project</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;