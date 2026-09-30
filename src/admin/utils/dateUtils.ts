import type { MeetingDraft, MeetingFieldErrors } from '../types/Meeting'
import { isValidEmail, isValidWhatsAppNumber } from './validation'

export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const

/** Builds the `date` + `HH:mm` + duration pair into an ISO instant. */
export function combineDateAndTime(date: string, startTime: string, durationMinutes: number): { start: Date; end: Date } {
    const [year, month, day] = date.split('-').map(Number)
    const [hours, minutes] = startTime.split(':').map(Number)
    const start = new Date(year, (month ?? 1) - 1, day, hours ?? 0, minutes ?? 0, 0, 0)
    const end = new Date(start.getTime() + durationMinutes * 60_000)
    return { start, end }
}

export function formatLongDate(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export function formatTime(value: string | Date): string {
    const date = typeof value === 'string' ? new Date(value) : value
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
        .format(date)
        .toUpperCase()
        .replace(/\s/g, ' ')
}

export function formatTimeRange(start: string, end: string): string {
    return `${formatTime(start)} - ${formatTime(end)}`
}

export function formatDateTimeInput(date: Date): string {
    const year = date.getFullYear()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function formatTimeInput(date: Date): string {
    return `${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`
}

export function getDefaultMeetingDate(): string {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatDateTimeInput(tomorrow)
}

export function validateMeetingDraft(draft: MeetingDraft, employee: { email: string; whatsappNumber: string } | undefined): MeetingFieldErrors {
    const errors: MeetingFieldErrors = {}

    if (!draft.employeeId) {
        errors.employeeId = 'Select an employee.'
    } else if (!employee) {
        errors.employeeId = 'The selected employee no longer exists.'
    } else if (employee.email && !isValidEmail(employee.email)) {
        errors.employeeId = 'This employee does not have a valid email address.'
    } else if (!employee.email && !isValidWhatsAppNumber(employee.whatsappNumber)) {
        // Without an email we can only reach them by phone, so one of the two
        // must be usable (E3 / E4).
        errors.employeeId = 'This employee has neither a valid email nor a WhatsApp number.'
    }
    // A missing WhatsApp number or email is deliberately NOT blocking on its own
    // (E3/E4): the meeting is still created and the Meet link stays copyable.

    if (draft.title.trim().length < 3) {
        errors.title = 'Meeting title is required.'
    }

    if (!draft.date) {
        errors.date = 'Date is required.'
    } else if (Number.isNaN(new Date(`${draft.date}T00:00:00`).getTime())) {
        errors.date = 'Enter a valid date.'
    }

    if (!draft.startTime) {
        errors.startTime = 'Start time is required.'
    } else if (!/^\d{2}:\d{2}$/.test(draft.startTime)) {
        errors.startTime = 'Enter a valid time.'
    }

    if (!DURATION_OPTIONS.includes(draft.durationMinutes as (typeof DURATION_OPTIONS)[number])) {
        errors.durationMinutes = 'Select a valid duration.'
    }

    return errors
}

export function hasMeetingErrors(errors: MeetingFieldErrors): boolean {
    return Object.values(errors).some(Boolean)
}
