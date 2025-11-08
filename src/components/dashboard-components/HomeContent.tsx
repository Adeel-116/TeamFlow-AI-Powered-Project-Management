"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FolderOpen,
    CheckSquare,
    Users,
    BarChart3,
    TrendingUp,
} from 'lucide-react';
import { dummyProjects, stats, recentTasks, } from "../../data/Data"
import { StatGrids } from './StatGrids';
import ActiveProjects from './ActiveProject';
import RecentTasks from './RecentTask';
function HomeContent() {
    return (
        <div className='p-2.5 space-y-6'>
        
          <StatGrids />
          <ActiveProjects />
          <RecentTasks />

        </div>
    )
}

export default HomeContent
