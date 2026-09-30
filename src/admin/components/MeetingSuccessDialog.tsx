import { useState } from 'react'
import { usePortal } from '../context/PortalContext'
import { buildMeetingMessage, buildPhoneOnlyMessage, hasWhatsAppNumber, shareOnWhatsApp } from '../services/whatsapp'
import { formatLongDate, formatTimeRange } from '../utils/dateUtils'
import { useToast } from './Toast'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

export function MeetingSuccessDialog() {
    const { createdMeeting, closeMeetingDialog, allEmployees } = usePortal()
    const { showToast } = useToast()
    const [copied, setCopied] = useState(false)

    if (!createdMeeting) return null

    // Must search the COMBINED list: sheet-backed mentors have ids like
    // "sheet-42" and do not exist in the local employees store. Looking only at
    // `employees` returned undefined and left the WhatsApp button disabled.
    const employee = allEmployees.find(item => item.id === createdMeeting.employeeId)
    // Prefer the number snapshotted on the meeting; fall back to the live record.
    const phone = createdMeeting.whatsappNumber || employee?.whatsappNumber || ''
    const canShare = hasWhatsAppNumber(phone)

    const handleCopy = async () => {
        if (!createdMeeting.meetUrl) return
        try {
            await navigator.clipboard.writeText(createdMeeting.meetUrl)
            setCopied(true)
            showToast('Google Meet link copied ✓', 'success')
            window.setTimeout(() => setCopied(false), 2500)
        } catch {
            // Clipboard can be blocked; the link stays visible and selectable.
            showToast('Could not copy automatically. Select the link and copy it manually.', 'error')
        }
    }

    const handleShare = () => {
        if (!canShare) return
        const message = createdMeeting.phoneOnly
            ? buildPhoneOnlyMessage({
                  employeeName: createdMeeting.employeeName,
                  title: createdMeeting.title,
                  startTime: createdMeeting.startTime,
                  endTime: createdMeeting.endTime,
                  meetUrl: createdMeeting.meetUrl,
              })
            : buildMeetingMessage(createdMeeting)

        const opened = shareOnWhatsApp(phone, message)
        if (opened) {
            showToast('WhatsApp opened with the invitation pre-filled. Press send to deliver it.', 'info')
        } else {
            // E5: the meeting stays valid either way.
            showToast('Could not open WhatsApp. Copy the Meet link instead.', 'error')
        }
    }

    return (
        <Modal
            isOpen
            onClose={closeMeetingDialog}
            title="Meeting Created Successfully"
            size="md"
            dismissible={false}
            footer={
                <>
                    <Button variant="secondary" onClick={closeMeetingDialog}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={() => void handleCopy()}>
                        {copied ? 'Copied ✓' : 'Copy Meet Link'}
                    </Button>
                    <Button variant="primary" onClick={handleShare} disabled={!canShare} className="sm:order-first">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                            <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2.05 22l5.3-1.38a9.87 9.87 0 0 0 4.69 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.25 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.81.83-3.05-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.25-8.23m-2.6 4.2c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28s-1.44-.71-1.66-.79c-.22-.08-.39-.12-.55.12s-.63.79-.77.95c-.14.16-.28.18-.52.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.71c-.14-.24-.02-.37.11-.5.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.84-.2-.48-.4-.41-.55-.42h-.47" />
                        </svg>
                        Share on WhatsApp
                    </Button>
                </>
            }
        >
            <div className="flex flex-col items-center pb-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/20">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">Meeting created successfully</h3>
                <p className="mt-1.5 text-sm text-slate-500">
                    {createdMeeting.phoneOnly
                        ? 'The Meet link is ready. This person has no email on file, so no calendar invitation was sent — share the link instead.'
                        : 'The employee has been added as an attendee and can join with the link below.'}
                </p>
            </div>

            {createdMeeting.phoneOnly && (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
                    The Become a Mentor form does not collect an email address, so no calendar invitation was sent. Use
                    “Share on WhatsApp” to deliver the Meet link.
                </p>
            )}

            {createdMeeting.isDemo && (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
                    Demo Mode — this Meet link was simulated because Google credentials are not configured. No real calendar
                    event was created.
                </p>
            )}

            <dl className="mt-5 divide-y divide-slate-100 rounded-xl bg-slate-50 px-4 ring-1 ring-slate-200">
                <Row label="Employee" value={createdMeeting.employeeName} />
                <Row label="Email" value={createdMeeting.employeeEmail || 'Not provided — link shared via WhatsApp'} />
                <Row label="Meeting" value={createdMeeting.title} />
                <Row label="Date" value={formatLongDate(createdMeeting.startTime)} />
                <Row label="Time" value={formatTimeRange(createdMeeting.startTime, createdMeeting.endTime)} />
                <div className="flex flex-col gap-1 py-3">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Google Meet</dt>
                    <dd>
                        {createdMeeting.meetUrl ? (
                            <a
                                href={createdMeeting.meetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-sm font-medium text-cyan-700 underline underline-offset-2 hover:text-cyan-800"
                            >
                                {createdMeeting.meetUrl}
                            </a>
                        ) : (
                            <span className="text-sm text-rose-600">No Meet link was returned.</span>
                        )}
                    </dd>
                </div>
            </dl>

            <p className="mt-4 text-xs leading-5 text-slate-500">
                <strong className="font-semibold text-slate-600">Note:</strong> “Share on WhatsApp” opens WhatsApp with this
                invitation pre-filled. You still need to press send in WhatsApp — this portal cannot send messages on your
                behalf.
            </p>

            {!canShare && (
                <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                    This employee does not have a WhatsApp number. The meeting is still valid — copy the Meet link instead.
                </p>
            )}
        </Modal>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
            <dd className="min-w-0 break-words text-sm font-medium text-slate-900">{value}</dd>
        </div>
    )
}
