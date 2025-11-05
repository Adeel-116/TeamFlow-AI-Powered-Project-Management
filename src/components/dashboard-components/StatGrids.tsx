"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Target, CheckSquare, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface StatType {
  label: string;
  value: string;
  icon: React.ElementType;
  change: string;
  trend: "up" | "down";
}

interface StatsGridProps {
  stats?: StatType[];
}

const defaultStats: StatType[] = [
  { label: "Active Projects", value: "8", icon: Target, change: "+2 this month", trend: "up" },
  { label: "Completed Tasks", value: "120", icon: CheckSquare, change: "+18 this week", trend: "up" },
  { label: "Pending Tasks", value: "32", icon: Clock, change: "-5 from last week", trend: "down" },
  { label: "Total Team Members", value: "15", icon: Users, change: "+3 new", trend: "up" },
];

export const StatGrids: React.FC<StatsGridProps> = ({ stats = defaultStats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
  {stats.map((stat, idx) => {
    const isUp = stat.trend === "up";
    const Icon = stat.icon;

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1, duration: 0.5 }}
        whileHover={{ scale: 1.03, y: -2 }}
      >
        <Card className="relative border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)] shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group">
          <CardContent className="px-3 sm:px-4  space-y-2 sm:space-y-3 relative z-10">
            {/* Top: Stat label & icon */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-3">
              <div>
                <p className="text-xs sm:text-sm font-medium text-[var(--color-muted-foreground)]">
                  {stat.label}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-foreground)] mt-0.5 sm:mt-1">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`w-9 h-9 sm:w-10 sm:h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  isUp
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                    : "bg-[var(--color-destructive)] text-[var(--color-card-foreground)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div
              className={`flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm font-medium ${
                isUp ? "text-[var(--color-accent)]" : "text-[var(--color-destructive)]"
              }`}
            >
              {isUp ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span>{stat.change}</span>
            </div>
          </CardContent>

          {/* Bottom accent bar */}
          {/* <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            style={{
              transformOrigin: "left",
              background: `var(${isUp ? "--color-accent" : "--color-destructive"})`,
            }}
          /> */}
        </Card>
      </motion.div>
    );
  })}
</div>

  );
};
