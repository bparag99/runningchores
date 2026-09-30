/**
 * WhatsApp sharing.
 *
 * This is the ONLY module that knows about WhatsApp. UI components call
 * `shareOnWhatsApp()` and never construct a URL themselves, so a future
 * WhatsApp Business API implementation can replace the internals of
 * `sendMeetingInvite()` without touching any component (see DESIGN.md §8).
 *
 * IMPORTANT LIMITATION: a browser application cannot silently send a WhatsApp
 * message. This module opens WhatsApp with a pre-filled message; the admin
 * still has to press send. `sendMeetingInvite()` is the single seam where a
 * server-side Business API call would go.
 */

import type { Meeting } from '../types/Meeting'
import { formatLongDate, formatTimeRange } from '../utils/dateUtils'
import { toWhatsAppDigits } from '../utils/validation'

/** Strips separators and a leading `+` / `00` so only digits remain. */
export function normalizeWhatsAppNumber(raw: string): string {
    return toWhatsAppDigits(raw)
}

export function hasWhatsAppNumber(raw: string): boolean {
    return normalizeWhatsAppNumber(raw).length > 0
}

export function getFirstName(fullName: string): string {
    return fullName.trim().split(/\s+/)[0] ?? fullName
}

/** Builds the exact invitation copy described in the requirements. */
export function buildMeetingMessage(meeting: Meeting): string {
    return [
        `Hi ${getFirstName(meeting.employeeName)},`,
        '',
        'Your meeting with Running Chores has been scheduled.',
        '',
        'Meeting:',
        meeting.title,
        '',
        'Date:',
        formatLongDate(meeting.startTime),
        '',
        'Time:',
        formatTimeRange(meeting.startTime, meeting.endTime),
        '',
        'Google Meet:',
        meeting.meetUrl ?? '',
        '',
        'Please join using the above Google Meet link.',
        '',
        'Regards,',
        'Running Chores',
    ].join('\n')
}

export function getWhatsAppShareUrl(phone: string, message: string): string {
    const digits = normalizeWhatsAppNumber(phone)
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/**
 * Opens WhatsApp for the employee with the invitation pre-filled.
 * Resolves false when the browser refuses to open the link (E5).
 */
export function sendMeetingInvite(phone: string, message: string): boolean {
    const url = getWhatsAppShareUrl(phone, message)
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    return opened !== null
}

export function shareOnWhatsApp(phone: string, message: string): boolean {
    if (!hasWhatsAppNumber(phone)) return false
    return sendMeetingInvite(phone, message)
}

/**
 * Invite for someone we can only reach by phone.
 *
 * The mentor form collects no email, so there is no calendar invitation to
 * send — the Meet link is delivered over WhatsApp instead. Kept separate from
 * `buildMeetingMessage` so the copy is honest about what was (and was not)
 * sent.
 */
export function buildPhoneOnlyMessage(input: {
    employeeName: string
    title: string
    startTime: string
    endTime: string
    meetUrl?: string
}): string {
    return [
        `Hi ${getFirstName(input.employeeName)},`,
        '',
        'Your meeting with Running Chores has been scheduled.',
        '',
        'Meeting:',
        input.title,
        '',
        'Date:',
        formatLongDate(input.startTime),
        '',
        'Time:',
        formatTimeRange(input.startTime, input.endTime),
        '',
        'Google Meet:',
        input.meetUrl ?? '',
        '',
        'Please join using the above Google Meet link.',
        '',
        'Regards,',
        'Running Chores',
    ].join('\n')
}
