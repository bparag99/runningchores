import SiteFooter from '../SiteFooter'
import { navigate } from '../router'
import {
    ArrowRightIcon,
    ContactUsIcon,
    GlobeIcon,
    LinkedInIcon,
    MentorIcon,
    PortfolioIcon,
    SparkIcon,
} from './icons'
import {
    CONTACT_FORM_URL,
    HASHTAGS,
    LINKEDIN_COMPANY_URL,
    MENTOR_FORM_URL,
    MENTOR_STEPS,
    PILLARS,
    UPCOMING,
} from './site'

const buttonBase =
    'inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'

const primaryButton = `${buttonBase} bg-cyan-400 text-slate-950 hover:bg-cyan-300`
const ghostButton = `${buttonBase} border border-slate-700 bg-slate-900/60 text-white hover:border-slate-500 hover:bg-slate-800/80`

export default function HomePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            {/* Ambient background */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-[120px]" />
                <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.14)_1px,transparent_0)] [background-size:2.5rem_2.5rem]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 sm:px-10">
                {/* Header */}
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
                            <span className="mt-0.5 block text-xs text-slate-400">Mentor. Consult. Build.</span>
                        </span>
                    </button>

                    <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
                        <button type="button" onClick={() => navigate('/portfolio')} className={ghostButton}>
                            <PortfolioIcon className="h-4 w-4" />
                            Portfolio
                        </button>
                    </nav>
                </header>

                {/* Hero */}
                <section className="mt-16 sm:mt-24">
                    <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-cyan-200">
                        <GlobeIcon className="h-4 w-4" />
                        Hello, World!
                    </p>

                    <h1 className="mt-7 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                        Running Chores is{' '}
                        <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                            officially open.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                        We&apos;re excited to announce that Running Chores is opening its doors. We are building a platform
                        focused on three core areas — each one built to help people and organisations move forward with
                        clarity.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-3">
                        <a href={LINKEDIN_COMPANY_URL} target="_blank" rel="noreferrer" className={primaryButton}>
                            <LinkedInIcon className="h-4 w-4" />
                            Visit our LinkedIn Page
                        </a>
                        <button type="button" onClick={() => navigate('/portfolio')} className={ghostButton}>
                            <PortfolioIcon className="h-4 w-4" />
                            Explore the portfolio
                        </button>
                    </div>

                    <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            { label: 'Core areas', value: '03' },
                            { label: 'Focus', value: 'Mentor' },
                            { label: 'Engagements', value: 'Consult' },
                            { label: 'Delivery', value: 'Build' },
                        ].map(item => (
                            <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur">
                                <dt className="text-[11px] uppercase tracking-wider text-slate-500">{item.label}</dt>
                                <dd className="mt-1 text-lg font-semibold text-cyan-300">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Pillars */}
                <section className="mt-24" aria-labelledby="pillars-heading">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">What we do</p>
                        <h2 id="pillars-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                            Three core areas, one platform
                        </h2>
                        <p className="mt-4 leading-7 text-slate-400">
                            Every engagement is grounded in real expertise and technology that works — from
                            one-to-one mentoring to full enterprise delivery.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {PILLARS.map(pillar => (
                            <article
                                key={pillar.id}
                                className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:border-cyan-400/40 hover:bg-slate-900"
                            >
                                <span
                                    aria-hidden="true"
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl transition group-hover:border-cyan-400/40"
                                >
                                    {pillar.emoji}
                                </span>
                                <h3 className="mt-6 text-xl font-semibold">{pillar.title}</h3>
                                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{pillar.description}</p>
                                <ul className="mt-6 space-y-2 border-t border-slate-800 pt-5">
                                    {pillar.points.map(point => (
                                        <li key={point} className="flex items-center gap-2 text-sm text-slate-300">
                                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                                {pillar.cta && (
                                    <a
                                        href={pillar.cta.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`${ghostButton} mt-6 w-full`}
                                    >
                                        <MentorIcon className="h-4 w-4" />
                                        {pillar.cta.label}
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                </section>

                {/* Become a mentor */}
                <section className="mt-24" aria-labelledby="mentor-heading">
                    <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8 sm:p-12">
                        <span
                            aria-hidden="true"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-950 text-2xl"
                        >
                            🎓
                        </span>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                            Freelance opportunity
                        </p>
                        <h2 id="mentor-heading" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                            Got real-world skills? Become a mentor.
                        </h2>
                        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                            This is not a support or help-desk for people looking for mentoring. It is the other way
                            round: you sign up with the experience you already have, and we introduce you to someone
                            who is looking for a mentor in your field. You choose the engagements that suit you.
                        </p>

                        <ol className="mt-10 grid gap-4 sm:grid-cols-3">
                            {MENTOR_STEPS.map(item => (
                                <li key={item.step} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                                    <span className="text-xs font-semibold tracking-widest text-cyan-300">
                                        {item.step}
                                    </span>
                                    <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-9">
                            <a href={MENTOR_FORM_URL} target="_blank" rel="noreferrer" className={primaryButton}>
                                <MentorIcon className="h-4 w-4" />
                                Become a Mentor
                            </a>
                        </div>
                    </div>
                </section>

                {/* Journey */}
                <section className="mt-24" aria-labelledby="journey-heading">
                    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 p-8 sm:p-12">
                        <SparkIcon className="h-6 w-6 text-cyan-300" />
                        <h2 id="journey-heading" className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                            This is just the beginning of our journey
                        </h2>
                        <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                            Going forward, we&apos;ll be sharing career opportunities, job openings, projects, and
                            opportunities to work and grow with us.
                        </p>

                        <div className="mt-10 grid gap-4 sm:grid-cols-2">
                            {UPCOMING.map(item => (
                                <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                                    <h3 className="font-semibold text-white">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Connect */}
                <section className="mt-24 text-center" aria-labelledby="connect-heading">
                    <h2 id="connect-heading" className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                        Let&apos;s build something worth working on.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
                        If you&apos;re a professional looking for the right opportunity, an organisation looking for
                        solutions, or an expert who wants to mentor on a freelance basis — we&apos;d love to connect.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                        <a href={CONTACT_FORM_URL} target="_blank" rel="noreferrer" className={ghostButton}>
                            <ContactUsIcon className="h-4 w-4" />
                            Contact Us
                        </a>
                        <a href={MENTOR_FORM_URL} target="_blank" rel="noreferrer" className={ghostButton}>
                            <MentorIcon className="h-4 w-4" />
                            Become a Mentor
                        </a>
                    </div>

                    <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
                        {HASHTAGS.map(tag => (
                            <li
                                key={tag}
                                className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-400"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                    <br></br>
                </section>
                {/* Footer */}
                <SiteFooter />
            </div>
            </main>
    )
}
