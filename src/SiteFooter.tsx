import { ContactIcon } from './homepage/icons'
import { SOCIAL_LINKS } from './homepage/site'

/**
 * Site-wide footer. Shared by the landing page and the portfolio index so the
 * contact links and attribution stay in sync across both.
 */
export default function SiteFooter() {
    return (
        <footer className="mt-auto border-t border-slate-800 pt-2 pb-2">
            <div className="flex flex-col items-center gap-4 text-center text-sm text-slate-400 sm:flex-row sm:justify-between sm:text-left">
                <nav aria-label="Contact links" className="flex flex-wrap items-center justify-center gap-5 sm:justify-start">
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.type === 'email' ? undefined : '_blank'}
                            rel="noreferrer"
                            title={link.label}
                            aria-label={link.label}
                            className="inline-flex items-center gap-2 transition hover:text-cyan-300"
                        >
                            <ContactIcon type={link.type} />
                        </a>
                    ))}
                </nav>
                <div className="text-center sm:text-left">
                    <p className="mt-1 text-xs text-slate-500">
                        A platform managed by <span className="font-semibold text-cyan-300">Amita Enterprise</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
