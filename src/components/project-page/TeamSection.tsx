import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import ErrorMessage from '@/components/ui/error-message';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}


interface TeamSectionProps {
  selectedMembers: number[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<number[]>>;
  projectManager: number | null;
  setProjectManager: React.Dispatch<React.SetStateAction<number | null>>;
  stakeholders: string;
  setStakeholders: React.Dispatch<React.SetStateAction<string>>;
  errors: {
    selectedMembers?: string;
  };
  TEAM_MEMBERS: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({
  selectedMembers,
  setSelectedMembers,
  projectManager,
  setProjectManager,
  stakeholders,
  setStakeholders,
  errors,
  TEAM_MEMBERS,
}) => {

  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
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
        {/* Project Manager */}
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

        {/* Team Members */}
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

        {/* Stakeholders */}
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

export default TeamSection;
