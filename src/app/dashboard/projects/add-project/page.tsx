"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Plus, Trash2, Calendar, Users, Flag, Target, DollarSign, FileText, 
  Briefcase, AlertCircle, CheckCircle2, Clock, Link as LinkIcon, 
  Tag, FolderOpen
} from 'lucide-react';
import { NavigationButtons } from '@/components/project-page/NavigationButtons';
import { ProjectSummary } from '@/components/project-page/ProjectSummary';

// Types
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
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface Task {
  id: number;
  title: string;
  assignedTo: number[];
  priority: 'low' | 'medium' | 'high';
  estimatedHours: string;
}

interface Deliverable {
  id: number;
  name: string;
  dueDate: string;
  description: string;
}

// Constants
const TEAM_MEMBERS: TeamMember[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Project Manager' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Senior Developer' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Designer' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'QA Engineer' },
  { id: 5, name: 'Emma Davis', email: 'emma@example.com', role: 'DevOps Engineer' },
];

const PROJECT_CATEGORIES = [
  'Web Development', 'Mobile App',
];

const PROJECT_STATUS_OPTIONS = [
  'Not Started', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'
];

// Error Display Component
const ErrorMessage = ({ message }: { message: string }) => (
  <p className="text-sm text-red-500 flex items-center gap-1">
    <AlertCircle className="h-3 w-3" />
    {message}
  </p>
);

// Section Navigation Component
const SectionNavigation = ({ sections, activeSection, onSectionChange }: any) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {sections.map((section: any) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeSection === section.id
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            <section.icon className="h-5 w-5" />
            <span className="text-xs font-medium whitespace-nowrap">{section.name}</span>
          </button>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Basic Info Section Component
const BasicInfoSection = ({ 
  projectName, setProjectName,
  description, setDescription,
  category, setCategory,
  status, setStatus,
  tags, setTags,
  currentTag, setCurrentTag,
  priority, setPriority,
  riskLevel, setRiskLevel,
  riskDescription, setRiskDescription,
  errors
}: any) => {
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Basic Project Information
        </CardTitle>
        <CardDescription>Provide essential details about your project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">
            Project Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="projectName"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={errors.projectName ? 'border-red-500' : ''}
          />
          {errors.projectName && <ErrorMessage message={errors.projectName} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Project Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your project goals, scope, and deliverables"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && <ErrorMessage message={errors.description} />}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">
              Project Category <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <ErrorMessage message={errors.category} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUS_OPTIONS.map((stat) => (
                  <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Project Tags (Optional)</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add tags (e.g., frontend, urgent, client-facing)"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button onClick={addTag} variant="outline" type="button">
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">×</button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="priority">
              Priority Level <span className="text-red-500">*</span>
            </Label>
            <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    High
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskLevel">Risk Level (Optional)</Label>
            <Select value={riskLevel} onValueChange={(value: 'low' | 'medium' | 'high') => setRiskLevel(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="riskDescription">Risk Description (Optional)</Label>
          <Textarea
            id="riskDescription"
            placeholder="Describe potential risks and mitigation strategies"
            rows={3}
            value={riskDescription}
            onChange={(e) => setRiskDescription(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Timeline Section Component
const TimelineSection = ({ startDate, setStartDate, endDate, setEndDate, estimatedDuration, setEstimatedDuration, errors }: any) => (
  <Card className="border-slate-200 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Project Timeline
      </CardTitle>
      <CardDescription>Define the project schedule and key dates</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && <ErrorMessage message={errors.startDate} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? 'border-red-500' : ''}
          />
          {errors.endDate && <ErrorMessage message={errors.endDate} />}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedDuration">Estimated Duration (Optional)</Label>
        <Input
          id="estimatedDuration"
          placeholder="e.g., 3 months, 12 weeks, 90 days"
          value={estimatedDuration}
          onChange={(e) => setEstimatedDuration(e.target.value)}
        />
      </div>

      {startDate && endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Project Duration: {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Team Section Component
const TeamSection = ({ selectedMembers, setSelectedMembers, projectManager, setProjectManager, stakeholders, setStakeholders, errors }: any) => {
  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev: number[]) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Assignment
        </CardTitle>
        <CardDescription>Select team members and assign roles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectManager">Project Manager (Optional)</Label>
          <Select
            value={projectManager?.toString() || ''}
            onValueChange={(value) => setProjectManager(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project manager" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_MEMBERS.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Team Members <span className="text-red-500">*</span>
          </Label>
          {errors.selectedMembers && <ErrorMessage message={errors.selectedMembers} />}
          <div className="grid gap-3 md:grid-cols-2">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                className={`flex items-start space-x-3 rounded-lg border p-4 transition ${
                  selectedMembers.includes(member.id)
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Checkbox
                  id={`member-${member.id}`}
                  checked={selectedMembers.includes(member.id)}
                  onCheckedChange={() => handleMemberToggle(member.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor={`member-${member.id}`} className="block cursor-pointer font-medium text-slate-900">
                    {member.name}
                  </label>
                  <p className="text-sm text-slate-600">{member.email}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{member.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stakeholders">Stakeholders (Optional)</Label>
          <Textarea
            id="stakeholders"
            placeholder="List key stakeholders, clients, or sponsors (one per line)"
            rows={3}
            value={stakeholders}
            onChange={(e) => setStakeholders(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Budget Section Component
const BudgetSection = ({ budget, setBudget, currency, setCurrency, resources, setResources, tools, setTools }: any) => (
  <Card className="border-slate-200 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Budget & Resources
      </CardTitle>
      <CardDescription>Define budget, resources, and tools required</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="budget">Project Budget (Optional)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="Enter budget amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="PKR">PKR (₨)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resources">Resources Required (Optional)</Label>
        <Textarea
          id="resources"
          placeholder="List hardware, software, licenses, or other resources needed"
          rows={3}
          value={resources}
          onChange={(e) => setResources(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tools">Tools & Technologies (Optional)</Label>
        <Textarea
          id="tools"
          placeholder="List tools, frameworks, platforms, or technologies (e.g., React, AWS, Figma)"
          rows={3}
          value={tools}
          onChange={(e) => setTools(e.target.value)}
        />
      </div>
    </CardContent>
  </Card>
);

// Milestones Component
const MilestonesCard = ({ milestones, setMilestones }: any) => {
  const addMilestone = () => {
    setMilestones((prev: Milestone[]) => [
      ...prev,
      { id: Date.now(), name: '', startDate: '', endDate: '', description: '', status: 'pending' },
    ]);
  };

  const removeMilestone = (id: number) => {
    setMilestones((prev: Milestone[]) => prev.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: any) => {
    setMilestones((prev: Milestone[]) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Milestones
            </CardTitle>
            <CardDescription>Add key milestones to track project progress</CardDescription>
          </div>
          <Button onClick={addMilestone} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <Target className="h-12 w-12 mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500">No milestones added yet</p>
            <p className="text-sm text-slate-400">Click "Add Milestone" to create one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone: Milestone, index: number) => (
              <div key={milestone.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Milestone {index + 1}</h4>
                  <Button
                    onClick={() => removeMilestone(milestone.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label>Milestone Name</Label>
                    <Input
                      placeholder="Enter milestone name"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={milestone.startDate}
                        onChange={(e) => updateMilestone(milestone.id, 'startDate', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={milestone.endDate}
                        onChange={(e) => updateMilestone(milestone.id, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={milestone.status}
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed') =>
                        updateMilestone(milestone.id, 'status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Describe this milestone"
                      rows={2}
                      value={milestone.description}
                      onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Deliverables Component
const DeliverablesCard = ({ deliverables, setDeliverables }: any) => {
  const addDeliverable = () => {
    setDeliverables((prev: Deliverable[]) => [
      ...prev,
      { id: Date.now(), name: '', dueDate: '', description: '' },
    ]);
  };

  const removeDeliverable = (id: number) => {
    setDeliverables((prev: Deliverable[]) => prev.filter((d) => d.id !== id));
  };

  const updateDeliverable = (id: number, field: keyof Deliverable, value: string) => {
    setDeliverables((prev: Deliverable[]) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Project Deliverables
            </CardTitle>
            <CardDescription>Define specific outputs and deliverables</CardDescription>
          </div>
          <Button onClick={addDeliverable} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Deliverable
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {deliverables.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <CheckCircle2 className="h-12 w-12 mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500">No deliverables added yet</p>
            <p className="text-sm text-slate-400">Click "Add Deliverable" to create one</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deliverables.map((deliverable: Deliverable, index: number) => (
              <div key={deliverable.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Deliverable {index + 1}</h4>
                  <Button
                    onClick={() => removeDeliverable(deliverable.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label>Deliverable Name</Label>
                    <Input
                      placeholder="e.g., Final Design Mockups, API Documentation"
                      value={deliverable.name}
                      onChange={(e) => updateDeliverable(deliverable.id, 'name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={deliverable.dueDate}
                      onChange={(e) => updateDeliverable(deliverable.id, 'dueDate', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea
                      placeholder="Describe this deliverable"
                      rows={2}
                      value={deliverable.description}
                      onChange={(e) => updateDeliverable(deliverable.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Tasks Component
const TasksCard = ({ tasks, setTasks }: any) => {
  const addTask = () => {
    setTasks((prev: Task[]) => [
      ...prev,
      { id: Date.now(), title: '', assignedTo: [], priority: 'medium', estimatedHours: '' },
    ]);
  };

  const removeTask = (id: number) => {
    setTasks((prev: Task[]) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: number, field: keyof Task, value: any) => {
    setTasks((prev: Task[]) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Initial Tasks (Optional)
            </CardTitle>
            <CardDescription>Add initial tasks to get started</CardDescription>
          </div>
          <Button onClick={addTask} size="sm" className="gap-2" variant="outline">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
            <FolderOpen className="h-12 w-12 mx-auto text-slate-400 mb-2" />
            <p className="text-slate-500">No tasks added yet</p>
            <p className="text-sm text-slate-400">You can add tasks later</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: Task, index: number) => (
              <div key={task.id} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">Task {index + 1}</h4>
                  <Button
                    onClick={() => removeTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input
                      placeholder="Enter task title"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={task.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high') =>
                          updateTask(task.id, 'priority', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Hours</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 8"
                        value={task.estimatedHours}
                        onChange={(e) => updateTask(task.id, 'estimatedHours', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Additional Info Section Component
const AdditionalInfoSection = ({
  objectives, setObjectives,
  successCriteria, setSuccessCriteria,
  dependencies, setDependencies,
  constraints, setConstraints,
  assumptions, setAssumptions,
  communicationPlan, setCommunicationPlan,
  documentLinks, setDocumentLinks
}: any) => (
  <Card className="border-slate-200 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Briefcase className="h-5 w-5" />
        Additional Project Information
      </CardTitle>
      <CardDescription>Provide detailed planning information (All fields are optional)</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="objectives">Project Objectives</Label>
        <Textarea
          id="objectives"
          placeholder="List the main objectives and goals of this project"
          rows={3}
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successCriteria">Success Criteria</Label>
        <Textarea
          id="successCriteria"
          placeholder="Define how success will be measured (KPIs, metrics, acceptance criteria)"
          rows={3}
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dependencies">Dependencies</Label>
        <Textarea
          id="dependencies"
          placeholder="List any dependencies on other projects, teams, or external factors"
          rows={3}
          value={dependencies}
          onChange={(e) => setDependencies(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="constraints">Constraints</Label>
        <Textarea
          id="constraints"
          placeholder="List any constraints (budget, time, resources, technical limitations)"
          rows={3}
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assumptions">Assumptions</Label>
        <Textarea
          id="assumptions"
          placeholder="List any assumptions being made about the project"
          rows={3}
          value={assumptions}
          onChange={(e) => setAssumptions(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communicationPlan">Communication Plan</Label>
        <Textarea
          id="communicationPlan"
          placeholder="Describe how the team will communicate (meetings, tools, frequency)"
          rows={3}
          value={communicationPlan}
          onChange={(e) => setCommunicationPlan(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documentLinks">
          <LinkIcon className="h-4 w-4 inline mr-1" />
          Related Documents & Links
        </Label>
        <Textarea
          id="documentLinks"
          placeholder="Add links to related documents, wikis, design files, etc. (one per line)"
          rows={3}
          value={documentLinks}
          onChange={(e) => setDocumentLinks(e.target.value)}
        />
      </div>
    </CardContent>
  </Card>
);

// Project Summary Component



// Main Component
export default function CreateProjectPage() {

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Timeline
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  // Priority & Risk
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [riskDescription, setRiskDescription] = useState('');

  // Team & Stakeholders
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [projectManager, setProjectManager] = useState<number | null>(null);
  const [stakeholders, setStakeholders] = useState('');

  // Budget & Resources
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [resources, setResources] = useState('');
  const [tools, setTools] = useState('');

  // Milestones & Deliverables
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  // Additional Information
  const [objectives, setObjectives] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [constraints, setConstraints] = useState('');
  const [assumptions, setAssumptions] = useState('');
  const [communicationPlan, setCommunicationPlan] = useState('');
  const [documentLinks, setDocumentLinks] = useState('');

  // Form State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { id: 0, name: 'Basic Info', icon: FileText },
    { id: 1, name: 'Timeline', icon: Calendar },
    { id: 2, name: 'Team', icon: Users },
    { id: 3, name: 'Budget', icon: DollarSign },
    { id: 4, name: 'Milestones', icon: Target },
    { id: 5, name: 'Additional', icon: Briefcase },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (!category) newErrors.category = 'Category is required';
    if (selectedMembers.length === 0) newErrors.selectedMembers = 'At least one team member is required';
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const formData = {
        projectName, description, category, status, tags, startDate, endDate,
        estimatedDuration, priority, riskLevel, riskDescription, selectedMembers,
        projectManager, stakeholders, budget, currency, resources, tools,
        milestones, deliverables, tasks, objectives, successCriteria,
        dependencies, constraints, assumptions, communicationPlan, documentLinks,
      };
      console.log('Project created:', formData);
      alert('Project created successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Create New Project</h1>
          <p className="mt-2 text-slate-600">
            Complete the form below to set up your project. Fields marked with <span className="text-red-500">*</span> are required.
          </p>
        </div>

        <SectionNavigation 
          sections={sections} 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        {activeSection === 0 && (
          <BasicInfoSection
            projectName={projectName} setProjectName={setProjectName}
            description={description} setDescription={setDescription}
            category={category} setCategory={setCategory}
            status={status} setStatus={setStatus}
            tags={tags} setTags={setTags}
            currentTag={currentTag} setCurrentTag={setCurrentTag}
            priority={priority} setPriority={setPriority}
            riskLevel={riskLevel} setRiskLevel={setRiskLevel}
            riskDescription={riskDescription} setRiskDescription={setRiskDescription}
            errors={errors}
          />
        )}

        {activeSection === 1 && (
          <TimelineSection
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            estimatedDuration={estimatedDuration} setEstimatedDuration={setEstimatedDuration}
            errors={errors}
          />
        )}

        {activeSection === 2 && (
          <TeamSection
            selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers}
            projectManager={projectManager} setProjectManager={setProjectManager}
            stakeholders={stakeholders} setStakeholders={setStakeholders}
            errors={errors}
          />
        )}

        {activeSection === 3 && (
          <BudgetSection
            budget={budget} setBudget={setBudget}
            currency={currency} setCurrency={setCurrency}
            resources={resources} setResources={setResources}
            tools={tools} setTools={setTools}
          />
        )}

        {activeSection === 4 && (
          <div className="space-y-6">
            <MilestonesCard milestones={milestones} setMilestones={setMilestones} />
            <DeliverablesCard deliverables={deliverables} setDeliverables={setDeliverables} />
            <TasksCard tasks={tasks} setTasks={setTasks} />
          </div>
        )}

        {activeSection === 5 && (
          <AdditionalInfoSection
            objectives={objectives} setObjectives={setObjectives}
            successCriteria={successCriteria} setSuccessCriteria={setSuccessCriteria}
            dependencies={dependencies} setDependencies={setDependencies}
            constraints={constraints} setConstraints={setConstraints}
            assumptions={assumptions} setAssumptions={setAssumptions}
            communicationPlan={communicationPlan} setCommunicationPlan={setCommunicationPlan}
            documentLinks={documentLinks} setDocumentLinks={setDocumentLinks}
          />
        )}

        <NavigationButtons
          activeSection={activeSection}
          sections={sections}
          setActiveSection={setActiveSection}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />

        <ProjectSummary
          projectName={projectName}
          category={category}
          priority={priority}
          selectedMembers={selectedMembers}
          startDate={startDate}
          endDate={endDate}
          milestones={milestones}
          deliverables={deliverables}
          budget={budget}
          currency={currency}
        />
      </div>
    </div>
  );
}