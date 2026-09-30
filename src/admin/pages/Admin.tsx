import { useCallback, useEffect, useRef } from 'react'
import { usePortal } from '../context/PortalContext'
import { EmployeeTable } from '../components/EmployeeTable'
import { MentorTable } from '../components/MentorTable'
import { useToast } from '../components/Toast'
import { isBookableStatus } from '../types/Employee'

export function Admin() {
    const { mentors, allEmployees, openMeetingDialog, session, googleMode, isGoogleConnected, sheetUrl } = usePortal()
    const { showToast } = useToast()

    const handleSync = useCallback(async () => {
        try {
            const records = await mentors.sync()
            showToast(
                records.length === 1 ? 'Loaded 1 mentor entry.' : `Loaded ${records.length} mentor entries.`,
                'success'
            )
        } catch {
            // The table renders the error inline; no second toast needed.
        }
    }, [mentors, showToast])

    // Load the sheet once per session, after Google is connected.
    const hasSyncedRef = useRef(false)
    useEffect(() => {
        if (hasSyncedRef.current) return
        if (googleMode === 'demo' || !isGoogleConnected) return
        if (mentors.syncedAt) {
            hasSyncedRef.current = true
            return
        }
        hasSyncedRef.current = true
        void handleSync()
    }, [googleMode, isGoogleConnected, mentors.syncedAt, handleSync])

    const bookableCount = allEmployees.filter(employee => employee.active && isBookableStatus(employee.status)).length

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Employees</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        {session ? `Signed in as ${session.userId}. ` : ''}
                        {bookableCount} active {bookableCount === 1 ? 'person' : 'people'} available for scheduling.
                    </p>
                </header>

                <div className="space-y-6">
                    <MentorTable
                        records={mentors.records}
                        isSyncing={mentors.isSyncing}
                        isConnected={googleMode === 'live' && isGoogleConnected}
                        syncedAt={mentors.syncedAt}
                        savingRow={mentors.savingRow}
                        sheetUrl={sheetUrl}
                        error={mentors.error}
                        onSync={handleSync}
                        onStatusChange={mentors.setStatus}
                    />

                    <EmployeeTable employees={allEmployees} onCreateMeeting={openMeetingDialog} />
                </div>
            </div>
        </>
    )
}
