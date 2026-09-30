import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { navigate } from '../../navigation'
import { authProvider, type AuthSession } from '../services/auth'
import { getGoogleMode, getGoogleModeLabel, ORGANIZER_EMAIL, resetGoogleAuth, isGoogleAuthenticated, authenticateGoogle } from '../services/googleCalendar'
import { getSheetUrl } from '../services/googleSheets'
import { useEmployees } from '../hooks/useEmployees'
import { useMentorSheet, clearMentorCache } from '../hooks/useMentorSheet'
import { useMeetings } from '../hooks/useMeetings'
import type { Meeting } from '../types/Meeting'

export type PortalView = 'login' | 'admin' | 'meetings' | 'settings'

const PATH_TO_VIEW: Record<string, PortalView> = {
    '/login': 'login',
    '/admin': 'admin',
    '/admin/meetings': 'meetings',
    '/admin/settings': 'settings',
}

function readView(): PortalView {
    return PATH_TO_VIEW[window.location.pathname] ?? 'admin'
}

type PortalContextValue = {
    view: PortalView
    navigateTo: (path: '/admin' | '/admin/meetings' | '/admin/settings') => void
    session: AuthSession | null
    isAuthenticated: boolean
    signIn: (userId: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    googleMode: ReturnType<typeof getGoogleMode>
    googleModeLabel: string
    isGoogleConnected: boolean
    connectGoogle: () => Promise<void>
    organizerEmail: string
    demoUserId: string
    /** Locally added employees. */
    employees: ReturnType<typeof useEmployees>
    /** Employees synced from the "Become a Mentor" Google Sheet. */
    mentors: ReturnType<typeof useMentorSheet>
    /** Sheet rows first, then locally added employees. */
    allEmployees: ReturnType<typeof useEmployees>['employees']
    sheetUrl: string
    meetings: ReturnType<typeof useMeetings>
    isMeetingDialogOpen: boolean
    openMeetingDialog: () => void
    closeMeetingDialog: () => void
    createdMeeting: Meeting | null
    setCreatedMeeting: (meeting: Meeting | null) => void
    resetAllData: () => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
    const [view, setView] = useState<PortalView>(readView)
    const [session, setSession] = useState<AuthSession | null>(() => authProvider.restoreSession())
    const [isMeetingDialogOpen, setMeetingDialogOpen] = useState(false)
    const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null)
    const [isGoogleConnected, setGoogleConnected] = useState(false)

    const employees = useEmployees()
    const mentors = useMentorSheet()
    const meetings = useMeetings()

    /** Sheet rows are the employee database; local entries are additive. */
    const allEmployees = useMemo(
        () => [...mentors.employees, ...employees.employees],
        [mentors.employees, employees.employees]
    )

    // The repository shell already re-renders on `popstate`; the portal mirrors
    // the pathname so browser back/forward works across its own routes.
    useEffect(() => {
        const syncView = () => setView(readView())
        window.addEventListener('popstate', syncView)
        return () => window.removeEventListener('popstate', syncView)
    }, [])

    const isAuthenticated = session !== null

    /**
     * Restores any cached Google session on load so the Create Meeting button
     * does not trigger a sign-in popup for an admin who is already connected.
     */
    useEffect(() => {
        if (!isAuthenticated) return
        setGoogleConnected(isGoogleAuthenticated())
    }, [isAuthenticated])

    // Route guards (DESIGN.md §3.1)
    useEffect(() => {
        if (!isAuthenticated && view !== 'login') {
            navigate('/login')
            setView('login')
            return
        }
        if (isAuthenticated && view === 'login') {
            navigate('/admin')
            setView('admin')
        }
    }, [isAuthenticated, view])

    const navigateTo = useCallback((path: '/admin' | '/admin/meetings' | '/admin/settings') => {
        navigate(path)
        setView(readView())
    }, [])

    const signIn = useCallback(async (userId: string, password: string) => {
        const nextSession = await authProvider.signIn({ userId, password })
        setSession(nextSession)
        navigate('/admin')
        setView('admin')

        // Connect Google up-front so the admin is not interrupted by an OAuth
        // popup when they later press "Create Meeting". Failures are silent:
        // the meeting dialog surfaces them if Google is genuinely needed.
        if (getGoogleMode() === 'live') {
            try {
                await authenticateGoogle()
                setGoogleConnected(true)
            } catch {
                setGoogleConnected(false)
            }
        }
    }, [])

    const signOut = useCallback(async () => {
        await authProvider.signOut()
        resetGoogleAuth()
        setGoogleConnected(false)
        setSession(null)
        setCreatedMeeting(null)
        setMeetingDialogOpen(false)
        navigate('/login')
        setView('login')
    }, [])

    const openMeetingDialog = useCallback(() => {
        setCreatedMeeting(null)
        setMeetingDialogOpen(true)
    }, [])

    /** Manual "Connect Google" from the header, for when the cached token expired. */
    const connectGoogle = useCallback(async () => {
        try {
            await authenticateGoogle()
            setGoogleConnected(true)
        } catch {
            setGoogleConnected(false)
            throw new Error('Google sign-in failed.')
        }
    }, [])

    const closeMeetingDialog = useCallback(() => {
        setMeetingDialogOpen(false)
        setCreatedMeeting(null)
    }, [])

    const resetAllData = useCallback(() => {
        employees.resetEmployees()
        meetings.resetMeetings()
        // The sheet cache mirrors Google rather than holding user data — drop it
        // so the next visit re-reads the sheet instead of showing deleted rows.
        clearMentorCache()
    }, [employees.resetEmployees, meetings.resetMeetings, mentors.clearMentorCache])

    const value = useMemo<PortalContextValue>(
        () => ({
            view,
            navigateTo,
            session,
            isAuthenticated,
            signIn,
            signOut,
            googleMode: getGoogleMode(),
            googleModeLabel: getGoogleModeLabel(),
            isGoogleConnected,
            connectGoogle,
            organizerEmail: ORGANIZER_EMAIL,
            demoUserId: authProvider.getDemoUserId(),
            employees,
            mentors,
            allEmployees,
            sheetUrl: getSheetUrl(),
            meetings,
            isMeetingDialogOpen,
            openMeetingDialog,
            closeMeetingDialog,
            createdMeeting,
            setCreatedMeeting,
            resetAllData,
        }),
        [
            view,
            navigateTo,
            session,
            isAuthenticated,
            signIn,
            signOut,
            isGoogleConnected,
            connectGoogle,
            employees,
            mentors,
            allEmployees,
            meetings,
            isMeetingDialogOpen,
            openMeetingDialog,
            closeMeetingDialog,
            createdMeeting,
            resetAllData,
        ]
    )

    return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
    const context = useContext(PortalContext)
    if (!context) throw new Error('usePortal must be used inside PortalProvider')
    return context
}
