import React from 'react';


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

export function SkeletonCard({ width = 'w-full', height = 'h-40', className = '' }) {
    return (
        <div className={`rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden ${width} ${height} ${className}`}>
            <div className="animate-pulse p-4 h-full flex flex-col">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
        </div>
    );
}


