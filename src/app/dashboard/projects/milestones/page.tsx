'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';

export const all_projects = [
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

export default function MilestonesPage() {
  const [projects] = useState(all_projects);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const allMilestones = projects.flatMap((project:any) =>
    project.milestones.map((m:any) => ({ ...m, projectName: project.name, projectId: project.id }))
  );

  const filteredMilestones = allMilestones.filter((m:any) =>
    (m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.projectName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedStatus === 'all' || m.status === selectedStatus)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Project Milestones</h1>
          <p className="mt-2 text-slate-600">Track and manage all project milestones</p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Search milestones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="milestone-status">Filter by Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="milestone-status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredMilestones.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-12 text-center">
              <p className="text-slate-500">No milestones found</p>
            </div>
          ) : (
            filteredMilestones.map((milestone:any) => (
              <Card key={`${milestone.projectId}-${milestone.id}`} className="border-slate-200 transition hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{milestone.name}</h3>
                        <Badge className={getStatusColor(milestone.status)}>
                          {getStatusIcon(milestone.status)}
                          <span className="ml-1 capitalize">{milestone.status}</span>
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        Project: <span className="font-medium text-slate-900">{milestone.projectName}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Start: {new Date(milestone.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          End: {new Date(milestone.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
