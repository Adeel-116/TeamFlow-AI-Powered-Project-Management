
"use client"

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';


const SectionNavigation= ({
  sections,
  activeSection,
  onSectionChange
}:any) => {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {sections.map((section:any) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium whitespace-nowrap">{section.name}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionNavigation;
