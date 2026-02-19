"use client"

import * as React from "react"
import {
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
} from "recharts"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { cn } from "@/lib/utils"

const ChartContext = React.createContext<{
    config: ChartConfig
} | null>(null)

export type ChartConfig = {
    [key: string]: {
        label?: React.ReactNode
        icon?: React.ComponentType
        color?: string
    }
}

export function ChartContainer({
    config,
    children,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    config: ChartConfig
}) {
    return (
        <ChartContext.Provider value={{ config }}>
            <div
                className={cn(
                    "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
                    className
                )}
                {...props}
            >
                <ResponsiveContainer>{children}</ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    )
}

export const ChartTooltip = Tooltip

export const ChartTooltipContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> &
    TooltipProps<ValueType, NameType> & {
        hideLabel?: boolean
        hideIndicator?: boolean
        indicator?: "line" | "dot" | "dashed"
        nameKey?: string
        labelKey?: string
        payload?: any[]
        active?: boolean
        label?: any
    }
>(
    (
        {
            active,
            payload,
            className,
            indicator = "dot",
            hideLabel = false,
            hideIndicator = false,
            label,
            labelFormatter,
            labelClassName,
            formatter,
            color,
            nameKey,
            labelKey,
        },
        ref
    ) => {
        const context = React.useContext(ChartContext)
        if (!context) return null
        const { config } = context

        if (!active || !payload?.length) {
            return null
        }

        return (
            <div
                ref={ref}
                className={cn(
                    "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
                    className
                )}
            >
                {!hideLabel && (
                    <div className={cn("font-medium", labelClassName)}>
                        {labelFormatter ? labelFormatter(label, payload) : label}
                    </div>
                )}
                <div className="grid gap-1.5">
                    {payload.map((item: any, index: number) => {
                        const key = `${nameKey || item.name || item.dataKey || "value"}`
                        const itemConfig = config[key]
                        const indicatorColor = color || item.payload?.fill || item.color

                        return (
                            <div
                                key={item.dataKey}
                                className={cn(
                                    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                                    indicator === "dot" && "items-center"
                                )}
                            >
                                {itemConfig?.icon ? (
                                    <itemConfig.icon />
                                ) : (
                                    !hideIndicator && (
                                        <div
                                            className={cn(
                                                "shrink-0 rounded-[2px] border-[1.5px] border-border bg-[--color-bg]",
                                                {
                                                    "h-2.5 w-2.5": indicator === "dot",
                                                    "w-1": indicator === "line",
                                                    "w-0 border-[1.5px] border-dashed bg-transparent":
                                                        indicator === "dashed",
                                                }
                                            )}
                                            style={
                                                {
                                                    "--color-bg": indicatorColor,
                                                } as React.CSSProperties
                                            }
                                        />
                                    )
                                )}
                                <div
                                    className={cn(
                                        "flex flex-1 justify-between leading-none",
                                        indicator === "dot" && "items-center"
                                    )}
                                >
                                    <div className="grid gap-1.5">
                                        {hideLabel ? (
                                            <span className="font-medium">
                                                {labelFormatter
                                                    ? labelFormatter(label, payload)
                                                    : label}
                                            </span>
                                        ) : null}
                                        <span className="text-muted-foreground">
                                            {itemConfig?.label || item.name}
                                        </span>
                                    </div>
                                    {item.value && (
                                        <span className="font-mono font-medium tabular-nums text-foreground">
                                            {formatter
                                                ? formatter(item.value, item.name, item, index, payload)
                                                : item.value.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
)
ChartTooltipContent.displayName = "ChartTooltip"

export const ChartLegend = () => null // Placeholder for now
export const ChartLegendContent = () => null // Placeholder for now
