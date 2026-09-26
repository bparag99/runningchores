import SiteFooter from '../SiteFooter'
import { navigate, projectRoutes } from '../router'
import { ArrowRightIcon } from '../homepage/icons'

export default function PortfolioPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[120px]" />
                <div className="absolute -bottom-40 right-0 h-[26rem] w-[26rem] rounded-full bg-indigo-500/15 blur-[120px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 rounded-2xl text-left transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    >
                        <img
                            src="/RC_LOGO.jpg"
                            alt="Running Chores logo"
                            className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-black/40 sm:h-14 sm:w-14"
                        />
                        <span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                                RunningChores
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-400">Portfolio</span>
                        </span>
                    </button>

                    <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800/80"
                        >
                            Home
                        </button>
                    </nav>
                </header>

                <section className="mt-16 sm:mt-20">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Portfolio</p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                        Products and operational experiences we build.
                    </h1>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                        A selection of live wireframes and workspaces running under RunningChores — each one built to
                        solve a real, practical problem.
                    </p>
                </section>

                <section className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Portfolio projects">
                    {projectRoutes.map(route => (
                        <article
                            key={route.id}
                            className="flex min-h-64 flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:border-cyan-400/40 hover:bg-slate-900"
                        >
                            <div>
                                <p className="font-mono text-sm text-cyan-300">{route.path}</p>
                                <h2 className="mt-5 text-2xl font-semibold">{route.title}</h2>
                                <p className="mt-3 leading-6 text-slate-400">{route.description}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(route.path)}
                                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            >
                                Open project
                                <ArrowRightIcon className="h-4 w-4" />
                            </button>
                        </article>
                    ))}
                </section>

                <SiteFooter />
            </div>
        </main>
    )
}
