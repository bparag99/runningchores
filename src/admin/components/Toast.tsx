import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'

type ToastVariant = 'success' | 'error' | 'info'

type Toast = {
    id: number
    variant: ToastVariant
    message: string
}

type ToastContextValue = {
    showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const VARIANT_STYLES: Record<ToastVariant, string> = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    error: 'border-rose-200 bg-rose-50 text-rose-900',
    info: 'border-slate-200 bg-white text-slate-900',
}

const ICONS: Record<ToastVariant, string> = {
    success: 'M5 13l4 4L19 7',
    error: 'M6 6l12 12M18 6L6 18',
    info: 'M12 8h.01M11 12h1v5h1',
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const nextId = useRef(0)

    const dismiss = useCallback((id: number) => {
        setToasts(previous => previous.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback(
        (message: string, variant: ToastVariant = 'info') => {
            const id = nextId.current++
            setToasts(previous => [...previous, { id, variant, message }])
            window.setTimeout(() => dismiss(id), 4000)
        },
        [dismiss]
    )

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                aria-atomic="false"
                className="pointer-events-none fixed right-4 top-20 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 sm:right-6"
            >
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        role="status"
                        className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg shadow-slate-900/5 ${VARIANT_STYLES[toast.variant]}`}
                    >
                        <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d={ICONS[toast.variant]} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="flex-1 leading-5">{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => dismiss(toast.id)}
                            aria-label="Dismiss notification"
                            className="-mr-1 rounded p-0.5 opacity-60 transition hover:opacity-100"
                        >
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used inside ToastProvider')
    return context
}
