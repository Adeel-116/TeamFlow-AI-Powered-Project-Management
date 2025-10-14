"use client";

import React, { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [currentUser] = useState({
    name: "John Doe",
    email: "john.doe@teamflow.ai",
    role: "Project Manager",
    avatar: "",
    initials: "JD",
  });

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Sidebar Toggle */}
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Dashboard Title */}
          <div className="flex flex-col">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
              Dashboard
            </h2>
            {/* Hide subtitle on small screens */}
            <p className="hidden sm:block text-sm text-gray-500">
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="font-medium">New task assigned</div>
                <div className="text-sm text-gray-500">
                  Design homepage mockup - Website Redesign
                </div>
                <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="font-medium">Project deadline approaching</div>
                <div className="text-sm text-gray-500">
                  Marketing Campaign due in 2 days
                </div>
                <div className="text-xs text-gray-400 mt-1">5 hours ago</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start py-3">
                <div className="font-medium">Team member joined</div>
                <div className="text-sm text-gray-500">
                  Sarah Johnson joined Mobile App Launch
                </div>
                <div className="text-xs text-gray-400 mt-1">1 day ago</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-blue-600 cursor-pointer">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 sm:px-3"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                {/* Hide user info on small screens */}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-4 h-4 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                  <Badge variant="outline" className="w-fit mt-1">
                    {currentUser.role}
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
              <DropdownMenuSeparator />
              {currentUser.role === "Project Manager" && (
                <>
                  <DropdownMenuItem>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Manager Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="w-4 h-4 mr-2" />
                    Team Management
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Hide buttons on very small screens */}
          <div className="hidden sm:flex gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">New Project</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
