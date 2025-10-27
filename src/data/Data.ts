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
  roles?: ("team_member" | "manager")[];
  items: { id: string; label: string; path: string, roles: ("team_member" | "manager")[]}[];
}

export interface dummyProjectsType {
  id: number;
  name: string;
  progress: number;
  status: "Planning" | "In Progress" | "Review" | "Done";
  dueDate: string;
}

export interface TaskType {
  id: number;
  title: string;
  project: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Done";
}

export interface StatType {
  label: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: "up" | "down" | "neutral";
}

export interface Milestone {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "completed" | "in-progress" | "pending";
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  status: "completed" | "in-progress" | "pending";
  progress: number;
  teamMembers: number[];
  milestones: Milestone[];
}


export const navigation: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/dashboard",
    roles: ["manager", "team_member"], // Both roles
    items: [],
  },
  {
    id: "projects",
    label: "Project Management",
    icon: FolderOpen,
    roles: ["manager"], // Manager only
    items: [
      { id: "all-projects", label: "All Projects", path: "/dashboard/projects", roles: ["manager"] },
      { id: "create-project", label: "Create Project", path: "/dashboard/projects/create", roles: ["manager"] },
      { id: "milestones", label: "Milestones", path: "/dashboard/projects/milestones", roles: ["manager"] },
      { id: "task-overview", label: "Task Overview", path: "/dashboard/projects/tasks", roles: ["manager"] },
    ],
  },
  {
    id: "files",
    label: "File Management",
    icon: FileText,
    roles: ["manager", "team_member"], // Both roles
    items: [
      { id: "documents", label: "Documents", path: "/dashboard/files/documents", roles: ["manager", "team_member"] },
      { id: "uploads", label: "Uploads", path: "/dashboard/files/uploads", roles: ["manager", "team_member"] },
      { id: "version-control", label: "Version Control", path: "/dashboard/files/version-control", roles: ["manager"] },
      { id: "file-search", label: "File Search", path: "/dashboard/files/search", roles: ["manager", "team_member"] },
    ],
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    roles: ["manager", "team_member"], // Both roles
    items: [
      { id: "calendar-view", label: "Calendar View", path: "/dashboard/calendar", roles: ["manager", "team_member"] },
      { id: "meetings", label: "Meetings", path: "/dashboard/calendar/meetings", roles: ["manager", "team_member"] },
      { id: "deadlines", label: "Deadlines", path: "/dashboard/calendar/deadlines", roles: ["manager", "team_member"] },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    roles: ["manager"], // Manager only
    items: [
      { id: "project-reports", label: "Project Reports", path: "/dashboard/reports/projects", roles: ["manager"] },
      { id: "team-performance", label: "Team Performance", path: "/dashboard/reports/team", roles: ["manager"] },
      { id: "custom-reports", label: "Custom Reports", path: "/dashboard/reports/custom", roles: ["manager"] },
      { id: "export", label: "Export", path: "/dashboard/reports/export", roles: ["manager"] },
    ],
  },
  {
    id: "team-members",
    label: "Team Members",
    icon: Users,
    roles: ["manager"], // Manager only
    items: [
      { id: "add-member", label: "Manage Team Member", path: "/dashboard/teams/manage-members", roles: ["manager"] },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    icon: Clock,
    roles: ["manager", "team_member"], // Both roles
    items: [
      { id: "channel", label: "Chat", path: "/dashboard/chats/channels&threads", roles: ["manager", "team_member"] },
      { id: "direct-messages", label: "Direct Messages", path: "/dashboard/chats/dms", roles: ["manager", "team_member"] },
    ],
  },
];


export const dummyProjects: dummyProjectsType[] = [
  { id: 1, name: "Website Redesign", progress: 75, status: "In Progress", dueDate: "Oct 20, 2025" },
  { id: 2, name: "Mobile App Launch", progress: 45, status: "In Progress", dueDate: "Nov 5, 2025" },
  { id: 3, name: "Marketing Campaign", progress: 90, status: "Review", dueDate: "Oct 15, 2025" },
  { id: 4, name: "Client Onboarding", progress: 30, status: "Planning", dueDate: "Oct 25, 2025" },
];

// Recent tasks
export const recentTasks: TaskType[] = [
  { id: 1, title: "Design homepage mockup", project: "Website Redesign", priority: "High", status: "In Progress" },
  { id: 2, title: "Review API documentation", project: "Mobile App Launch", priority: "Medium", status: "Todo" },
  { id: 3, title: "Prepare presentation slides", project: "Marketing Campaign", priority: "High", status: "Done" },
  { id: 4, title: "Update project timeline", project: "Client Onboarding", priority: "Low", status: "In Progress" },
];

// Stats
export const stats: StatType[] = [
  { label: "Active Projects", value: "12", icon: Target, change: "+2 this month", trend: "up" },
  { label: "Tasks Completed", value: "48", icon: CheckSquare, change: "+15 this week", trend: "up" },
  { label: "Team Members", value: "24", icon: Users, change: "+3 new", trend: "up" },
  { label: "Hours Tracked", value: "156", icon: Clock, change: "32h this week", trend: "neutral" },
];

// All projects (typed properly)
export const all_projects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete redesign of company website with new branding",
    startDate: "2025-01-15",
    endDate: "2025-04-30",
    priority: "high",
    status: "in-progress",
    progress: 65,
    teamMembers: [1, 2, 3],
    milestones: [
      { id: 1, name: "Design Mockups", startDate: "2025-01-15", endDate: "2025-02-15", status: "completed" },
      { id: 2, name: "Frontend Development", startDate: "2025-02-16", endDate: "2025-03-30", status: "in-progress" },
      { id: 3, name: "Testing & QA", startDate: "2025-03-31", endDate: "2025-04-30", status: "pending" },
    ],
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description: "Launch native mobile app for iOS and Android",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    priority: "high",
    status: "pending",
    progress: 20,
    teamMembers: [2, 4, 5],
    milestones: [
      { id: 4, name: "Architecture Design", startDate: "2025-02-01", endDate: "2025-02-28", status: "pending" },
      { id: 5, name: "Sprint 1 Development", startDate: "2025-03-01", endDate: "2025-03-31", status: "pending" },
    ],
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate from MySQL to PostgreSQL",
    startDate: "2025-01-20",
    endDate: "2025-03-15",
    priority: "medium",
    status: "in-progress",
    progress: 45,
    teamMembers: [5],
    milestones: [
      { id: 6, name: "Data Backup", startDate: "2025-01-20", endDate: "2025-01-25", status: "completed" },
      { id: 7, name: "Migration", startDate: "2025-01-26", endDate: "2025-03-10", status: "in-progress" },
      { id: 8, name: "Validation", startDate: "2025-03-11", endDate: "2025-03-15", status: "pending" },
    ],
  },
  {
    id: 4,
    name: "Documentation Update",
    description: "Update technical documentation and user guides",
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    priority: "low",
    status: "pending",
    progress: 0,
    teamMembers: [1, 3],
    milestones: [
      { id: 9, name: "Technical Docs", startDate: "2025-03-01", endDate: "2025-03-31", status: "pending" },
    ],
  },
];

// Team members
export const TEAM_MEMBERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Project Manager" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Senior Developer" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "Designer" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "QA Engineer" },
  { id: 5, name: "Emma Davis", email: "emma@example.com", role: "DevOps Engineer" },
];
