import type { ReactNode } from 'react'

type EmptyStateProps = {
    title: string
    description: string
    action?: ReactNode
    icon?: 'people' | 'calendar'
}

export function EmptyState({ title, description, action, icon = 'people' }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
                {icon === 'people' ? (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" strokeLinecap="round" />
                        <circle cx="9" cy="7" r="3.2" />
                        <path d="M17 11a3 3 0 1 0-1.2-5.8M22 19v-1a4 4 0 0 0-3-3.85" strokeLinecap="round" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="3" y="5" width="18" height="16" rx="2.5" />
                        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
                    </svg>
                )}
            </span>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}
