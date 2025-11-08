"use client";

import React, { useEffect, useState } from "react";
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
  Moon,
  Sun,
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
      <Button
        variant="ghost"
        size="icon"
        className="relative text-foreground hover:bg-accent"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      className="w-72 max-h-[360px] overflow-y-auto bg-card text-card-foreground border border-border shadow-md"
    >
      <DropdownMenuLabel className="text-sm font-semibold">
        Notifications
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuItem className="flex flex-col items-start py-2">
        <div className="font-medium">New task assigned</div>
        <div className="text-xs text-muted-foreground">
          Design homepage mockup
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">2 hours ago</div>
      </DropdownMenuItem>

      <DropdownMenuItem className="flex flex-col items-start py-2">
        <div className="font-medium">Project deadline approaching</div>
        <div className="text-xs text-muted-foreground">Campaign due in 2 days</div>
        <div className="text-[10px] text-muted-foreground mt-1">5 hours ago</div>
      </DropdownMenuItem>

      <DropdownMenuItem className="flex flex-col items-start py-2">
        <div className="font-medium">Team member joined</div>
        <div className="text-xs text-muted-foreground">Sarah Johnson joined</div>
        <div className="text-[10px] text-muted-foreground mt-1">1 day ago</div>
      </DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem className="justify-center text-primary cursor-pointer text-xs">
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
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 sm:px-2.5 text-foreground hover:bg-accent"
        >
          <Avatar className="w-7 h-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {createAvatar(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium leading-none">{user.name}</div>
            <div className="text-[11px] text-muted-foreground">{user.role}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 hidden md:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-card text-card-foreground border border-border shadow-md"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <Badge variant="outline" className="w-fit mt-1 capitalize">
              {user.role}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" /> My Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="w-4 h-4 mr-2" /> Help & Support
        </DropdownMenuItem>

        {isManager && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <BarChart3 className="w-4 h-4 mr-2" /> Manager Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="w-4 h-4 mr-2" /> Team Management
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const { user } = useAuthStore();
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage
  // useEffect(() => {
  //   const theme = localStorage.getItem("theme");
  //   if (theme === "dark") {
  //     document.documentElement.classList.add("dark");
  //     setIsDark(true);
  //   }
  // }, []);

  // Toggle dark mode
  const toggleTheme = () => {
    // const newTheme = isDark ? "light" : "dark";
    // setIsDark(!isDark);
    // document.documentElement.classList.toggle("dark", !isDark);
    // localStorage.setItem("theme", newTheme);
  };

  if (!user) return null;

  const isManager = user.role === "manager";
  const welcomeMessage = isManager
    ? "Welcome back! Here's what's happening today."
    : `Welcome back, ${user.name}! Here are your tasks today.`;

  return (
  <header className="sticky top-0 z-50 border-b border-border px-3 md:px-5 py-2.5 md:py-4 text-foreground bg-white shadow-sm">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-foreground hover:bg-accent"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          <div className="flex flex-col">
            <h2 className="text-base md:text-lg font-semibold leading-tight">
              Dashboard
            </h2>
            <p className="hidden sm:block text-xs text-muted-foreground">
              {welcomeMessage}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground hover:bg-accent"
            aria-label="Toggle dark mode"
          >
            <Sun className="w-4 h-4 dark:hidden" />
            <Moon className="w-4 h-4 hidden dark:block" />
          </Button>

          <NotificationsDropdown />
          <ProfileDropdown user={user} />

          {isManager && (
            <div className="hidden sm:flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
              >
                Export
              </Button>
              <Button
                size="sm"
                className="text-xs h-7 px-3 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                New Project
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
