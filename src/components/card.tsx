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

export default function DashboardCard({ title, value, icon: Icon, onClick,color }: DashboardCardProps) {

  return (
    <Card
      className="rounded-md transition cursor-pointer max-sm:p-3 shadow-none"
      onClick={onClick}
    >
      <CardContent className=" max-sm:p-0">
        <div className="flex items-center justify-between md:mb-4 mb-1">
          {Icon && <Icon className={`md:h-10 md:w-10 w-8 h-8 text-white rounded-full p-2 font-thin ${color?`bg-${color}`:"bg-green-700"}`  }/>}
          <ArrowUpRightIcon/>
        </div>
        <CardTitle className="sm:text-lg text-sm font-extralight">{title}</CardTitle>
          <p className="sm:text-2xl text-lg font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
