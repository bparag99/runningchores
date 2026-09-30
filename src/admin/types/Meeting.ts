export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Meeting {
    id: string
    employeeId: string
    employeeName: string
    employeeEmail: string
    title: string
    /** ISO 8601 start instant. */
    startTime: string
    /** ISO 8601 end instant. */
    endTime: string
    meetUrl?: string
    googleEventId?: string
    createdAt: string
    status: MeetingStatus
    /** True when the Meet link was produced by Demo Mode rather than the real API. */
    isDemo?: boolean
    /** True when no calendar invitation was sent because no email was available. */
    phoneOnly?: boolean
    /**
     * Resolved WhatsApp number, captured when the meeting was created.
     *
     * Snapshotting it means sharing still works after a sheet re-sync shifts
     * row numbers, or when the employee is no longer in the synced list.
     */
    whatsappNumber?: string
}

export type MeetingDraft = {
    employeeId: string
    title: string
    date: string
    startTime: string
    durationMinutes: number
    description: string
}

export type MeetingFieldErrors = Partial<Record<keyof MeetingDraft, string>>
