'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Milestone {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Project Manager' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Senior Developer' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Designer' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'QA Engineer' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'DevOps Engineer' },
];

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [resources, setResources] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: Date.now(), name: '', startDate: '', endDate: '' },
    ]);
  };

  const removeMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        projectName,
        description,
        startDate,
        endDate,
        priority,
        selectedMembers,
        milestones,
        resources,
      };
      console.log('Project created:', formData);
      alert('Project created successfully!');
    }
  };

  const handleCancel = () => {
    setProjectName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setPriority('medium');
    setSelectedMembers([]);
    setMilestones([]);
    setResources('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Create New Project</h1>
          <p className="mt-2 text-slate-600">
            Set up your project details, team assignments, and milestones to get started.
          </p>
        </div>

        {/* Project Details */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide basic information about your project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={errors.projectName ? 'border-red-500' : ''}
              />
              {errors.projectName && (
                <p className="text-sm text-red-500">{errors.projectName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Assign Team Members</CardTitle>
            <CardDescription>
              Select team members to assign to this project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {TEAM_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start space-x-3 rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
                >
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => handleMemberToggle(member.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`member-${member.id}`}
                      className="block cursor-pointer font-medium text-slate-900"
                    >
                      {member.name}
                    </label>
                    <p className="text-sm text-slate-600">{member.email}</p>
                    <p className="text-xs font-medium text-slate-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>
                  Add key milestones to track project progress
                </CardDescription>
              </div>
              <Button onClick={addMilestone} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {milestones.length === 0 ? (
              <p className="text-center text-slate-500">
                No milestones added yet. Click "Add Milestone" to create one.
              </p>
            ) : (
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-end md:gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`milestone-name-${milestone.id}`} className="text-sm">
                        Milestone Name
                      </Label>
                      <Input
                        id={`milestone-name-${milestone.id}`}
                        placeholder="Enter milestone name"
                        value={milestone.name}
                        onChange={(e) =>
                          updateMilestone(milestone.id, 'name', e.target.value)
                        }
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`milestone-start-${milestone.id}`} className="text-sm">
                        Start Date
                      </Label>
                      <Input
                        id={`milestone-start-${milestone.id}`}
                        type="date"
                        value={milestone.startDate}
                        onChange={(e) =>
                          updateMilestone(milestone.id, 'startDate', e.target.value)
                        }
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`milestone-end-${milestone.id}`} className="text-sm">
                        End Date
                      </Label>
                      <Input
                        id={`milestone-end-${milestone.id}`}
                        type="date"
                        value={milestone.endDate}
                        onChange={(e) =>
                          updateMilestone(milestone.id, 'endDate', e.target.value)
                        }
                      />
                    </div>

                    <Button
                      onClick={() => removeMilestone(milestone.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Resources/Budget</CardTitle>
            <CardDescription>
              List resources, tools, or budget requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="resources">Resources & Tools Required</Label>
              <Textarea
                id="resources"
                placeholder="Enter resources, tools, software, or budget requirements..."
                rows={4}
                value={resources}
                onChange={(e) => setResources(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={handleCancel} className="px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-6">
            Save Project
          </Button>
        </div>
      </div>
    </div>
  );
}
