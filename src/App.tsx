import { useEffect, useState } from 'react'
import AjantaTyresApp from './features/ajanta-tyres/App'
import RcEventsApp from './features/rc-events/app/App'

type RouteId = 'home' | 'ajanta-tyres' | 'rc-events'

type Route = {
    id: RouteId
    path: string
    title: string
    description: string
    render: () => JSX.Element
}

const routes: Route[] = [

    {
        id: 'rc-events',
        path: '/rc-events',
        title: 'RC Events',
        description: 'Event operations dashboard for tasks, vendors, budgets, and contacts.',
        render: () => <RcEventsApp />,
    },
    {
        id: 'ajanta-tyres',
        path: '/AjantaTyres',
        title: 'Ajanta Tyres',
        description: 'Tyre shop inventory, billing, and stock management wireframe.',
        render: () => <AjantaTyresApp />,
    },
]

function normalizePath(pathname: string) {
    if (pathname.length > 1) return pathname.replace(/\/$/, '')
    return pathname
}

function getRoute(pathname: string): RouteId | 'not-found' {
    const path = normalizePath(pathname)
    if (path === '/') return 'home'
    const route = routes.find(item => item.path === path)
    return route?.id ?? 'not-found'
}

function navigate(path: string) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
}

function HomePage() {
    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-white sm:px-10">
            <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col">
                <header>
                    <div className="flex items-center gap-4">
                        <img src="/RC_LOGO.jpg" alt="Running Chores logo" className="h-16 w-16 rounded-2xl object-cover shadow-lg shadow-black/30 sm:h-20 sm:w-20" />
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">RunningChores</p>
                            <p className="mt-1 text-sm text-slate-400">A platform managed by Parag Bajaj</p>
                        </div>
                    </div>
                    <div className="mt-4 max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">A focused platform for thoughtful digital work.</h1>
                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                            RunningChores brings practical products and operational experiences together in one evolving workspace, managed by <span className="font-semibold text-white">Parag Bajaj</span>.
                        </p>
                    </div>
                </header>

                <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Available routes">
                    {routes.map(route => (
                        <article key={route.id} className="flex min-h-64 flex-col justify-between rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/20">
                            <div>
                                <p className="font-mono text-sm text-cyan-300">{route.path}</p>
                                <h2 className="mt-5 text-2xl font-semibold">{route.title}</h2>
                                <p className="mt-3 leading-6 text-slate-400">{route.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(route.path)}
                                className="mt-8 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                Open wireframe
                            </button>
                        </article>
                    ))}
                </section>

                <footer className="mt-auto border-t border-slate-800 pt-8">
                    <div className="flex flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>RunningChores · Managed by Parag Bajaj</p>
                        <nav aria-label="Contact links" className="flex flex-wrap gap-x-5 gap-y-2">
                            <a href="https://github.com/bparag99" target="_blank" rel="noreferrer" className="transition hover:text-cyan-300">GitHub · bparag99 (Parag)</a>
                            <a href="https://www.instagram.com/_mr_bajaj_/" target="_blank" rel="noreferrer" className="transition hover:text-cyan-300">Instagram · _mr_bajaj_</a>
                            <a href="mailto:bparag99@gmail.com" className="transition hover:text-cyan-300">Gmail · bparag99@gmail.com</a>
                        </nav>
                    </div>
                </footer>
            </div>
        </main>
    )
}

function NotFoundPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-center text-slate-900">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">404</p>
                <h1 className="mt-3 text-3xl font-bold">Route not found</h1>
                <p className="mt-3 text-slate-500">Choose a wireframe from the RunningChores home page.</p>
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
        document.title = route?.title ?? (routeId === 'home' ? 'RunningChores' : 'Route not found')
    }, [routeId])

    if (routeId === 'home') return <HomePage />
    if (routeId === 'not-found') return <NotFoundPage />
    return routes.find(route => route.id === routeId)?.render() ?? <NotFoundPage />
}
