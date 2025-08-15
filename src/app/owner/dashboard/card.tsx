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
      className="hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {Icon && <Icon className="h-6 w-6 text-gray-500" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
