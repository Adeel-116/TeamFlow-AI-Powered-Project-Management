import {
  Home,
  FolderOpen,
  CheckSquare,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";
import { LucideIcon } from "lucide-react";


export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  items: { id: string; label: string; path: string }[];
}

interface dummyProjectsType{
id: number;
  name: string;
  progress: number; 
  status: "Planning" | "In Progress" | "Review" | "Done";
  dueDate: string; 
}
interface TaskType{
  id: number;
  title: string;
  project: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
}

interface StatType {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: "up" | "down" | "neutral";
}


export const navigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
    items: []
  },
  {
    id: "projects",
    label: "Project Management",
    icon: FolderOpen,
    items: [
      { id: "all-projects", label: "All Projects", path: "/dashboard/projects" },
      { id: "create-project", label: "Create Project", path: "/dashboard/projects/create" },
      { id: "milestones", label: "Milestones", path: "/dashboard/projects/milestones" },
      { id: "task-overview", label: "Task Overview", path: "/dashboard/projects/tasks" },
    ],
  },
  {
    id: "tasks",
    label: "Task Management",
    icon: CheckSquare,
    items: [
      { id: "my-tasks", label: "My Tasks", path: "/dashboard/tasks/my-tasks" },
      { id: "subtasks", label: "Subtasks", path: "/dashboard/tasks/subtasks" },
      { id: "time-tracking", label: "Time Tracking", path: "/dashboard/tasks/time-tracking" },
      { id: "labels-tags", label: "Labels / Tags", path: "/dashboard/tasks/labels-tags" },
    ],
  },
  {
    id: "files",
    label: "File Management",
    icon: FileText,
    items: [
      { id: "documents", label: "Documents", path: "/dashboard/files/documents" },
      { id: "uploads", label: "Uploads", path: "/dashboard/files/uploads" },
      { id: "version-control", label: "Version Control", path: "/dashboard/files/version-control" },
      { id: "file-search", label: "File Search", path: "/dashboard/files/search" },
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    items: [
      { id: "calendar-view", label: "Calendar View", path: "/dashboard/calendar" },
      { id: "meetings", label: "Meetings", path: "/dashboard/calendar/meetings" },
      { id: "deadlines", label: "Deadlines", path: "/dashboard/calendar/deadlines" },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    items: [
      { id: "project-reports", label: "Project Reports", path: "/dashboard/reports/projects" },
      { id: "team-performance", label: "Team Performance", path: "/dashboard/reports/team" },
      { id: "custom-reports", label: "Custom Reports", path: "/dashboard/reports/custom" },
      { id: "export", label: "Export", path: "/dashboard/reports/export" },
    ],
  },
  {
    id: "team-members",
    label: "Team Members",
    icon: Users,
    items: [
      { id: "add-member", label: "Add Member", path: "/dashboard/team-members" },
      { id: "manage-members", label: "Manage Members", path: "/dashboard/team/manage" },
    ],
  },
];

export const dummyProjects:dummyProjectsType[] = [
  {
    id: 1,
    name: "Website Redesign",
    progress: 75,
    status: "In Progress",
    dueDate: "Oct 20, 2025",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    progress: 45,
    status: "In Progress",
    dueDate: "Nov 5, 2025",
  },
  {
    id: 3,
    name: "Marketing Campaign",
    progress: 90,
    status: "Review",
    dueDate: "Oct 15, 2025",
  },
  {
    id: 4,
    name: "Client Onboarding",
    progress: 30,
    status: "Planning",
    dueDate: "Oct 25, 2025",
  },
];

export const recentTasks:TaskType[] = [
  {
    id: 1,
    title: "Design homepage mockup",
    project: "Website Redesign",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Review API documentation",
    project: "Mobile App Launch",
    priority: "Medium",
    status: "Todo",
  },
  {
    id: 3,
    title: "Prepare presentation slides",
    project: "Marketing Campaign",
    priority: "High",
    status: "Done",
  },
  {
    id: 4,
    title: "Update project timeline",
    project: "Client Onboarding",
    priority: "Low",
    status: "In Progress",
  },
];

export const stats:StatType[] = [
  {
    label: "Active Projects",
    value: "12",
    icon: Target,
    change: "+2 this month",
    trend: "up",
  },
  {
    label: "Tasks Completed",
    value: "48",
    icon: CheckSquare,
    change: "+15 this week",
    trend: "up",
  },
  {
    label: "Team Members",
    value: "24",
    icon: Users,
    change: "+3 new",
    trend: "up",
  },
  {
    label: "Hours Tracked",
    value: "156",
    icon: Clock,
    change: "32h this week",
    trend: "neutral",
  },
];