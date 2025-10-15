"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle2, Clock, Calendar, Filter, TrendingUp } from "lucide-react"

type DeadlineStatus = "Overdue" | "Due Soon" | "Completed" | "Upcoming"
type Priority = "Low" | "Medium" | "High"

interface Deadline {
  id: string
  taskName: string
  projectName: string
  dueDate: string
  status: DeadlineStatus
  priority: Priority
  assignee: string
  description: string
  completedDate?: string
}

const DUMMY_DEADLINES: Deadline[] = [
  {
    id: "1",
    taskName: "Q4 Financial Report",
    projectName: "Finance Department",
    dueDate: "2025-10-14",
    status: "Overdue",
    priority: "High",
    assignee: "Sarah Johnson",
    description: "Complete and submit quarterly financial analysis"
  },
  {
    id: "2",
    taskName: "Product Launch",
    projectName: "Mobile App",
    dueDate: "2025-10-17",
    status: "Due Soon",
    priority: "High",
    assignee: "Mike Chen",
    description: "Official launch of mobile application to app stores"
  },
  {
    id: "3",
    taskName: "Client Presentation",
    projectName: "Website Redesign",
    dueDate: "2025-10-20",
    status: "Due Soon",
    priority: "Medium",
    assignee: "Emily Davis",
    description: "Present final design mockups to client stakeholders"
  },
  {
    id: "4",
    taskName: "API Documentation",
    projectName: "Backend Services",
    dueDate: "2025-10-25",
    status: "Upcoming",
    priority: "Medium",
    assignee: "David Kim",
    description: "Complete REST API documentation with examples"
  },
  {
    id: "5",
    taskName: "Security Audit",
    projectName: "Backend Services",
    dueDate: "2025-10-10",
    status: "Completed",
    priority: "High",
    assignee: "Tom Wilson",
    description: "Comprehensive security review and penetration testing",
    completedDate: "2025-10-09"
  },
  {
    id: "6",
    taskName: "User Testing Phase 1",
    projectName: "Mobile App",
    dueDate: "2025-10-28",
    status: "Upcoming",
    priority: "Low",
    assignee: "Lisa Wong",
    description: "Conduct initial round of user acceptance testing"
  },
  {
    id: "7",
    taskName: "Payment Gateway Integration",
    projectName: "E-commerce Platform",
    dueDate: "2025-10-15",
    status: "Overdue",
    priority: "High",
    assignee: "Alex Rodriguez",
    description: "Complete integration with payment processing service"
  },
  {
    id: "8",
    taskName: "Marketing Campaign Launch",
    projectName: "Website Redesign",
    dueDate: "2025-10-08",
    status: "Completed",
    priority: "Medium",
    assignee: "Rachel Green",
    description: "Execute social media and email marketing campaign",
    completedDate: "2025-10-07"
  },
  {
    id: "9",
    taskName: "Database Migration",
    projectName: "Backend Services",
    dueDate: "2025-10-22",
    status: "Upcoming",
    priority: "High",
    assignee: "David Kim",
    description: "Migrate legacy database to new cloud infrastructure"
  },
  {
    id: "10",
    taskName: "Feature Demo Video",
    projectName: "Mobile App",
    dueDate: "2025-10-18",
    status: "Due Soon",
    priority: "Low",
    assignee: "Mike Chen",
    description: "Create product demo video for marketing materials"
  }
]

const statusColors: Record<DeadlineStatus, { bg: string; text: string; border: string }> = {
  Overdue: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
  "Due Soon": { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  Completed: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  Upcoming: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" }
}

const priorityColors: Record<Priority, string> = {
  Low: "bg-blue-100 text-blue-800 border-blue-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-red-100 text-red-800 border-red-200"
}

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>(DUMMY_DEADLINES)
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const projects = useMemo(() => {
    const projectSet = new Set(deadlines.map(d => d.projectName))
    return Array.from(projectSet)
  }, [deadlines])

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter(deadline => {
      const matchesProject = projectFilter === "all" || deadline.projectName === projectFilter
      
      let matchesDateRange = true
      if (startDate && endDate) {
        const deadlineDate = new Date(deadline.dueDate)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDateRange = deadlineDate >= start && deadlineDate <= end
      }
      
      return matchesProject && matchesDateRange
    })
  }, [deadlines, projectFilter, startDate, endDate])

  const groupedDeadlines = useMemo(() => {
    return filteredDeadlines.reduce((acc, deadline) => {
      if (!acc[deadline.projectName]) {
        acc[deadline.projectName] = []
      }
      acc[deadline.projectName].push(deadline)
      return acc
    }, {} as Record<string, Deadline[]>)
  }, [filteredDeadlines])

  const stats = useMemo(() => {
    const total = deadlines.length
    const completed = deadlines.filter(d => d.status === "Completed").length
    const overdue = deadlines.filter(d => d.status === "Overdue").length
    const dueSoon = deadlines.filter(d => d.status === "Due Soon").length
    return { total, completed, overdue, dueSoon }
  }, [deadlines])

  const getStatusIcon = (status: DeadlineStatus) => {
    switch (status) {
      case "Overdue":
        return <AlertTriangle className="w-4 h-4" />
      case "Due Soon":
        return <Clock className="w-4 h-4" />
      case "Completed":
        return <CheckCircle2 className="w-4 h-4" />
      case "Upcoming":
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deadlines</h1>
          <p className="text-gray-600 mt-1">Track and manage project deadlines</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.dueSoon}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="w-4 h-4 text-gray-500" />
                <Label htmlFor="project" className="text-sm font-medium whitespace-nowrap">Project:</Label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger id="project" className="flex-1">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="startDate" className="text-sm font-medium whitespace-nowrap">From:</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="endDate" className="text-sm font-medium whitespace-nowrap">To:</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
              
              {(startDate || endDate || projectFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate("")
                    setEndDate("")
                    setProjectFilter("all")
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {Object.entries(groupedDeadlines).map(([projectName, projectDeadlines]) => (
            <motion.div
              key={projectName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{projectName}</CardTitle>
                    <Badge variant="secondary">{projectDeadlines.length} tasks</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {projectDeadlines
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .map((deadline, index) => (
                        <motion.div
                          key={deadline.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900">{deadline.taskName}</h3>
                                <Badge
                                  variant="outline"
                                  className={`${statusColors[deadline.status].bg} ${statusColors[deadline.status].text} ${statusColors[deadline.status].border}`}
                                >
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(deadline.status)}
                                    {deadline.status}
                                  </span>
                                </Badge>
                                <Badge variant="outline" className={priorityColors[deadline.priority]}>
                                  {deadline.priority}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600">{deadline.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Due: {new Date(deadline.dueDate).toLocaleDateString()}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-1">
                                  <span>Assigned to: <span className="font-medium text-gray-700">{deadline.assignee}</span></span>
                                </div>
                                {deadline.completedDate && (
                                  <>
                                    <Separator orientation="vertical" className="h-4" />
                                    <div className="flex items-center gap-1 text-green-600">
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>Completed: {new Date(deadline.completedDate).toLocaleDateString()}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {deadline.status === "Overdue" && (
                              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-md">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="text-sm font-medium">Overdue</span>
                              </div>
                            )}
                            
                            {deadline.status === "Due Soon" && (
                              <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium">Due Soon</span>
                              </div>
                            )}
                            
                            {deadline.status === "Completed" && (
                              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-md">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredDeadlines.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No deadlines found matching your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("")
                  setEndDate("")
                  setProjectFilter("all")
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  )
}