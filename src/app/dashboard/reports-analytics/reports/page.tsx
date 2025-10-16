"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, BarChart3, Filter, FolderKanban, CheckCircle2, Clock, Pause, Target } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  LineController
} from "chart.js"

// Register ALL required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  LineController
)

interface ProjectReport {
  id: string
  name: string
  status: "Completed" | "In Progress" | "On Hold"
  completion: number
  startDate: string
  deadline: string
  budget: number
  spent: number
}

interface ProgressTrend {
  month: string
  completed: number
  inProgress: number
  onHold: number
}

const DUMMY_PROJECTS: ProjectReport[] = [
  {
    id: "1",
    name: "Website Redesign",
    status: "In Progress",
    completion: 75,
    startDate: "2025-08-01",
    deadline: "2025-11-30",
    budget: 50000,
    spent: 37500
  },
  {
    id: "2",
    name: "Mobile App Development",
    status: "In Progress",
    completion: 60,
    startDate: "2025-07-15",
    deadline: "2025-12-15",
    budget: 120000,
    spent: 72000
  },
  {
    id: "3",
    name: "E-commerce Platform",
    status: "Completed",
    completion: 100,
    startDate: "2025-05-01",
    deadline: "2025-10-01",
    budget: 80000,
    spent: 78000
  },
  {
    id: "4",
    name: "Backend API Refactor",
    status: "In Progress",
    completion: 45,
    startDate: "2025-09-01",
    deadline: "2025-12-31",
    budget: 40000,
    spent: 18000
  },
  {
    id: "5",
    name: "Marketing Campaign",
    status: "Completed",
    completion: 100,
    startDate: "2025-06-01",
    deadline: "2025-09-30",
    budget: 30000,
    spent: 29500
  },
  {
    id: "6",
    name: "Database Migration",
    status: "On Hold",
    completion: 30,
    startDate: "2025-08-15",
    deadline: "2025-11-15",
    budget: 25000,
    spent: 7500
  },
  {
    id: "7",
    name: "CRM Integration",
    status: "In Progress",
    completion: 80,
    startDate: "2025-07-01",
    deadline: "2025-10-31",
    budget: 35000,
    spent: 28000
  },
  {
    id: "8",
    name: "Security Audit",
    status: "Completed",
    completion: 100,
    startDate: "2025-08-01",
    deadline: "2025-09-15",
    budget: 15000,
    spent: 14800
  }
]

const PROGRESS_TREND: ProgressTrend[] = [
  { month: "May", completed: 2, inProgress: 3, onHold: 0 },
  { month: "Jun", completed: 3, inProgress: 4, onHold: 0 },
  { month: "Jul", completed: 3, inProgress: 5, onHold: 0 },
  { month: "Aug", completed: 4, inProgress: 4, onHold: 1 },
  { month: "Sep", completed: 5, inProgress: 3, onHold: 1 },
  { month: "Oct", completed: 3, inProgress: 4, onHold: 1 }
]

export default function ProjectReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [projects] = useState<ProjectReport[]>(DUMMY_PROJECTS)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  const pieChartRef = useRef<HTMLCanvasElement>(null)
  const trendChartRef = useRef<HTMLCanvasElement>(null)
  const pieChartInstance = useRef<ChartJS | null>(null)
  const trendChartInstance = useRef<ChartJS | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      const matchesProject = projectFilter === "all" || project.id === projectFilter
      
      let matchesDateRange = true
      if (startDate && endDate) {
        const projectDate = new Date(project.startDate)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDateRange = projectDate >= start && projectDate <= end
      }
      
      return matchesStatus && matchesProject && matchesDateRange
    })
  }, [projects, statusFilter, projectFilter, startDate, endDate])

  const stats = useMemo(() => {
    const total = projects.length
    const completed = projects.filter(p => p.status === "Completed").length
    const inProgress = projects.filter(p => p.status === "In Progress").length
    const onHold = projects.filter(p => p.status === "On Hold").length
    return { total, completed, inProgress, onHold }
  }, [projects])

  const statusBreakdown = useMemo(() => {
    return {
      labels: ["Completed", "In Progress", "On Hold"],
      data: [stats.completed, stats.inProgress, stats.onHold],
      colors: ["#10b981", "#3b82f6", "#f59e0b"]
    }
  }, [stats])

  useEffect(() => {
    if (!mounted || !pieChartRef.current) return

    if (pieChartInstance.current) {
      pieChartInstance.current.destroy()
    }

    const ctx = pieChartRef.current.getContext("2d")
    if (ctx) {
      pieChartInstance.current = new ChartJS(ctx, {
        type: "doughnut",
        data: {
          labels: statusBreakdown.labels,
          datasets: [{
            data: statusBreakdown.data,
            backgroundColor: statusBreakdown.colors,
            borderWidth: 2,
            borderColor: "#fff"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || ""
                  const value = context.parsed || 0
                  const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                }
              }
            }
          }
        }
      })
    }

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy()
      }
    }
  }, [mounted, statusBreakdown])

  useEffect(() => {
    if (!mounted || !trendChartRef.current) return

    if (trendChartInstance.current) {
      trendChartInstance.current.destroy()
    }

    const ctx = trendChartRef.current.getContext("2d")
    if (ctx) {
      trendChartInstance.current = new ChartJS(ctx, {
        type: "line",
        data: {
          labels: PROGRESS_TREND.map(t => t.month),
          datasets: [
            {
              label: "Completed",
              data: PROGRESS_TREND.map(t => t.completed),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.4,
              fill: true
            },
            {
              label: "In Progress",
              data: PROGRESS_TREND.map(t => t.inProgress),
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: true
            },
            {
              label: "On Hold",
              data: PROGRESS_TREND.map(t => t.onHold),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                padding: 15,
                font: { size: 12 }
              }
            },
            tooltip: {
              mode: "index",
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      })
    }

    return () => {
      if (trendChartInstance.current) {
        trendChartInstance.current.destroy()
      }
    }
  }, [mounted])

  const handleDownloadReport = () => {
    console.log("Downloading report as CSV...")
    alert("Report download feature - Connect to backend for actual implementation")
  }

  const clearFilters = () => {
    setStatusFilter("all")
    setProjectFilter("all")
    setStartDate("")
    setEndDate("")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Reports</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into project performance</p>
          </div>
          <Button onClick={handleDownloadReport} className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
                  <FolderKanban className="w-5 h-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                <p className="text-xs text-gray-500 mt-1">All active projects</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-gray-500 mt-1">Successfully finished</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">On Hold</CardTitle>
                  <Pause className="w-5 h-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">{stats.onHold}</div>
                <p className="text-xs text-gray-500 mt-1">Temporarily paused</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <CardTitle>Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {(statusFilter !== "all" || projectFilter !== "all" || startDate || endDate) && (
              <div className="mt-4">
                <Button variant="outline" onClick={clearFilters} size="sm">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  <CardTitle>Project Status Breakdown</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <canvas ref={pieChartRef}></canvas>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <CardTitle>Performance Trend</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <canvas ref={trendChartRef}></canvas>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : project.status === "In Progress"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Completion</p>
                        <p className="font-medium text-gray-900">{project.completion}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Budget</p>
                        <p className="font-medium text-gray-900">${project.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Spent</p>
                        <p className="font-medium text-gray-900">${project.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deadline</p>
                        <p className="font-medium text-gray-900">{new Date(project.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}