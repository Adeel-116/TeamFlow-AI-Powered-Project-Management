"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Award, Clock, Filter, BarChart3, Target, CheckCircle2 } from "lucide-react"
import * as Chart from "chart.js";
const { Chart: ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } = Chart

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend)


type PerformanceStatus = "Excellent" | "Good" | "Needs Improvement"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  tasksCompleted: number
  tasksInProgress: number
  efficiency: number
  status: PerformanceStatus
  projects: string[]
  recentActivity: Array<{ date: string; activity: string }>
}

const DUMMY_TEAM_DATA: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Developer",
    tasksCompleted: 45,
    tasksInProgress: 5,
    efficiency: 92,
    status: "Excellent",
    projects: ["Website Redesign", "Mobile App", "CRM Integration"],
    recentActivity: [
      { date: "2025-10-14", activity: "Completed API integration module" },
      { date: "2025-10-13", activity: "Code review for authentication feature" },
      { date: "2025-10-12", activity: "Fixed critical payment gateway bug" }
    ]
  },
  {
    id: "2",
    name: "Mike Chen",
    role: "Full Stack Developer",
    tasksCompleted: 38,
    tasksInProgress: 7,
    efficiency: 85,
    status: "Excellent",
    projects: ["Mobile App", "Backend API", "E-commerce Platform"],
    recentActivity: [
      { date: "2025-10-14", activity: "Implemented user dashboard" },
      { date: "2025-10-13", activity: "Optimized database queries" },
      { date: "2025-10-11", activity: "Sprint planning session" }
    ]
  },
  {
    id: "3",
    name: "Emily Davis",
    role: "UX/UI Designer",
    tasksCompleted: 42,
    tasksInProgress: 4,
    efficiency: 88,
    status: "Excellent",
    projects: ["Website Redesign", "Mobile App", "Marketing Campaign"],
    recentActivity: [
      { date: "2025-10-14", activity: "Completed landing page mockups" },
      { date: "2025-10-13", activity: "User research interviews" },
      { date: "2025-10-12", activity: "Design system updates" }
    ]
  },
  {
    id: "4",
    name: "David Kim",
    role: "Backend Developer",
    tasksCompleted: 35,
    tasksInProgress: 8,
    efficiency: 78,
    status: "Good",
    projects: ["Backend API", "Database Migration", "Security Audit"],
    recentActivity: [
      { date: "2025-10-14", activity: "API documentation update" },
      { date: "2025-10-13", activity: "Database schema optimization" },
      { date: "2025-10-10", activity: "Security vulnerability fix" }
    ]
  },
  {
    id: "5",
    name: "Lisa Wong",
    role: "QA Engineer",
    tasksCompleted: 40,
    tasksInProgress: 6,
    efficiency: 82,
    status: "Good",
    projects: ["Mobile App", "E-commerce Platform", "CRM Integration"],
    recentActivity: [
      { date: "2025-10-14", activity: "Automated test suite creation" },
      { date: "2025-10-13", activity: "Bug verification and closure" },
      { date: "2025-10-12", activity: "Performance testing" }
    ]
  },
  {
    id: "6",
    name: "Alex Rodriguez",
    role: "Frontend Developer",
    tasksCompleted: 28,
    tasksInProgress: 9,
    efficiency: 68,
    status: "Needs Improvement",
    projects: ["Website Redesign", "E-commerce Platform"],
    recentActivity: [
      { date: "2025-10-14", activity: "Component library updates" },
      { date: "2025-10-12", activity: "Responsive design fixes" },
      { date: "2025-10-10", activity: "Team standup meeting" }
    ]
  },
  {
    id: "7",
    name: "Rachel Green",
    role: "Product Manager",
    tasksCompleted: 32,
    tasksInProgress: 5,
    efficiency: 80,
    status: "Good",
    projects: ["Marketing Campaign", "Website Redesign", "Mobile App"],
    recentActivity: [
      { date: "2025-10-14", activity: "Sprint planning facilitation" },
      { date: "2025-10-13", activity: "Stakeholder presentation" },
      { date: "2025-10-12", activity: "Product roadmap update" }
    ]
  },
  {
    id: "8",
    name: "Tom Wilson",
    role: "DevOps Engineer",
    tasksCompleted: 36,
    tasksInProgress: 4,
    efficiency: 84,
    status: "Excellent",
    projects: ["Backend API", "Database Migration", "Security Audit"],
    recentActivity: [
      { date: "2025-10-14", activity: "CI/CD pipeline optimization" },
      { date: "2025-10-13", activity: "Infrastructure monitoring setup" },
      { date: "2025-10-11", activity: "Server deployment automation" }
    ]
  }
]

const statusColors: Record<PerformanceStatus, string> = {
  Excellent: "bg-green-100 text-green-800 border-green-200",
  Good: "bg-blue-100 text-blue-800 border-blue-200",
  "Needs Improvement": "bg-yellow-100 text-yellow-800 border-yellow-200"
}

export default function TeamPerformancePage() {
  const [teamData, setTeamData] = useState<TeamMember[]>(DUMMY_TEAM_DATA)
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  const projects = useMemo(() => {
    const projectSet = new Set<string>()
    teamData.forEach(member => {
      member.projects.forEach(project => projectSet.add(project))
    })
    return Array.from(projectSet)
  }, [teamData])

  const roles = useMemo(() => {
    const roleSet = new Set(teamData.map(m => m.role))
    return Array.from(roleSet)
  }, [teamData])

  const filteredTeam = useMemo(() => {
    return teamData.filter(member => {
      const matchesProject = projectFilter === "all" || member.projects.includes(projectFilter)
      const matchesRole = roleFilter === "all" || member.role === roleFilter
      return matchesProject && matchesRole
    })
  }, [teamData, projectFilter, roleFilter])

  const stats = useMemo(() => {
    const totalMembers = teamData.length
    const totalCompleted = teamData.reduce((sum, m) => sum + m.tasksCompleted, 0)
    const totalTasks = teamData.reduce((sum, m) => sum + m.tasksCompleted + m.tasksInProgress, 0)
    const avgCompletion = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0
    const topPerformer = [...teamData].sort((a, b) => b.efficiency - a.efficiency)[0]
    const tasksInProgress = teamData.reduce((sum, m) => sum + m.tasksInProgress, 0)
    
    return { totalMembers, avgCompletion, topPerformer, tasksInProgress }
  }, [teamData])

  const topPerformers = useMemo(() => {
    return [...teamData]
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5)
  }, [teamData])

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chartInstance.current = new ChartJS(ctx, {
          type: "bar",
          data: {
            labels: topPerformers.map(m => m.name.split(" ")[0]),
            datasets: [
              {
                label: "Tasks Completed",
                data: topPerformers.map(m => m.tasksCompleted),
                backgroundColor: "rgba(59, 130, 246, 0.8)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1
              },
              {
                label: "Tasks In Progress",
                data: topPerformers.map(m => m.tasksInProgress),
                backgroundColor: "rgba(245, 158, 11, 0.8)",
                borderColor: "rgb(245, 158, 11)",
                borderWidth: 1
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
                  stepSize: 10
                }
              }
            }
          }
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [topPerformers])

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member)
    setDialogOpen(true)
  }

  const clearFilters = () => {
    setProjectFilter("all")
    setRoleFilter("all")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Performance</h1>
          <p className="text-gray-600 mt-1">Analyze productivity and team member contributions</p>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stats.totalMembers}</div>
                <p className="text-xs text-gray-500 mt-1">Active team members</p>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Completion</CardTitle>
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{stats.avgCompletion}%</div>
                <p className="text-xs text-gray-500 mt-1">Team average rate</p>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Top Performer</CardTitle>
                  <Award className="w-5 h-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-gray-900">{stats.topPerformer?.name}</div>
                <p className="text-xs text-gray-500 mt-1">{stats.topPerformer?.efficiency}% efficiency</p>
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
                  <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.tasksInProgress}</div>
                <p className="text-xs text-gray-500 mt-1">Active tasks</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project</Label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger id="project">
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

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                {(projectFilter !== "all" || roleFilter !== "all") && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <CardTitle>Top 5 Performers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <canvas ref={chartRef}></canvas>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-center">In Progress</TableHead>
                      <TableHead className="text-center">Efficiency</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeam.map((member, index) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleMemberClick(member)}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{member.role}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-600">{member.tasksCompleted}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-600">{member.tasksInProgress}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-600">{member.efficiency}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={statusColors[member.status]}>
                            {member.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedMember?.avatar} />
                  <AvatarFallback>
                    {selectedMember?.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl">{selectedMember?.name}</p>
                  <p className="text-sm text-gray-600 font-normal">{selectedMember?.role}</p>
                </div>
              </DialogTitle>
              <DialogDescription>Detailed performance statistics and activity log</DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 py-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{selectedMember.tasksCompleted}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">In Progress</p>
                      <p className="text-2xl font-bold text-orange-600">{selectedMember.tasksInProgress}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Efficiency</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedMember.efficiency}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Projects</p>
                      <p className="text-2xl font-bold text-purple-600">{selectedMember.projects.length}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Active Projects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.projects.map((project, idx) => (
                      <Badge key={idx} variant="secondary">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {selectedMember.recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.activity}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}