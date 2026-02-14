import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function FullscreenLoader({ text = 'Loading...', className = '' }) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ${className}`}>
            <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 p-6 shadow-lg flex items-center gap-4">
                <svg className="h-10 w-10 animate-spin text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-90" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
                </svg>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between mb-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[150px]" />
            </div>
            <div className="border rounded-md">
                <div className="space-y-0">
                    {[...Array(rows)].map((_, i) => (
                        <div key={i} className="flex border-b last:border-0 p-4 gap-4">
                            {[...Array(cols)].map((_, j) => (
                                <Skeleton key={j} className="h-4 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CardGridSkeleton({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="border rounded-xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="pt-4 flex justify-between">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border space-y-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Skeleton className="lg:col-span-2 h-80 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
            </div>
        </div>
    );
}

export function CalendarSkeleton() {
    return (
        <div className="bg-white rounded-xl border p-4 space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => (
                    <Skeleton key={i} className="h-24 md:h-32 rounded-lg" />
                ))}
            </div>
        </div>
    );
}


