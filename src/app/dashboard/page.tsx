"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Home,
    FolderOpen,
    CheckSquare,
    Users,
    FileText,
    Calendar,
    BarChart3,
    Settings,
    HelpCircle,
    LogOut,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Clock,
    Target,
    TrendingUp,
    Bell,
    User
} from 'lucide-react';
import TeamflowLogo from "../../../public/teamflow.png"
import {dummyProjects, navigation, stats, recentTasks} from "../../data/Data"

// type SectionKey = 'dashboards' | 'projects' | 'tasks' | 'team' | 'files' | 'calendar' | 'reports';

const Home1 = () => {
   
    const [activePage, setActivePage] = useState("dashboard")

    const [expandedSections, setExpandedSections] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const [currentUser] = useState({
        name: 'John Doe',
        email: 'john.doe@teamflow.ai',
        role: 'Project Manager',
        avatar: '',
        initials: 'JD'
    });

    // const toggleSection = (section: SectionKey) => {
    //     setExpandedSections((prev) => ({
    //         ...prev,
    //         [section]: !prev[section],
    //     }));
    // };

    const navigation = [
        {
            id: 'dashboard',
            icon: Home,
            label: 'Dashboards',
            items: [
                { id: 'personal-dashboard', label: 'Personal Dashboard' },
                { id: 'project-dashboard', label: 'Project Dashboard' },
                { id: 'agency-dashboard', label: 'Agency Dashboard' }
            ]
        },
        {
            id: 'projects',
            icon: FolderOpen,
            label: 'Project Management',
            items: [
                { id: 'all-projects', label: 'All Projects' },
                { id: 'create-project', label: 'Create Project' },
                { id: 'milestones', label: 'Milestones' },
                { id: 'task-overview', label: 'Task Overview' },
                { id: 'timeline-view', label: 'Timeline View (Gantt)' }
            ]
        },
        {
            id: 'tasks',
            icon: CheckSquare,
            label: 'Task Management',
            items: [
                { id: 'my-tasks', label: 'My Tasks' },
                { id: 'subtasks', label: 'Subtasks' },
                { id: 'time-tracking', label: 'Time Tracking' },
                { id: 'labels-tags', label: 'Labels / Tags' }
            ]
        },
        {
            id: 'team',
            icon: Users,
            label: 'Team Collaboration',
            items: [
                { id: 'messages', label: 'Messages / Chat' },
                { id: 'activity-feed', label: 'Activity Feed' },
                { id: 'notifications', label: 'Notifications' }
            ]
        },
        {
            id: 'files',
            icon: FileText,
            label: 'File Management',
            items: [
                { id: 'documents', label: 'Documents' },
                { id: 'uploads', label: 'Uploads' },
                { id: 'version-control', label: 'Version Control' },
                { id: 'file-search', label: 'File Search' }
            ]
        },
        {
            id: 'calendar',
            icon: Calendar,
            label: 'Calendar & Scheduling',
            items: [
                { id: 'calendar-view', label: 'Calendar View' },
                { id: 'meetings', label: 'Meetings' },
                { id: 'deadlines', label: 'Deadlines' }
            ]
        },
        {
            id: 'reports',
            icon: BarChart3,
            label: 'Reports & Analytics',
            items: [
                { id: 'project-reports', label: 'Project Reports' },
                { id: 'team-performance', label: 'Team Performance' },
                { id: 'custom-reports', label: 'Custom Reports' },
                { id: 'export', label: 'Export' }
            ]
        }
    ];

 
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}>
                {/* Logo Section */}
                <div className="px-5 py-5.5 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                        <div className=" flex ">
                            <Image
                                src= {TeamflowLogo}   
                                alt="TeamFlow AI Logo"
                                width={35}          
                                height={35}         
                                priority             
                            />

                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">Teamflow AI</h1>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 px-3 py-4">
                    <nav className="space-y-1">
                        {navigation.map((section) => (
                            <div key={section.id} className="mb-2">
                                <button
                                    onClick={() => ""}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <section.icon className="w-5 h-5" />
                                        <span>{section.label}</span>
                                    </div>
                                {expandedSections ?
                                        <ChevronDown className="w-4 h-4" /> :
                                        <ChevronRight className="w-4 h-4" />
                                    } 
                                </button>

                                 {expandedSections && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {section.items.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setActivePage(item.id)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${activePage === item.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                )} 
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* Bottom Section */}
                <div className="border-t border-gray-200 p-3 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                        <HelpCircle className="w-5 h-5" />
                        <span>Help / Support</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                                <p className="text-sm text-gray-500 lg:flex hidden">Welcome back! Here's what's happening today.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="max-h-96 overflow-y-auto">
                                        <DropdownMenuItem className="flex flex-col items-start py-3">
                                            <div className="font-medium">New task assigned</div>
                                            <div className="text-sm text-gray-500">Design homepage mockup - Website Redesign</div>
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
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="justify-center text-blue-600 cursor-pointer">
                                        View all notifications
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Profile Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {currentUser.initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="hidden md:block text-left">
                                            <div className="text-sm font-medium">{currentUser.name}</div>
                                            <div className="text-xs text-gray-500">{currentUser.role}</div>
                                        </div>
                                        <ChevronDown className="w-4 h-4" />
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
                                    {currentUser.role === 'Project Manager' && (
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

                            <Button variant="outline">Export</Button>
                            <Button>New Project</Button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, idx) => (
                            <Card key={idx}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                            <div className="flex items-center gap-1 mt-2">
                                                <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
                                                <span className="text-xs text-gray-600">{stat.change}</span>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <stat.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Active Projects */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Projects</CardTitle>
                                <CardDescription>Projects currently in progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dummyProjects.map((project) => (
                                        <div key={project.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                                                    <p className="text-sm text-gray-500">Due: {project.dueDate}</p>
                                                </div>
                                                <Badge variant={
                                                    project.status === 'In Progress' ? 'default' :
                                                        project.status === 'Review' ? 'secondary' : 'outline'
                                                }>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-medium">{project.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Tasks */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Tasks</CardTitle>
                                <CardDescription>Your latest task updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTasks.map((task) => (
                                        <div key={task.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${task.status === 'Done' ? 'bg-green-500' :
                                                task.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                                                <p className="text-sm text-gray-500">{task.project}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant={
                                                        task.priority === 'High' ? 'destructive' :
                                                            task.priority === 'Medium' ? 'default' : 'secondary'
                                                    } className="text-xs">
                                                        {task.priority}
                                                    </Badge>
                                                    <span className="text-xs text-gray-500">{task.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Frequently used actions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <FolderOpen className="w-5 h-5" />
                                    <span className="text-sm">New Project</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <CheckSquare className="w-5 h-5" />
                                    <span className="text-sm">Add Task</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className="text-sm">Invite Team</span>
                                </Button>
                                <Button variant="outline" className="h-20 flex flex-col gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    <span className="text-sm">View Reports</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Home1;