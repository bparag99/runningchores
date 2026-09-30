type StatusPillProps = {
    status: 'upcoming' | 'completed' | 'cancelled'
}

const STYLES: Record<StatusPillProps['status'], string> = {
    upcoming: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
    completed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

const LABELS: Record<StatusPillProps['status'], string> = {
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
}

export function StatusPill({ status }: StatusPillProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${STYLES[status]}`}
        >
            {LABELS[status]}
        </span>
    )
}
