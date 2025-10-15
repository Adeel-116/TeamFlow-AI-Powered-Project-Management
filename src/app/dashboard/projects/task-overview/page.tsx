'use client'

import { useState, useMemo } from "react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Calendar, CheckCircle2, Clock, AlertCircle, GripVertical } from "lucide-react"

type Priority = "Low" | "Medium" | "High"
type Status = "Todo" | "In Progress" | "Done"

interface Task {
  id: string
  title: string
  project: string
  priority: Priority
  status: Status
  assignee: {
    name: string
    avatar?: string
  }
  dueDate: string
  description: string
}

const DUMMY_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    project: "Website Redesign",
    priority: "High",
    status: "In Progress",
    assignee: { name: "Sarah Johnson" },
    dueDate: "2025-10-20",
    description: "Create mockups and prototypes for the new landing page with improved UX"
  },
  {
    id: "2",
    title: "Implement authentication system",
    project: "Mobile App",
    priority: "High",
    status: "In Progress",
    assignee: { name: "Mike Chen" },
    dueDate: "2025-10-18",
    description: "Set up OAuth and JWT-based authentication for the mobile application"
  },
  {
    id: "3",
    title: "Write API documentation",
    project: "Backend Services",
    priority: "Medium",
    status: "Todo",
    assignee: { name: "Emily Davis" },
    dueDate: "2025-10-25",
    description: "Document all REST API endpoints with examples and response schemas"
  },
  {
    id: "4",
    title: "Fix payment gateway bug",
    project: "E-commerce Platform",
    priority: "High",
    status: "Todo",
    assignee: { name: "Alex Rodriguez" },
    dueDate: "2025-10-16",
    description: "Resolve the issue causing payment failures on checkout"
  },
  {
    id: "5",
    title: "Update user dashboard",
    project: "Website Redesign",
    priority: "Medium",
    status: "Done",
    assignee: { name: "Sarah Johnson" },
    dueDate: "2025-10-10",
    description: "Implement new dashboard layout with updated widgets and analytics"
  },
  {
    id: "6",
    title: "Conduct user testing",
    project: "Mobile App",
    priority: "Low",
    status: "Todo",
    assignee: { name: "Lisa Wong" },
    dueDate: "2025-10-28",
    description: "Organize and conduct usability testing sessions with 10 users"
  },
  {
    id: "7",
    title: "Optimize database queries",
    project: "Backend Services",
    priority: "Medium",
    status: "In Progress",
    assignee: { name: "David Kim" },
    dueDate: "2025-10-22",
    description: "Improve query performance and add proper indexing"
  },
  {
    id: "8",
    title: "Create marketing materials",
    project: "Website Redesign",
    priority: "Low",
    status: "Done",
    assignee: { name: "Rachel Green" },
    dueDate: "2025-10-08",
    description: "Design banners, social media posts, and email templates"
  },
  {
    id: "9",
    title: "Implement push notifications",
    project: "Mobile App",
    priority: "High",
    status: "Todo",
    assignee: { name: "Mike Chen" },
    dueDate: "2025-10-17",
    description: "Add push notification support for iOS and Android"
  },
  {
    id: "10",
    title: "Security audit",
    project: "Backend Services",
    priority: "High",
    status: "Done",
    assignee: { name: "Tom Wilson" },
    dueDate: "2025-10-05",
    description: "Perform comprehensive security review and penetration testing"
  }
]

const priorityColors: Record<Priority, string> = {
  Low: "bg-blue-100 text-blue-800 border-blue-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-red-100 text-red-800 border-red-200"
}

const statusColumns: Status[] = ["Todo", "In Progress", "Done"]

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Done"
  const initials = task.assignee.name
    .split(" ")
    .map(n => n[0])
    .join("")

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${isDragging ? "opacity-50 rotate-3" : ""}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight flex-1">{task.title}</h3>
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-grab" />
        </div>
        
        <p className="text-xs text-gray-600">{task.project}</p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
            {task.priority}
          </Badge>
          <Avatar className="w-6 h-6">
            <AvatarImage src={task.assignee.avatar} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
          {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function SortableTaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <TaskCard task={task} isDragging={isDragging} />
    </div>
  )
}

function Column({ status, tasks, onTaskClick }: { status: Status; tasks: Task[]; onTaskClick: (task: Task) => void }) {
  const { setNodeRef } = useSortable({ id: status })

  const statusIcons = {
    Todo: <Clock className="w-4 h-4" />,
    "In Progress": <AlertCircle className="w-4 h-4" />,
    Done: <CheckCircle2 className="w-4 h-4" />
  }

  const statusColors = {
    Todo: "bg-gray-100",
    "In Progress": "bg-blue-50",
    Done: "bg-green-50"
  }

  return (
    <div ref={setNodeRef} className="flex flex-col h-full">
      <div className={`flex items-center gap-2 p-3 rounded-t-lg ${statusColors[status]}`}>
        {statusIcons[status]}
        <h2 className="font-semibold text-sm">{status}</h2>
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>
      <div className="flex-1 p-3 bg-gray-50 rounded-b-lg min-h-[500px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map(task => (
              <SortableTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(DUMMY_TASKS)
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const projects = useMemo(() => {
    const projectSet = new Set(tasks.map(t => t.project))
    return Array.from(projectSet)
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.project.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProject = projectFilter === "all" || task.project === projectFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
      return matchesSearch && matchesProject && matchesPriority
    })
  }, [tasks, searchQuery, projectFilter, priorityFilter])

  const tasksByStatus = useMemo(() => {
    return statusColumns.reduce((acc, status) => {
      acc[status] = filteredTasks.filter(task => task.status === status)
      return acc
    }, {} as Record<Status, Task[]>)
  }, [filteredTasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const inProgress = tasks.filter(t => t.status === "In Progress").length
    const completed = tasks.filter(t => t.status === "Done").length
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== "Done").length
    return { total, inProgress, completed, overdue }
  }, [tasks])

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id)
    setActiveTask(task || null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Status

    if (statusColumns.includes(newStatus)) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      )
    }
  }

  function handleTaskClick(task: Task) {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Overview</h1>
          <p className="text-gray-600 mt-1">Manage and track all project tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
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
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by project" />
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
              
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {statusColumns.map(status => (
              <Column
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>

        {/* Task Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>{selectedTask?.project}</DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Priority:</span>
                  <Badge variant="outline" className={priorityColors[selectedTask.priority]}>
                    {selectedTask.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <Badge variant="secondary">{selectedTask.status}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Assigned to:</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {selectedTask.assignee.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedTask.assignee.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                  <p className="text-sm text-gray-700">{selectedTask.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}