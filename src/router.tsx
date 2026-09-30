import AjantaTyresApp from './portfolio/ajanta-tyres/App'
import RcEventsApp from './portfolio/rc-events/app/App'
import ArihantAssociatesApp from './portfolio/arihant-associates/App'
import EmployeePortalApp from './admin/App'
import MeetPage from './portfolio/meet/MeetPage'

// Re-exported so existing pages keep importing `navigate` from the registry.
// Features must import from './navigation' directly to avoid a circular import.
export { navigate } from './navigation'

export type RouteId =
    | 'home'
    | 'portfolio'
    | 'ajanta-tyres'
    | 'rc-events'
    | 'arihant-associates'
    | 'meet'
    | 'admin'
    | 'admin-login'
    | 'admin-meetings'
    | 'admin-settings'

export type Route = {
    id: RouteId
    path: string
    title: string
    description: string
    /** Hidden from the portfolio listing (used for sub-routes of a feature). */
    internal?: boolean
    render: () => JSX.Element
}

export const routes: Route[] = [
    {
        id: 'arihant-associates',
        path: '/portfolio/arihant-associates',
        title: 'Arihant Associates',
        description: 'Certified property valuation and report preparation workspace.',
        render: () => <ArihantAssociatesApp />,
    },

    {
        id: 'rc-events',
        path: '/portfolio/rc-events',
        title: 'RC Events',
        description: 'Event operations dashboard for tasks, vendors, budgets, and contacts.',
        render: () => <RcEventsApp />,
    },
    {
        id: 'ajanta-tyres',
        path: '/portfolio/ajanta-tyres',
        title: 'Ajanta Tyres',
        description: 'Tyre shop inventory, billing, and stock management wireframe.',
        render: () => <AjantaTyresApp />,
    },
    {
        id: 'admin',
        path: '/admin',
        title: 'Admin · RunningChores',
        description: 'Employee directory, Google Meet scheduling, and WhatsApp invitations.',
        internal: true,
        render: () => <EmployeePortalApp />,
    },
    {
        id: 'admin-login',
        path: '/login',
        title: 'Login · RunningChores',
        description: 'Administrator sign-in.',
        internal: true,
        render: () => <EmployeePortalApp />,
    },
    {
        id: 'admin-meetings',
        path: '/admin/meetings',
        title: 'Meetings · RunningChores',
        description: 'Local meeting history.',
        internal: true,
        render: () => <EmployeePortalApp />,
    },
    {
        id: 'admin-settings',
        path: '/admin/settings',
        title: 'Settings · RunningChores',
        description: 'Integration status and local data.',
        internal: true,
        render: () => <EmployeePortalApp />,
    },

    {
        id: 'meet',
        path: '/portfolio/meet',
        title: 'RunningChores Meet',
        description: 'Start a video meeting or join with a meeting code, powered by Jitsi.',
        render: () => <MeetPage />,
    },
]

export const projectRoutes: Route[] = routes.filter(route => !route.internal)

function normalizePath(pathname: string) {
    if (pathname.length > 1) return pathname.replace(/\/$/, '')
    return pathname
}

export function getRoute(pathname: string): RouteId | 'not-found' {
    const path = normalizePath(pathname)
    if (path === '/') return 'home'
    if (path === '/portfolio') return 'portfolio'
    const route = routes.find(item => item.path === path)
    return route?.id ?? 'not-found'
}
