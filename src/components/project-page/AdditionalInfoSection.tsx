"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Update path
import { Label } from '@/components/ui/label'; // Update path
import { Textarea } from '@/components/ui/textarea'; // Update path
import { Briefcase, LinkIcon } from 'lucide-react'; // Icons from lucide-react

export const AdditionalInfoSection = ({
  objectives, setObjectives,
  successCriteria, setSuccessCriteria,
  dependencies, setDependencies,
  constraints, setConstraints,
  assumptions, setAssumptions,
  communicationPlan, setCommunicationPlan,
  documentLinks, setDocumentLinks
}:any) => (
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

export default AdditionalInfoSection;
