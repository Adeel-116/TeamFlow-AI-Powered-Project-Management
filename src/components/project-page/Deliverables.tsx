"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Update path
import { Button } from '@/components/ui/button'; // Update path
import { Input } from '@/components/ui/input'; // Update path
import { Textarea } from '@/components/ui/textarea'; // Update path
import { Label } from '@/components/ui/label'; // Update path
import { CheckCircle2, Plus, Trash2 } from 'lucide-react'; // Icons

// Define Deliverable interface
export interface Deliverable {
  id: number;
  name: string;
  dueDate: string;
  description: string;
}

interface DeliverablesCardProps {
  deliverables: Deliverable[];
  setDeliverables: React.Dispatch<React.SetStateAction<Deliverable[]>>;
}

export const DeliverablesCard: React.FC<DeliverablesCardProps> = ({ deliverables, setDeliverables }) => {
  const addDeliverable = () => {
    setDeliverables((prev) => [
      ...prev,
      { id: Date.now(), name: '', dueDate: '', description: '' },
    ]);
  };

  const removeDeliverable = (id: number) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDeliverable = (id: number, field: keyof Deliverable, value: string) => {
    setDeliverables((prev) =>
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
            {deliverables.map((deliverable, index) => (
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

export default DeliverablesCard;
