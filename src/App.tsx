import { useEffect, useState } from 'react'
import AjantaTyresApp from './features/ajanta-tyres/App'
import RcEventsApp from './features/rc-events/app/App'
import ArihantAssociatesApp from './features/arihant-associates/App'

type RouteId = 'home' | 'ajanta-tyres' | 'rc-events' | 'arihant-associates'

type Route = {
    id: RouteId
    path: string
    title: string
    description: string
    render: () => JSX.Element
}

const routes: Route[] = [
    {
        id: 'arihant-associates',
        path: '/arihant-associates',
        title: 'Arihant Associates',
        description: 'Certified property valuation and report preparation workspace.',
        render: () => <ArihantAssociatesApp />,
    },

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

function ContactIcon({ type }: { type: 'github' | 'instagram' | 'whatsapp' | 'email' }) {
    if (type === 'whatsapp') {
        return (
            <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.5 11.5a8.5 8.5 0 01-12.7 7.4L3.5 20l1.1-4.1A8.5 8.5 0 1120.5 11.5z" />
                <path d="M8.3 8.2c.2-.3.5-.3.8-.1l1.1.8c.3.2.3.5.2.8l-.4.7c.5 1 1.3 1.8 2.3 2.3l.7-.4c.3-.2.6-.1.8.2l.8 1.1c.2.3.2.6-.1.8-.4.4-1 .6-1.6.4a7.3 7.3 0 01-4.9-4.9c-.2-.6 0-1.2.3-1.7z" />
            </svg>
        )
    }

    const paths = {
        github: 'M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.92c.85 0 1.71.12 2.51.36 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z',
        instagram: 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1112 16.5 4.5 4.5 0 0112 7.5zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zM17.5 6.5a1 1 0 110 2 1 1 0 010-2z',
        email: 'M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v.5l9 5.5 9-5.5V7H3zm18 10V9.84l-8.48 5.19a1 1 0 01-1.04 0L3 9.84V17h18z',
    }

    return (
        <svg aria-hidden="true" className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24">
            <path d={paths[type]} />
        </svg>
    )
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
                        <nav aria-label="Contact links" className="flex flex-wrap gap-x-5 gap-y-2 sm:flex-1 sm:justify-end">
                            <a href="https://github.com/bparag99" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-cyan-300"><ContactIcon type="github" />GitHub</a>
                            <a href="https://www.instagram.com/_mr_bajaj_/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-cyan-300"><ContactIcon type="instagram" />Instagram</a>
                            <a href="https://wa.me/917869730151" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition hover:text-cyan-300"><ContactIcon type="whatsapp" />WhatsApp</a>
                            <a href="mailto:bparag99@gmail.com" className="inline-flex items-center gap-2 transition hover:text-cyan-300"><ContactIcon type="email" />Gmail</a>
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
