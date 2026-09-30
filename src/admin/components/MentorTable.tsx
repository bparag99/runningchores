import { useMemo, useState } from 'react'
import { MENTOR_STATUS_OPTIONS, type MentorRecord } from '../services/googleSheets'
import { formatPhoneNumber } from '../utils/validation'
import { useToast } from './Toast'
import { Button } from './ui/Button'
import { EmptyState } from './EmptyState'

type MentorTableProps = {
    records: MentorRecord[]
    isSyncing: boolean
    isConnected: boolean
    syncedAt: string
    savingRow: number | null
    sheetUrl: string
    error: string | null
    onSync: () => void
    onStatusChange: (rowNumber: number, status: string) => Promise<void>
}

const STATUS_TONES: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    'on hold': 'bg-slate-100 text-slate-600 ring-slate-500/20',
    inactive: 'bg-slate-100 text-slate-500 ring-slate-500/20',
    rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

function statusTone(status: string): string {
    return STATUS_TONES[status.trim().toLowerCase()] ?? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
}

function formatSubmittedAt(value: string): string {
    if (!value) return '—'
    // Google Forms returns e.g. "30/09/2026 14:23" in the sheet's locale.
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsed)
    }
    return value
}

export function MentorTable({
    records,
    isSyncing,
    isConnected,
    syncedAt,
    savingRow,
    sheetUrl,
    error,
    onSync,
    onStatusChange,
}: MentorTableProps) {
    const { showToast } = useToast()
    const [query, setQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const visible = useMemo(() => {
        const term = query.trim().toLowerCase()
        return records.filter(record => {
            const matchesTerm = term
                ? [record.name, record.phoneNumber, record.mentorAs, record.skillDescription, record.status]
                      .join(' ')
                      .toLowerCase()
                      .includes(term)
                : true
            const matchesStatus = statusFilter === 'all' || record.status.trim().toLowerCase() === statusFilter
            return matchesTerm && matchesStatus
        })
    }, [records, query, statusFilter])

    const counts = useMemo(() => {
        const map = new Map<string, number>()
        records.forEach(record => {
            const key = record.status.trim() || 'Pending'
            map.set(key, (map.get(key) ?? 0) + 1)
        })
        return [...map.entries()].sort((a, b) => b[1] - a[1])
    }, [records])

    const handleStatusChange = async (record: MentorRecord, value: string) => {
        if (value === record.status) return
        try {
            await onStatusChange(record.rowNumber, value)
            showToast(`${record.name} set to “${value}” and saved to the sheet ✓`, 'success')
        } catch (saveError) {
            showToast(saveError instanceof Error ? saveError.message : 'Could not update the status.', 'error')
        }
    }

    return (
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900">Mentor Database</h2>
                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-semibold text-cyan-700 ring-1 ring-inset ring-cyan-600/20">
                            {records.length} {records.length === 1 ? 'entry' : 'entries'}
                        </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Synced from the Become a Mentor Google Form.{' '}
                        {syncedAt ? `Last synced ${new Date(syncedAt).toLocaleTimeString()}.` : 'Not synced yet.'}
                    </p>
                </div>

                <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
                >
                    Open sheet
                </a>

                <Button variant="secondary" size="sm" onClick={onSync} isLoading={isSyncing} disabled={!isConnected}>
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6M16.5 3v3.5H13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sync
                </Button>
            </div>

            {error && (
                <div role="alert" className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm font-medium text-amber-900">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={onSync}
                        className="mt-1.5 text-xs font-semibold text-amber-900 underline underline-offset-2"
                    >
                        Try again
                    </button>
                </div>
            )}

            {!isConnected && !isSyncing && (
                <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                    Connect Google to load the mentor database. Use the “Google: Connect” button in the header.
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">
                <div className="relative min-w-0 flex-1">
                    <svg
                        viewBox="0 0 20 20"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="9" cy="9" r="5.5" />
                        <path d="M13.5 13.5L17 17" strokeLinecap="round" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search name, phone, role or skill"
                        aria-label="Search mentors"
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                </div>

                {counts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            aria-pressed={statusFilter === 'all'}
                            className={[
                                'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                            ].join(' ')}
                        >
                            All
                        </button>
                        {counts.map(([status, count]) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status.toLowerCase())}
                                aria-pressed={statusFilter === status.toLowerCase()}
                                className={[
                                    'rounded-lg px-2.5 py-1.5 text-xs font-semibold transition',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                                    statusFilter === status.toLowerCase()
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
                                ].join(' ')}
                            >
                                {status} ({count})
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {visible.length === 0 ? (
                <div className="p-5">
                    {records.length === 0 ? (
                        <EmptyState
                            title="No mentor entries yet"
                            description={
                                isConnected
                                    ? 'The sheet is connected but has no rows. New Become a Mentor form submissions will appear here after a sync.'
                                    : 'Connect Google to load entries from the Become a Mentor sheet.'
                            }
                            action={
                                isConnected ? (
                                    <Button variant="primary" onClick={onSync} isLoading={isSyncing}>
                                        Sync now
                                    </Button>
                                ) : undefined
                            }
                        />
                    ) : (
                        <EmptyState
                            title="No matching entries"
                            description={`Nothing matches your search or filter.`}
                            action={
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setQuery('')
                                        setStatusFilter('all')
                                    }}
                                >
                                    Clear filters
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[60rem] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80">
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Row</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Phone number</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">I want to mentor as</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Skill description</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Submitted</th>
                                <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visible.map(record => {
                                const isSaving = savingRow === record.rowNumber
                                const options = MENTOR_STATUS_OPTIONS.includes(record.status as never)
                                    ? MENTOR_STATUS_OPTIONS
                                    : ([record.status, ...MENTOR_STATUS_OPTIONS] as readonly string[])

                                return (
                                    <tr key={record.rowNumber} className="transition hover:bg-slate-50/70">
                                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{record.rowNumber}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900">{record.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="whitespace-nowrap tabular-nums text-slate-700">
                                                {formatPhoneNumber(record.phoneNumber) || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">
                                            {record.mentorAs || <span className="text-slate-400">—</span>}
                                        </td>
                                        <td className="max-w-xs px-4 py-3 text-slate-600">
                                            <p className="line-clamp-2" title={record.skillDescription}>
                                                {record.skillDescription || <span className="text-slate-400">—</span>}
                                            </p>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {formatSubmittedAt(record.timestamp)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusTone(record.status)}`}
                                                >
                                                    {record.status || 'Pending'}
                                                </span>
                                                <label className="sr-only" htmlFor={`status-${record.rowNumber}`}>
                                                    Status for {record.name}
                                                </label>
                                                <select
                                                    id={`status-${record.rowNumber}`}
                                                    value={record.status}
                                                    disabled={isSaving}
                                                    onChange={event => void handleStatusChange(record, event.target.value)}
                                                    className="h-8 rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:opacity-50"
                                                >
                                                    {options.map(option => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                                {isSaving && (
                                                    <svg className="h-3.5 w-3.5 animate-spin text-cyan-600" viewBox="0 0 24 24" fill="none">
                                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                                                        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
