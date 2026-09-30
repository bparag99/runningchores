/**
 * Google Calendar + Meet integration.
 *
 * This is the ONLY module that knows about the Calendar API. UI components
 * call `authenticateGoogle()` and `createGoogleMeetMeeting()` and never touch
 * the Calendar API directly, so the whole integration can be replaced later
 * (e.g. with a small backend proxy) without redesigning any component.
 *
 * The OAuth session itself lives in `./googleAuth` so Calendar and Sheets
 * share one sign-in.
 *
 * Security rules enforced here (see DESIGN.md §2 / §7):
 *  - No Gmail password, service-account private key, or client secret.
 *  - A failure is never reported as success.
 */

import {
    authenticateGoogle,
    delay,
    getGoogleAccessToken,
    getGoogleMode,
    GoogleApiError,
    GoogleAuthError,
    type GoogleIntegrationMode,
} from './googleAuth'

export {
    authenticateGoogle,
    getGoogleMode,
    GoogleApiError,
    GoogleAuthError,
    isGoogleAuthenticated,
    resetGoogleAuth,
    type GoogleIntegrationMode,
} from './googleAuth'

const CALENDAR_EVENTS_ENDPOINT = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

/** Default organizer account when VITE_ADMIN_EMAIL is not set. */
const DEFAULT_ADMIN_EMAIL = 'runningchores@gmail.com'

/**
 * The Running Chores account that signs in to Google and owns every meeting
 * created by this portal. Override it with VITE_ADMIN_EMAIL.
 */
export const ORGANIZER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.trim() || DEFAULT_ADMIN_EMAIL

export type CreateMeetingInput = {
    title: string
    description: string
    /** ISO 8601 instants. */
    startTime: string
    endTime: string
    attendeeEmail: string
}
export type CreatedMeeting = {
    meetUrl: string
    googleEventId: string
    htmlLink?: string
    isDemo: boolean
}

export function getGoogleModeLabel(): string {
    return getGoogleMode() === 'live' ? 'Google: Live' : 'Google Integration: Demo Mode'
}

function getTimeZone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    } catch {
        return 'UTC'
    }
}

export async function createGoogleMeetMeeting(input: CreateMeetingInput): Promise<CreatedMeeting> {
    if (!input.title.trim()) throw new GoogleApiError('A meeting title is required.')

    if (getGoogleMode() === 'demo') {
        await delay(700)
        return createDemoMeeting(input)
    }

    // Throws GoogleAuthError if the admin still needs to sign in.
    const token = await getGoogleAccessToken()

    const timeZone = getTimeZone()
    const requestId = buildRequestId(input.startTime)
    const attendeeEmail = input.attendeeEmail.trim()

    const payload = {
        summary: input.title.trim(),
        description: input.description.trim() || `Meeting organised by ${ORGANIZER_EMAIL}.`,
        start: { dateTime: input.startTime, timeZone },
        end: { dateTime: input.endTime, timeZone },
        // Omitted when we have no address for the attendee (mentor form collects
        // no email); the Meet link is then delivered over WhatsApp instead.
        ...(attendeeEmail ? { attendees: [{ email: attendeeEmail }] } : {}),
        conferenceData: {
            createRequest: {
                requestId,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
        },
    }

    let response: Response
    try {
        response = await fetch(`${CALENDAR_EVENTS_ENDPOINT}?conferenceDataVersion=1&sendUpdates=all`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
    } catch {
        throw new GoogleApiError('Unable to reach Google Calendar. Check your connection and try again.')
    }

    if (!response.ok) throw await toApiError(response)

    const event = (await response.json()) as { hangoutLink?: string; id?: string; htmlLink?: string }

    // A live response without a Meet link is a failure, not a success.
    if (!event.hangoutLink) throw new GoogleApiError('Google did not return a Meet link for this event.')

    return {
        meetUrl: event.hangoutLink,
        googleEventId: event.id ?? '',
        htmlLink: event.htmlLink,
        isDemo: false,
    }
}

/** Maps an HTTP failure onto a typed, human-readable error. */
async function toApiError(response: Response): Promise<GoogleApiError | GoogleAuthError> {
    if (response.status === 401 || response.status === 403) {
        return new GoogleAuthError()
    }

    if (response.status === 404) {
        return new GoogleApiError(
            'The Google Calendar API is not enabled for this project. Enable it in Google Cloud, then try again.'
        )
    }

    // Surface Google's own message when present — it is far more useful.
    try {
        const body = (await response.json()) as { error?: { message?: string } }
        if (body?.error?.message) {
            const detail = body.error.message
            if (/insufficientPermissions|has insufficient scope/i.test(detail)) {
                return new GoogleAuthError(
                    'Google denied access: this account has not granted the Calendar permission. Sign out of Google and sign in again, then re-approve the consent screen.',
                    'insufficientPermissions'
                )
            }
            if (/notFound|not found/i.test(detail)) {
                return new GoogleApiError('The signed-in Google account could not be found. Try a different account.')
            }
            return new GoogleApiError(`Google Calendar error: ${detail}`)
        }
    } catch {
        // Fall through to the generic message.
    }

    return new GoogleApiError('Unable to create the Google Meet. Please try again.')
}

/* -------------------------------------------------------------------------- */
/*  Demo mode                                                                 */
/* -------------------------------------------------------------------------- */

function createDemoMeeting(input: CreateMeetingInput): CreatedMeeting {
    const seed = `${input.startTime}${input.attendeeEmail}`
    let hash = 0
    for (let index = 0; index < seed.length; index += 1) {
        hash = (hash * 31 + seed.charCodeAt(index)) % 1_000_000
    }
    const code = hash.toString(36).padStart(6, '0').slice(0, 6)

    return {
        meetUrl: `https://meet.google.com/demo-${code.slice(0, 3)}-${code.slice(3)}`,
        googleEventId: `demo-event-${code}`,
        isDemo: true,
    }
}

function buildRequestId(startTime: string): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return `rc-${startTime}-${Date.now().toString(36)}`
}
