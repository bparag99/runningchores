import { useEffect, useState } from 'react'
import HomePage from './homepage/HomePage'
import PortfolioPage from './portfolio/PortfolioPage'
import { getRoute, navigate, routes, type RouteId } from './router'

function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-center text-slate-900">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">404</p>
                <h1 className="mt-3 text-3xl font-bold">Route not found</h1>
                <p className="mt-3 text-slate-500">Choose a project from the RunningChores portfolio.</p>
                <button type="button" onClick={() => navigate('/')} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700">
                    Back to home
                </button>
            </div>
        </main>
    )
}

export default function App() {
    const [routeId, setRouteId] = useState<RouteId | 'not-found'>(() => getRoute(window.location.pathname))

    useEffect(() => {
        const handlePopState = () => setRouteId(getRoute(window.location.pathname))
        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    useEffect(() => {
        const route = routes.find(item => item.id === routeId)
        document.title =
            route?.title ??
            (routeId === 'home'
                ? 'Running Chores'
                : routeId === 'portfolio'
                    ? 'Portfolio · Running Chores'
                    : 'Route not found')
    }, [routeId])

    if (routeId === 'home') return <HomePage />
    if (routeId === 'portfolio') return <PortfolioPage />
    if (routeId === 'not-found') return <NotFoundPage />
    return routes.find(route => route.id === routeId)?.render() ?? <NotFoundPage />
}
