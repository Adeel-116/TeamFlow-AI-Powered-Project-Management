"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Update path
import { Button } from '@/components/ui/button'; // Update path
import { Input } from '@/components/ui/input'; // Update path
import { Label } from '@/components/ui/label'; // Update path
import { Textarea } from '@/components/ui/textarea'; // Update path
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Update path
import { Target, Plus, Trash2 } from 'lucide-react'; // Icons

// Define Milestone interface
export interface Milestone {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface MilestonesCardProps {
  milestones: Milestone[];
  setMilestones: React.Dispatch<React.SetStateAction<Milestone[]>>;
}

const MilestonesCard: React.FC<MilestonesCardProps> = ({ milestones, setMilestones }) => {
  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { id: Date.now(), name: '', startDate: '', endDate: '', description: '', status: 'pending' },
    ]);
  };

  const removeMilestone = (id: number) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: any) => {
    setMilestones((prev) =>
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
            {milestones.map((milestone, index) => (
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

export default MilestonesCard;
