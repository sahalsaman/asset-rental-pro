"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Calendar, Receipt, UserPlus, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface Activity {
    id: string
    type: "booking" | "invoice"
    title: string
    description: string
    amount: number
    date: string
}

interface RecentActivityProps {
    activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
    return (
        <Card className="shadow-none border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="grid gap-1">
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <CardDescription>
                        Latest updates from your property
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                            No recent activity found.
                        </div>
                    ) : (
                        activities.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${activity.type === "booking" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {activity.type === "booking" ? (
                                        <UserPlus className="h-4 w-4" />
                                    ) : (
                                        <Receipt className="h-4 w-4" />
                                    )}
                                </div>
                                <div className="grid gap-1 flex-1">
                                    <p className="text-sm font-medium leading-none">
                                        {activity.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {activity.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">
                                        {activity.amount > 0 ? `+` : ""}{activity.amount.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {format(new Date(activity.date), "MMM dd, HH:mm")}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
