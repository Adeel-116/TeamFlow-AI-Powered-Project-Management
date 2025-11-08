"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Update path
import { Button } from '@/components/ui/button'; // Update path
import { Input } from '@/components/ui/input'; // Update path
import { Label } from '@/components/ui/label'; // Update path
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Update path
import { FolderOpen, Plus, Trash2 } from 'lucide-react'; // Icons




const TasksCard = ({ tasks, setTasks }:any) => {
  const addTask = () => {
    setTasks((prev:any) => [
      ...prev,
      { id: Date.now(), title: '', assignedTo: [], priority: 'medium', estimatedHours: '' },
    ]);
  };

  const removeTask = (id: number) => {
    setTasks((prev:any) => prev.filter((t:any) => t.id !== id));
  };

  const updateTask = (id: number, field: any, value: any) => {
    setTasks((prev:any) => prev.map((t:any) => (t.id === id ? { ...t, [field]: value } : t)));
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
            {tasks.map((task:any, index:any) => (
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

export default TasksCard;
