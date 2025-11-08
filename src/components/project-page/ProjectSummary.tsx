
"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; 
import { Badge } from '@/components/ui/badge'; 


export const ProjectSummary = ({ projectName, category, priority, selectedMembers, startDate, endDate, milestones, deliverables, budget, currency }: any) => (
  <Card className="border-blue-200 shadow-sm bg-blue-50">
    <CardHeader>
      <CardTitle className="text-lg">Project Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-slate-600 mb-1">Project Name</p>
          <p className="font-semibold text-slate-900">{projectName || 'Not set'}</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Category</p>
          <p className="font-semibold text-slate-900">{category || 'Not set'}</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Priority</p>
          <Badge className={
            priority === 'high' ? 'bg-red-100 text-red-800' :
            priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }>
            {priority}
          </Badge>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Team Members</p>
          <p className="font-semibold text-slate-900">{selectedMembers.length} selected</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Timeline</p>
          <p className="font-semibold text-slate-900">
            {startDate && endDate 
              ? `${Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
              : 'Not set'}
          </p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Milestones</p>
          <p className="font-semibold text-slate-900">{milestones.length} added</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Deliverables</p>
          <p className="font-semibold text-slate-900">{deliverables.length} added</p>
        </div>
        <div>
          <p className="text-slate-600 mb-1">Budget</p>
          <p className="font-semibold text-slate-900">
            {budget ? `${currency} ${budget}` : 'Not set'}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);