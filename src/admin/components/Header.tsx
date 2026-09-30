import { usePortal } from '../context/PortalContext'
import { BrandLogo } from './BrandLogo'
import { Button } from './ui/Button'

const NAV_ITEMS = [
    { path: '/admin', view: 'admin', label: 'Employees' },
    { path: '/admin/meetings', view: 'meetings', label: 'Meetings' },
    { path: '/admin/settings', view: 'settings', label: 'Settings' },
] as const

export function Header() {
    const { view, navigateTo, openMeetingDialog, signOut, googleMode, googleModeLabel, session, isGoogleConnected, connectGoogle } = usePortal()

    const badgeLabel =
        googleMode === 'demo' ? googleModeLabel : isGoogleConnected ? 'Google: Connected' : 'Google: Connect'

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <BrandLogo size="md" className="shadow-sm ring-1 ring-slate-900/5" />
                    <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-bold uppercase tracking-[0.16em] text-slate-900">Running Chores</p>
                        <p className="truncate text-xs text-slate-500">Employee Management</p>
                    </div>
                </div>

                <nav aria-label="Portal sections" className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:mx-0 sm:w-auto">
                    {NAV_ITEMS.map(item => {
                        const isActive = view === item.view
                        return (
                            <button
                                key={item.path}
                                type="button"
                                onClick={() => navigateTo(item.path)}
                                aria-current={isActive ? 'page' : undefined}
                                className={[
                                    'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                                    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
                                ].join(' ')}
                            >
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div className="ml-auto flex flex-wrap items-center gap-2.5">
                    {googleMode === 'live' ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (isGoogleConnected) return
                                void connectGoogle().catch(() => undefined)
                            }}
                            disabled={isGoogleConnected}
                            title={
                                isGoogleConnected
                                    ? 'Google is connected. Meetings are created without a sign-in prompt.'
                                    : 'Connect your Google account once so meetings are created without a sign-in prompt.'
                            }
                            className={[
                                'hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition sm:inline-flex',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
                                isGoogleConnected
                                    ? 'cursor-default bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                    : 'bg-amber-50 text-amber-800 ring-amber-600/30 hover:bg-amber-100',
                            ].join(' ')}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${isGoogleConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            />
                            {badgeLabel}
                        </button>
                    ) : (
                        <span
                            title="VITE_GOOGLE_CLIENT_ID is not set. Meetings are simulated."
                            className="hidden items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 sm:inline-flex"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {badgeLabel}
                        </span>
                    )}

                    <Button variant="primary" onClick={openMeetingDialog} className="shrink-0">
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                        </svg>
                        Create Meeting
                    </Button>

                    <Button variant="ghost" onClick={() => void signOut()} title={session ? `Signed in as ${session.userId}` : undefined}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}
