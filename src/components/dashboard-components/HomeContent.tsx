"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FolderOpen,
    CheckSquare,
    Users,
    BarChart3,
    TrendingUp,
} from 'lucide-react';
import { dummyProjects, stats, recentTasks, } from "../../data/Data"


function HomeContent() {
    return (
        <div className='p-6 space-y-6'>
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
    )
}

export default HomeContent
