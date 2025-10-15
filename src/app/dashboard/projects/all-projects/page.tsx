'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Trash2, Edit, Calendar, Users, Flag, CheckCircle2, Clock, AlertCircle, Plus} from 'lucide-react';



export const all_projects= [
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


const getPriorityColor = (priority:any) =>{
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status:any) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status:any) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    case 'pending': return <AlertCircle className="h-4 w-4" />;
    default: return null;
  }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState(all_projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const filteredProjects = projects.filter((project:any) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || project.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const deleteProject = (id:any, e:any) => {
    e.stopPropagation();
    setProjects((prev:any) => prev.filter((p:any) => p.id !== id));
  };

  const openProjectDetail = (project:any) => {
    setSelectedProject(project);
    setShowDialog(true);
  };

  const getTeamMemberNames = (memberIds:any) =>
    memberIds.map((id:any) => TEAM_MEMBERS.find((m:any) => m.id === id)?.name).join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & New Project Button */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">All Projects</h1>
            <p className="mt-2 text-slate-600">Manage and track all your projects in one place</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="filter-priority">Priority</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger id="filter-priority"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger id="filter-status"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500">No projects found matching your filters</p>
            </div>
          ) : (
            filteredProjects.map((project:any) => (
              <Card
                key={project.id}
                className="group cursor-pointer border-slate-200 transition hover:shadow-lg hover:border-slate-300"
                onClick={() => openProjectDetail(project)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{project.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => deleteProject(project.id, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(project.priority)}><Flag className="mr-1 h-3 w-3" />{project.priority}</Badge>
                    <Badge className={getStatusColor(project.status)}>{getStatusIcon(project.status)}<span className="ml-1 capitalize">{project.status}</span></Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{project.teamMembers.length} team members</span>
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-medium text-slate-500">{project.milestones.length} milestones</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Dialog for Project Details */}
        {selectedProject && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedProject}</DialogTitle>
                <DialogDescription>{selectedProject}</DialogDescription>
              </DialogHeader>
              {/* Project details content can be here */}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
