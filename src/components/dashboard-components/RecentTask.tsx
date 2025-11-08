"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const TaskCard = ({ task }: any) => {
  const getStatusIcon = (status: any) => {
    switch (status) {
      case "Done":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityVariant = (priority: any) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="group flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-all duration-200 border border-transparent hover:border-border">
      <div className="mt-0.5">{getStatusIcon(task.status)}</div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
          {task.title}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">{task.project}</p>

        <div className="flex items-center gap-1.5 mt-1.5">
          <Badge variant={getPriorityVariant(task.priority)} className="text-[10px] py-0.5 px-1.5">
            {task.priority}
          </Badge>
          <span className="text-[10px] text-muted-foreground px-2 py-0.5 bg-secondary rounded">
            {task.status}
          </span>
          <span className="text-[10px] text-muted-foreground">• {task.time}</span>
        </div>
      </div>
    </div>
  );
};

export default function RecentTasks() {
  const recentTasks = [
    {
      id: 1,
      title: "Implement user authentication flow",
      project: "E-Commerce Platform",
      status: "In Progress",
      priority: "High",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Design system color palette",
      project: "Mobile App Redesign",
      status: "Done",
      priority: "Medium",
      time: "5 hours ago",
    },
  ];

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Tasks</CardTitle>
            <CardDescription className="text-sm">
              Your latest task updates and activity
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {recentTasks.length} Tasks
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {recentTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
