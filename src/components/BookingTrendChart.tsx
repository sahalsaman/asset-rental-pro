"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    bookings: {
        label: "Bookings",
        color: "#16a34a",
    },
} satisfies ChartConfig

interface BookingTrendChartProps {
    data: { name: string; bookings: number }[]
}

export function BookingTrendChart({ data }: BookingTrendChartProps) {
    return (
        <Card className="shadow-none border-border/50">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Booking Trend</CardTitle>
                <CardDescription>
                    New bookings for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="bookings" fill="var(--color-bookings)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
