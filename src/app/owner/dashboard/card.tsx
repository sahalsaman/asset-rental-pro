"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  onClick?: () => void;
}

export default function DashboardCard({ title, value, icon: Icon, onClick }: DashboardCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition cursor-pointer max-sm:p-2 max-sm:px-3"
      onClick={onClick}
    >
      <CardContent className=" max-sm:p-0">
        <div className="flex items-center justify-between md:mb-4">
          {Icon && <Icon className="md:h-6 md:w-6 w-4 h-4 text-gray-500" />}
          <p className="sm:text-2xl font-bold">{value}</p>
        </div>
        <CardTitle className="sm:text-lg text-sm font-extralight">{title}</CardTitle>
      </CardContent>
    </Card>
  );
}
