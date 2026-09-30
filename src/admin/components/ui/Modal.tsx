import { useEffect, useRef, type ReactNode } from 'react'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    children: ReactNode
    footer?: ReactNode
    /** Widens the card for content-heavy dialogs. */
    size?: 'sm' | 'md' | 'lg'
    /** Set to false for flows where dismissing mid-request would be confusing. */
    dismissible?: boolean
}

const SIZES = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    dismissible = true,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        const { overflow } = document.body.style
        document.body.style.overflow = 'hidden'

        // Move focus into the dialog so keyboard users land in the right place.
        const focusTimer = window.setTimeout(() => {
            const target = panelRef.current?.querySelector<HTMLElement>(
                'input, select, textarea, button:not([data-autofocus="false"])'
            )
            target?.focus()
        }, 0)

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && dismissible) {
                event.preventDefault()
                onClose()
                return
            }

            if (event.key !== 'Tab' || !panelRef.current) return

            // Simple focus trap.
            const focusable = Array.from(
                panelRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
                )
            ).filter(element => element.offsetParent !== null)

            if (focusable.length === 0) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            window.clearTimeout(focusTimer)
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = overflow
            previouslyFocused?.focus?.()
        }
    }, [isOpen, dismissible, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                tabIndex={-1}
                onClick={dismissible ? onClose : undefined}
                className="absolute inset-0 h-full w-full cursor-default"
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`relative z-10 w-full ${SIZES[size]} rounded-t-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 sm:rounded-2xl`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
                    </div>
                    {dismissible && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="-mr-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>

                {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">{footer}</div>}
            </div>
        </div>
    )
}
