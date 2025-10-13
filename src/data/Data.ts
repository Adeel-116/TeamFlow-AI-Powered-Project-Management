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


interface NavItemType {
    id: string, 
    label: string, 
}
interface NavigationType{
    id: string, 
    icon: LucideIcon, 
    label: string,
    items: NavItemType[]
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


export const navigation: NavigationType[] = [
  {
    id: "dashboards",
    icon: Home,
    label: "Dashboards",
    items: [
      { id: "personal-dashboard", label: "Personal Dashboard" },
      { id: "project-dashboard", label: "Project Dashboard" },
      { id: "agency-dashboard", label: "Agency Dashboard" },
    ],
  },
  {
    id: "projects",
    icon: FolderOpen,
    label: "Project Management",
    items: [
      { id: "all-projects", label: "All Projects" },
      { id: "create-project", label: "Create Project" },
      { id: "milestones", label: "Milestones" },
      { id: "task-overview", label: "Task Overview" },
      { id: "timeline-view", label: "Timeline View (Gantt)" },
    ],
  },
  {
    id: "tasks",
    icon: CheckSquare,
    label: "Task Management",
    items: [
      { id: "my-tasks", label: "My Tasks" },
      { id: "subtasks", label: "Subtasks" },
      { id: "time-tracking", label: "Time Tracking" },
      { id: "labels-tags", label: "Labels / Tags" },
    ],
  },
  {
    id: "team",
    icon: Users,
    label: "Team Collaboration",
    items: [
      { id: "messages", label: "Messages / Chat" },
      { id: "activity-feed", label: "Activity Feed" },
      { id: "notifications", label: "Notifications" },
    ],
  },
  {
    id: "files",
    icon: FileText,
    label: "File Management",
    items: [
      { id: "documents", label: "Documents" },
      { id: "uploads", label: "Uploads" },
      { id: "version-control", label: "Version Control" },
      { id: "file-search", label: "File Search" },
    ],
  },
  {
    id: "calendar",
    icon: Calendar,
    label: "Calendar & Scheduling",
    items: [
      { id: "calendar-view", label: "Calendar View" },
      { id: "meetings", label: "Meetings" },
      { id: "deadlines", label: "Deadlines" },
    ],
  },
  {
    id: "reports",
    icon: BarChart3,
    label: "Reports & Analytics",
    items: [
      { id: "project-reports", label: "Project Reports" },
      { id: "team-performance", label: "Team Performance" },
      { id: "custom-reports", label: "Custom Reports" },
      { id: "export", label: "Export" },
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