import { PortalProvider, usePortal } from '../context/PortalContext'
import { CreateMeetingDialog } from '../components/CreateMeetingDialog'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Header } from '../components/Header'
import { MeetingSuccessDialog } from '../components/MeetingSuccessDialog'
import { ToastProvider } from '../components/Toast'
import { Admin } from '../pages/Admin'
import { Login } from '../pages/Login'
import { Meetings } from '../pages/Meetings'
import { Settings } from '../pages/Settings'
import '../styles/portal.css'

function PortalView() {
    const { view, isAuthenticated } = usePortal()

    if (view === 'login' || !isAuthenticated) return <Login />

    return (
        <div className="rc-portal min-h-screen bg-slate-100">
            <Header />
            {view === 'admin' && <Admin />}
            {view === 'meetings' && <Meetings />}
            {view === 'settings' && <Settings />}
            <CreateMeetingDialog />
            <MeetingSuccessDialog />
        </div>
    )
}

export function EmployeePortalApp() {
    return (
        <ErrorBoundary>
            <PortalProvider>
                <ToastProvider>
                    <PortalView />
                </ToastProvider>
            </PortalProvider>
        </ErrorBoundary>
    )
}
