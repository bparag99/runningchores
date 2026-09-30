import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { Meeting, MeetingStatus } from '../types/Meeting'

const STORAGE_KEY = 'rc.employee-portal.meetings'

function createMeetingId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return `mtg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** Meetings are "upcoming" until their start instant has passed. */
function deriveStatus(meeting: Meeting): MeetingStatus {
    if (meeting.status === 'cancelled') return 'cancelled'
    return new Date(meeting.startTime).getTime() < Date.now() ? 'completed' : 'upcoming'
}

export function useMeetings() {
    const [meetings, setMeetings, reset] = useLocalStorage<Meeting[]>(STORAGE_KEY, [])

    const addMeeting = useCallback(
        (meeting: Omit<Meeting, 'id' | 'createdAt' | 'status'>): Meeting => {
            const record: Meeting = {
                ...meeting,
                id: createMeetingId(),
                createdAt: new Date().toISOString(),
                status: 'upcoming',
            }
            setMeetings(previous => [record, ...previous])
            return record
        },
        [setMeetings]
    )

    const cancelMeeting = useCallback(
        (id: string) => {
            setMeetings(previous =>
                previous.map(meeting => (meeting.id === id ? { ...meeting, status: 'cancelled' } : meeting))
            )
        },
        [setMeetings]
    )

    const deleteMeeting = useCallback(
        (id: string) => {
            setMeetings(previous => previous.filter(meeting => meeting.id !== id))
        },
        [setMeetings]
    )

    const sortedMeetings = useMemo(
        () => [...meetings].sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
        [meetings]
    )

    return {
        meetings,
        sortedMeetings,
        addMeeting,
        cancelMeeting,
        deleteMeeting,
        resetMeetings: reset,
        deriveStatus,
    }
}
