import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ErrorMessage from '@/components/ui/error-message';
import { Calendar, Clock } from 'lucide-react';

interface TimelineSectionProps {
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  estimatedDuration: string;
  setEstimatedDuration: React.Dispatch<React.SetStateAction<string>>;
  errors: {
    startDate?: string;
    endDate?: string;
  };
}

const TimelineSection: React.FC<TimelineSectionProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  estimatedDuration,
  setEstimatedDuration,
  errors,
}) => (
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
            Project Duration:{' '}
            {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}{' '}
            days
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default TimelineSection;
