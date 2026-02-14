"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRightIcon, LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  onClick?: () => void;
  color?: string;
}

export default function DashboardCard({ title, value, icon: Icon, onClick, color }: DashboardCardProps) {
  const getBgColor = (color: string | undefined) => {
    switch (color) {
      case "blue-600": return "bg-blue-600";
      case "yellow-600": return "bg-yellow-600";
      case "green-600": return "bg-green-600";
      case "purple-600": return "bg-purple-600";
      case "emerald-600": return "bg-emerald-600";
      case "orange-600": return "bg-orange-600";
      default: return "bg-green-700";
    }
  };

  return (
    <Card
      className="rounded-md transition cursor-pointer max-sm:p-3 shadow-none border-border/50"
      onClick={onClick}
    >
      <CardContent className=" max-sm:p-0">
        <div className="flex items-center justify-between md:mb-4 mb-3">
          {Icon && (
            <div className={`p-2 rounded-full ${getBgColor(color)}`}>
              <Icon className="md:h-6 md:w-6 w-5 h-5 text-white" />
            </div>
          )}
          <ArrowUpRightIcon className="text-muted-foreground w-4 h-4" />
        </div>
        <CardTitle className="sm:text-sm text-xs font-medium text-muted-foreground">{title}</CardTitle>
        <p className="sm:text-2xl text-lg font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
