import AjantaTyresApp from './portfolio/ajanta-tyres/App'
import RcEventsApp from './portfolio/rc-events/app/App'
import ArihantAssociatesApp from './portfolio/arihant-associates/App'
import MeetPage from './meet/MeetPage'

export type RouteId =
    | 'home'
    | 'portfolio'
    | 'ajanta-tyres'
    | 'rc-events'
    | 'arihant-associates'
    | 'meet'

export type Route = {
    id: RouteId
    path: string
    title: string
    description: string
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
        id: 'meet',
        path: '/meet',
        title: 'Meet · RunningChores',
        description: 'Start a video meeting or join with a meeting code.',
        render: () => <MeetPage />,
    },
]

export const projectRoutes: Route[] = routes.filter(route => route.id !== 'meet')

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

export function navigate(path: string) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
}
