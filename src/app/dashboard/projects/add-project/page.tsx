"use client"
import { useState } from 'react';
import { 
  Calendar, Users, Flag, Target, DollarSign, FileText, 
  Briefcase, Link as LinkIcon, 
} from 'lucide-react';
import { NavigationButtons } from '@/components/project-page/NavigationButtons';
import { ProjectSummary } from '@/components/project-page/ProjectSummary';
import AdditionalInfoSection from '@/components/project-page/AdditionalInfoSection';
import MilestonesCard from '@/components/project-page/MileStoneCard';
import DeliverablesCard from '@/components/project-page/Deliverables';
import BasicInfoSection from '@/components/project-page/BasicInfo';
import SectionNavigation from '@/components/project-page/SectionNavigation';
import BudgetSection from '@/components/project-page/BudgetSection';
import TimelineSection from '@/components/project-page/TimelineSection';
import TasksCard from '@/components/project-page/TaskCard';

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

type ProjectCategory = "Web development" | "Mobile App Development" | "Graphic Design" | "";

interface ProjectInfo {
  projectName: string;
  projectDescription: string;
  projectCategory: ProjectCategory; 
  projectStatus: 'complete' | 'incomplete' | 'approved' | 'onHold' | 'cancelled';
  projectTags: string[];
  priorityLevel: 'low' | 'medium' | 'high';
}



export default function CreateProjectPage() {


 const [projectInfoData, setProjectInfoData] = useState<ProjectInfo>({
  projectName: '',
  projectDescription: '', 
  projectCategory: '', // allowed now
  projectStatus: 'incomplete', 
  projectTags: [], 
  priorityLevel: 'low' 
});

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [riskDescription, setRiskDescription] = useState('');

  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [projectManager, setProjectManager] = useState<number | null>(null);
  const [stakeholders, setStakeholders] = useState('');

  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [resources, setResources] = useState('');
  const [tools, setTools] = useState('');

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [objectives, setObjectives] = useState('');
  const [successCriteria, setSuccessCriteria] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [constraints, setConstraints] = useState('');
  const [assumptions, setAssumptions] = useState('');
  const [communicationPlan, setCommunicationPlan] = useState('');
  const [documentLinks, setDocumentLinks] = useState('');

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
         {/* 
        {activeSection === 2 && (
          <TeamSection
            selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers}
            projectManager={projectManager} setProjectManager={setProjectManager}
            stakeholders={stakeholders} setStakeholders={setStakeholders}
            errors={errors}
          />
        )} */}

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