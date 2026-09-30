import { useMemo, useState } from 'react'
import { usePortal } from '../context/PortalContext'
import { buildMeetingMessage, hasWhatsAppNumber, shareOnWhatsApp } from '../services/whatsapp'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { EmptyState } from '../components/EmptyState'
import { StatusPill } from '../components/StatusPill'
import { useToast } from '../components/Toast'
import { Button } from '../components/ui/Button'
import type { MeetingStatus } from '../types/Meeting'
import { formatLongDate, formatTimeRange } from '../utils/dateUtils'
import { getInitials } from '../utils/validation'

const FILTERS: { value: 'all' | MeetingStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
]

export function Meetings() {
    const { meetings, openMeetingDialog, allEmployees } = usePortal()
    const { showToast } = useToast()
    const [filter, setFilter] = useState<'all' | MeetingStatus>('all')
    const [pendingCancel, setPendingCancel] = useState<string | null>(null)

    const visibleMeetings = useMemo(() => {
        const withStatus = meetings.sortedMeetings.map(meeting => ({ ...meeting, status: meetings.deriveStatus(meeting) }))
        return filter === 'all' ? withStatus : withStatus.filter(meeting => meeting.status === filter)
    }, [meetings, filter])

    const handleReshare = (meetingId: string) => {
        const meeting = meetings.meetings.find(item => item.id === meetingId)
        if (!meeting) return

        const employee = allEmployees.find(item => item.id === meeting.employeeId)
        // Prefer the snapshot taken when the meeting was created.
        const phone = meeting.whatsappNumber || employee?.whatsappNumber || ''
        if (!hasWhatsAppNumber(phone)) {
            showToast('This employee does not have a WhatsApp number on file.', 'error')
            return
        }

        const opened = shareOnWhatsApp(phone, buildMeetingMessage(meeting))
        showToast(
            opened ? 'WhatsApp opened with the invitation pre-filled.' : 'Could not open WhatsApp. Copy the Meet link instead.',
            opened ? 'info' : 'error'
        )
    }

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Meetings</h1>
                        <p className="mt-1.5 text-sm text-slate-500">
                            A lightweight history of every meeting created from this portal.
                        </p>
                    </div>
                    <Button variant="primary" onClick={openMeetingDialog}>
                        Create Meeting
                    </Button>
                </header>

                <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter meetings by status">
                    {FILTERS.map(item => (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => setFilter(item.value)}
                            aria-pressed={filter === item.value}
                            className={[
                                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                                filter === item.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
                            ].join(' ')}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {visibleMeetings.length === 0 ? (
                    <EmptyState
                        icon="calendar"
                        title={meetings.meetings.length === 0 ? 'No meetings yet' : 'No meetings in this filter'}
                        description={
                            meetings.meetings.length === 0
                                ? 'Create your first Google Meet and share the invitation on WhatsApp.'
                                : 'Try a different status filter to see more meetings.'
                        }
                        action={
                            <Button variant="primary" onClick={openMeetingDialog}>
                                Create Meeting
                            </Button>
                        }
                    />
                ) : (
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80">
                                        <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Employee</th>
                                        <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Meeting</th>
                                        <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">When</th>
                                        <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Meet</th>
                                        <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {visibleMeetings.map(meeting => (
                                        <tr key={meeting.id} className="transition hover:bg-slate-50/70">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                                                        {getInitials(meeting.employeeName)}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-slate-900">{meeting.employeeName}</p>
                                                        <p className="truncate text-xs text-slate-500">{meeting.employeeEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="max-w-[14rem] truncate px-5 py-3.5 font-medium text-slate-700" title={meeting.title}>
                                                {meeting.title}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600">
                                                <p className="whitespace-nowrap">{formatLongDate(meeting.startTime)}</p>
                                                <p className="whitespace-nowrap text-xs text-slate-500">
                                                    {formatTimeRange(meeting.startTime, meeting.endTime)}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {meeting.meetUrl ? (
                                                    <a
                                                        href={meeting.meetUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
                                                    >
                                                        Join
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                                {meeting.isDemo && (
                                                    <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                        Demo
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <StatusPill status={meeting.status} />
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => handleReshare(meeting.id)}>
                                                        Share
                                                    </Button>
                                                    {meeting.status !== 'cancelled' && (
                                                        <Button variant="ghost" size="sm" onClick={() => setPendingCancel(meeting.id)}>
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={pendingCancel !== null}
                title="Cancel meeting"
                message="Mark this meeting as cancelled in the local history? The Google Calendar event is not modified."
                confirmLabel="Cancel meeting"
                destructive
                onConfirm={() => {
                    if (pendingCancel) {
                        meetings.cancelMeeting(pendingCancel)
                        showToast('Meeting marked as cancelled.', 'info')
                    }
                    setPendingCancel(null)
                }}
                onClose={() => setPendingCancel(null)}
            />
        </>
    )
}
