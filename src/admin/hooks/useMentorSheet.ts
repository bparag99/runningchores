import { useCallback, useMemo, useState } from 'react'
import { fetchMentorRecords, updateMentorStatus, type MentorRecord } from '../services/googleSheets'
import { isBookableStatus, type Employee } from '../types/Employee'

/** Cache key so a page refresh does not re-hit the Sheets API immediately. */
const CACHE_KEY = 'rc.employee-portal.mentor-cache'

type CachedMentors = { records: MentorRecord[]; syncedAt: string }

/**
 * Maps a sheet row onto the portal's Employee shape.
 *
 * The sheet has no email column, so `email` is left empty. Employees without an
 * email can still be listed and their status managed, but a Google Meet invite
 * cannot be addressed to them until an email is supplied (error case E3).
 */
export function mentorToEmployee(record: MentorRecord): Employee {
    return {
        id: `sheet-${record.rowNumber}`,
        name: record.name,
        email: '',
        whatsappNumber: record.phoneNumber,
        department: record.mentorAs || undefined,
        active: isBookableStatus(record.status),
        createdAt: record.timestamp || new Date().toISOString(),
        fromSheet: true,
        sheetRowNumber: record.rowNumber,
        submittedAt: record.timestamp,
        mentorAs: record.mentorAs,
        skillDescription: record.skillDescription,
        status: record.status,
    }
}

function readCache(): CachedMentors | null {
    try {
        const raw = window.localStorage.getItem(CACHE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as Partial<CachedMentors>
        if (!Array.isArray(parsed?.records)) return null
        return { records: parsed.records, syncedAt: parsed.syncedAt ?? '' }
    } catch {
        window.localStorage.removeItem(CACHE_KEY)
        return null
    }
}

function writeCache(records: MentorRecord[]) {
    const payload: CachedMentors = { records, syncedAt: new Date().toISOString() }
    try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    } catch {
        // Quota or private mode — the in-memory copy still works.
    }
}

export function clearMentorCache() {
    try {
        window.localStorage.removeItem(CACHE_KEY)
    } catch {
        // ignore
    }
}

export function useMentorSheet() {
    const [records, setRecords] = useState<MentorRecord[]>(() => readCache()?.records ?? [])
    const [isSyncing, setSyncing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [syncedAt, setSyncedAt] = useState<string>(() => readCache()?.syncedAt ?? '')
    const [savingRow, setSavingRow] = useState<number | null>(null)

    const sync = useCallback(async () => {
        setSyncing(true)
        setError(null)
        try {
            const next = await fetchMentorRecords()
            setRecords(next)
            setSyncedAt(new Date().toISOString())
            writeCache(next)
            return next
        } catch (syncError) {
            const message = syncError instanceof Error ? syncError.message : 'Could not load the mentor list.'
            setError(message)
            throw syncError
        } finally {
            setSyncing(false)
        }
    }, [])

    /** Optimistically updates the row, then persists to the sheet. */
    const setStatus = useCallback(async (rowNumber: number, status: string) => {
        const previous = records
        const next = records.map(record => (record.rowNumber === rowNumber ? { ...record, status } : record))
        setRecords(next)
        setSavingRow(rowNumber)

        try {
            await updateMentorStatus(rowNumber, status)
            writeCache(next)
        } catch (saveError) {
            setRecords(previous) // roll back — never show a status that was not saved
            throw saveError
        } finally {
            setSavingRow(null)
        }
    }, [records])

    const employees = useMemo(() => records.map(mentorToEmployee), [records])

    return {
        records,
        employees,
        isSyncing,
        error,
        syncedAt,
        savingRow,
        sync,
        setStatus,
        clearMentorCache,
    }
}
