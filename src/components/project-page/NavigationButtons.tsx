"use client"
import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Update this path according to your project
import { Button } from '@/components/ui/button';           // Update this path according to your project
import { CheckCircle2 } from 'lucide-react'; 



export const NavigationButtons = ({ activeSection, sections, setActiveSection, handleSave, handleCancel }: any) => (
  <Card className="border-slate-200 shadow-sm bg-white">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {activeSection > 0 && (
            <Button variant="outline" onClick={() => setActiveSection(activeSection - 1)}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {activeSection < sections.length - 1 ? (
            <Button
              onClick={() => setActiveSection(activeSection + 1)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next Section
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel} className="px-6">
                Cancel
              </Button>
              <Button onClick={handleSave} className="px-6 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-slate-600">
            Section {activeSection + 1} of {sections.length}
          </span>
          <div className="flex gap-1">
            {sections.map((section: any) => (
              <div
                key={section.id}
                className={`h-2 w-2 rounded-full transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 w-8'
                    : activeSection > section.id
                    ? 'bg-green-500'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);