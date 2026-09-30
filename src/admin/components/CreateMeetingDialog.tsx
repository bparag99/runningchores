import { useEffect, useMemo, useState } from 'react'
import { usePortal } from '../context/PortalContext'
import { authenticateGoogle, createGoogleMeetMeeting, GoogleApiError, GoogleAuthError, ORGANIZER_EMAIL } from '../services/googleCalendar'
import type { Meeting, MeetingDraft, MeetingFieldErrors } from '../types/Meeting'
import { isBookableStatus } from '../types/Employee'
import { combineDateAndTime, DURATION_OPTIONS, getDefaultMeetingDate, hasMeetingErrors, validateMeetingDraft } from '../utils/dateUtils'
import { formatPhoneNumber, isValidWhatsAppNumber } from '../utils/validation'
import { useToast } from './Toast'
import { Button } from './ui/Button'
import { Field, Select, TextArea } from './ui/Field'
import { Modal } from './ui/Modal'

function createInitialDraft(employeeId = ''): MeetingDraft {
    return {
        employeeId,
        title: 'Running Chores Meeting',
        date: getDefaultMeetingDate(),
        startTime: '16:00',
        durationMinutes: 30,
        description: '',
    }
}

export function CreateMeetingDialog() {
    const { isMeetingDialogOpen, closeMeetingDialog, allEmployees, meetings, setCreatedMeeting, googleMode, createdMeeting } = usePortal()
    const { showToast } = useToast()

    const [draft, setDraft] = useState<MeetingDraft>(() => createInitialDraft())
    const [errors, setErrors] = useState<MeetingFieldErrors>({})
    const [touched, setTouched] = useState(false)
    const [isSubmitting, setSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiErrorCode, setApiErrorCode] = useState<string | undefined>(undefined)

    const bookableEmployees = useMemo(
        () => allEmployees.filter(employee => employee.active && isBookableStatus(employee.status)),
        [allEmployees]
    )
    const selectedEmployee = useMemo(
        () => allEmployees.find(employee => employee.id === draft.employeeId),
        [allEmployees, draft.employeeId]
    )

    useEffect(() => {
        if (!isMeetingDialogOpen) return
        setDraft(createInitialDraft(bookableEmployees.length === 1 ? bookableEmployees[0].id : ''))
        setErrors({})
        setTouched(false)
        setApiError(null)
        setSubmitting(false)
        // Re-seeding only when the dialog opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMeetingDialogOpen])

    const update = (key: keyof MeetingDraft) => (value: string) => {
        setDraft(previous => ({ ...previous, [key]: value }))
        if (touched) {
            setErrors(validateMeetingDraft({ ...draft, [key]: value }, selectedEmployee))
        }
    }

    const handleSubmit = async () => {
        setTouched(true)
        setApiError(null)
        setApiErrorCode(undefined)

        const nextErrors = validateMeetingDraft(draft, selectedEmployee)
        setErrors(nextErrors)
        if (hasMeetingErrors(nextErrors) || !selectedEmployee) return

        setSubmitting(true)

        try {
            const { start, end } = combineDateAndTime(draft.date, draft.startTime, draft.durationMinutes)
            if (start.getTime() < Date.now()) {
                setApiError('Choose a date and time in the future.')
                setSubmitting(false)
                return
            }

            await authenticateGoogle()

            const created = await createGoogleMeetMeeting({
                title: draft.title,
                description: draft.description,
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                // The mentor form collects no email. When it is missing we create
                // the event without an attendee and deliver the Meet link over
                // WhatsApp instead (error case E3 handled gracefully).
                attendeeEmail: selectedEmployee.email,
            })

            const meeting: Meeting = {
                id: '',
                employeeId: selectedEmployee.id,
                employeeName: selectedEmployee.name,
                employeeEmail: selectedEmployee.email,
                title: draft.title.trim(),
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                meetUrl: created.meetUrl,
                googleEventId: created.googleEventId,
                createdAt: new Date().toISOString(),
                status: 'upcoming',
                isDemo: created.isDemo,
                // True when no calendar invitation was sent (phone-only contact).
                phoneOnly: !selectedEmployee.email,
                // Snapshot the number so sharing survives a later sheet re-sync.
                whatsappNumber: selectedEmployee.whatsappNumber,
            }

            const saved = meetings.addMeeting(meeting)
            setCreatedMeeting(saved)
            showToast(
                created.isDemo ? 'Demo meeting created. Configure Google credentials to create a real Meet.' : 'Meeting created successfully ✓',
                created.isDemo ? 'info' : 'success'
            )
        } catch (error) {
            // Never report a failure as a success, and never save a partial record.
            if (error instanceof GoogleAuthError || error instanceof GoogleApiError) {
                setApiError(error.message)
                setApiErrorCode(error instanceof GoogleAuthError ? error.code : undefined)
            } else {
                setApiError('Unable to create the Google Meet. Please try again.')
            }
        } finally {
            setSubmitting(false)
        }
    }

    const employeeHasWhatsApp = Boolean(selectedEmployee && isValidWhatsAppNumber(selectedEmployee.whatsappNumber))
    // The form stays mounted while a meeting is created, but yields to the success dialog.
    const isFormVisible = isMeetingDialogOpen && createdMeeting === null

    return (
        <Modal
            isOpen={isFormVisible}
            onClose={closeMeetingDialog}
            title="Create Meeting"
            description={`A Google Calendar event and Meet link will be created on ${ORGANIZER_EMAIL}.`}
            dismissible={!isSubmitting}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" onClick={closeMeetingDialog} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => void handleSubmit()} isLoading={isSubmitting}>
                        {isSubmitting ? (googleMode === 'demo' ? 'Creating demo meeting…' : 'Waiting for Google…') : 'Create Meeting'}
                    </Button>
                </>
            }
        >
            {bookableEmployees.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    No active employees are available. Sync the mentor sheet or add an employee first.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <Select
                            label="Select Employee"
                            required
                            value={draft.employeeId}
                            onChange={event => update('employeeId')(event.target.value)}
                            error={touched ? errors.employeeId : undefined}
                        >
                            <option value="">Choose an employee…</option>
                            {bookableEmployees.map(employee => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                    {employee.mentorAs ? ` · ${employee.mentorAs}` : employee.department ? ` · ${employee.department}` : ''}
                                </option>
                            ))}
                        </Select>
                    </div>

                    {selectedEmployee && (
                        <div className="sm:col-span-2 -mt-1 grid gap-3 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Employee</p>
                                <p className="mt-0.5 text-sm font-medium text-slate-900">{selectedEmployee.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</p>
                                <p className={`mt-0.5 text-sm font-medium ${selectedEmployee.email ? 'text-slate-900' : 'text-rose-600'}`}>
                                    {selectedEmployee.email || 'Not provided — invite cannot be sent'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organizer</p>
                                <p className="mt-0.5 text-sm font-medium text-slate-900">{ORGANIZER_EMAIL}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">WhatsApp</p>
                                <p className={`mt-0.5 whitespace-nowrap text-sm font-medium ${employeeHasWhatsApp ? 'text-slate-900' : 'text-amber-700'}`}>
                                    {employeeHasWhatsApp
                                        ? formatPhoneNumber(selectedEmployee.whatsappNumber)
                                        : 'Not on file — sharing disabled'}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="sm:col-span-2">
                        <Field
                            label="Meeting Title"
                            required
                            value={draft.title}
                            onChange={event => update('title')(event.target.value)}
                            error={touched ? errors.title : undefined}
                            placeholder="Running Chores Meeting"
                        />
                    </div>

                    <Field
                        label="Date"
                        type="date"
                        required
                        value={draft.date}
                        onChange={event => update('date')(event.target.value)}
                        error={touched ? errors.date : undefined}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Field
                            label="Start Time"
                            type="time"
                            required
                            value={draft.startTime}
                            onChange={event => update('startTime')(event.target.value)}
                            error={touched ? errors.startTime : undefined}
                        />
                        <Select
                            label="Duration"
                            required
                            value={String(draft.durationMinutes)}
                            onChange={event => update('durationMinutes')(event.target.value)}
                            error={touched ? errors.durationMinutes : undefined}
                        >
                            {DURATION_OPTIONS.map(minutes => (
                                <option key={minutes} value={minutes}>
                                    {minutes} min
                                </option>
                            ))}
                        </Select>
                    </div>

                    <div className="sm:col-span-2">
                        <TextArea
                            label="Description"
                            value={draft.description}
                            onChange={event => update('description')(event.target.value)}
                            placeholder="Agenda, agenda items, or a note for the employee (optional)"
                        />
                    </div>

                    {apiError && (
                        <div role="alert" className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
                            <p>{apiError}</p>
                            {apiErrorCode && (
                                <p className="mt-1.5 font-mono text-xs font-normal text-rose-700/80">
                                    Google error: {apiErrorCode}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}
