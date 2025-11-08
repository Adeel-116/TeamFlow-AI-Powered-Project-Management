"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ErrorMessage from '@/components/ui/error-message';
import { FileText, Tag } from 'lucide-react';

interface BasicInfoSectionProps {
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  currentTag: string;
  setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
  priority: 'low' | 'medium' | 'high';
  setPriority: React.Dispatch<React.SetStateAction<'low' | 'medium' | 'high'>>;
  errors: {
    projectName?: string;
    description?: string;
    category?: string;
    priority?: string;
  };
}
const PROJECT_STATUS_OPTIONS = [
  'Not Started', 'Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'
];

const PROJECT_CATEGORIES = [
  'Web Development', 'Mobile App',
];

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  projectName, setProjectName,
  description, setDescription,
  category, setCategory,
  status, setStatus,
  tags, setTags,
  currentTag, setCurrentTag,
  priority, setPriority,
  errors
}) => {
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
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
              {tags.map((tag) => (
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
            {errors.priority && <ErrorMessage message={errors.priority} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
