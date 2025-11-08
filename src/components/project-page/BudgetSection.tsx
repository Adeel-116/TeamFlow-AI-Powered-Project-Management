import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'; // Update path
import { Input } from '@/components/ui/input'; // Update path
import { Textarea } from '@/components/ui/textarea'; // Update path
import { Label } from '@/components/ui/label'; // Update path
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'; // Update path
import { DollarSign } from 'lucide-react'; // Icon

interface BudgetSectionProps {
  budget: string;
  setBudget: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  resources: string;
  setResources: (value: string) => void;
  tools: string;
  setTools: (value: string) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  budget,
  setBudget,
  currency,
  setCurrency,
  resources,
  setResources,
  tools,
  setTools,
}) => (
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

export default BudgetSection;
