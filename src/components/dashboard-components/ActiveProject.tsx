"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, CheckCircle2, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

const ActiveProjectCard = ({ project }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Review":
        return "bg-purple-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getProgressColor = (progress: any) => {
    if (progress >= 75) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (progress >= 50) return "bg-gradient-to-r from-blue-500 to-cyan-600";
    if (progress >= 25) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-600";
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-card to-card/50 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-4 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              <Badge className={`${getStatusColor(project.status)} text-white border-0 shadow-sm text-xs`}>
                {project.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{project.description}</p>
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
            >
              <MoreVertical className="w-3 h-3 text-muted-foreground" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-1 w-36 bg-popover border border-border rounded-lg shadow-lg py-1 z-20">
                <button className="w-full px-3 py-1 text-left text-xs hover:bg-accent flex items-center gap-2">
                  <Eye className="w-3 h-3" /> View
                </button>
                <button className="w-full px-3 py-1 text-left text-xs hover:bg-accent flex items-center gap-2">
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button className="w-full px-3 py-1 text-left text-xs hover:bg-accent flex items-center gap-2 text-destructive">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-accent/50 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Due</span>
            </div>
            <p className="text-xs font-semibold text-foreground">{project.dueDate}</p>
          </div>

          <div className="bg-accent/50 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Users className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Team</span>
            </div>
            <p className="text-xs font-semibold text-foreground">{project.team}</p>
          </div>

          <div className="bg-accent/50 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span className="text-[10px] text-muted-foreground">Tasks</span>
            </div>
            <p className="text-xs font-semibold text-foreground">
              {project.completedTasks}/{project.totalTasks}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-semibold text-foreground">{project.progress}%</span>
          </div>
          <div className="relative w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className={`${getProgressColor(project.progress)} h-2 rounded-full transition-all duration-500 relative overflow-hidden`}
              style={{ width: `${project.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-border animate-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1">Recent Activity</h4>
                <div className="space-y-1">
                  {project.recentActivity.map((activity: any, idx: any) => (
                    <div key={idx} className="flex items-start gap-1 text-xs">
                      <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                      <p className="text-muted-foreground">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1 pt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-muted-foreground">
                  On track to complete by {project.dueDate}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ActiveProjects() {
  const dummyProjects = [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "Building a modern e-commerce solution with React and Node.js",
      status: "In Progress",
      progress: 68,
      dueDate: "Dec 15, 2025",
      team: 5,
      completedTasks: 23,
      totalTasks: 34,
      recentActivity: [
        "Payment gateway integration completed",
        "UI components review scheduled",
        "Database optimization in progress",
      ],
    },
    {
      id: 2,
      name: "Mobile App Redesign",
      description: "Complete UI/UX overhaul for iOS and Android applications",
      status: "Review",
      progress: 85,
      dueDate: "Nov 28, 2025",
      team: 3,
      completedTasks: 17,
      totalTasks: 20,
      recentActivity: [
        "Final mockups approved by stakeholders",
        "Animation library integrated",
        "Beta testing phase started",
      ],
    },
  ];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Active Projects</CardTitle>
            <CardDescription className="text-sm">Click on any project to view more details</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {dummyProjects.length} Projects
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {dummyProjects.map((project) => (
            <ActiveProjectCard key={project.id} project={project} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
