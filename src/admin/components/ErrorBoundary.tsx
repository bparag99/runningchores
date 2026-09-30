import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * Keeps a rendering failure inside the portal from blanking the whole app.
 * The admin still gets a way out (reload / back to employees) instead of a
 * white screen (DESIGN.md §12).
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Employee portal crashed:', error, info.componentStack)
    }

    handleReload = () => {
        this.setState({ error: null })
        window.location.reload()
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 text-center">
                <div className="max-w-md">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-1 ring-rose-600/20">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 8v5M12 17h.01" strokeLinecap="round" />
                            <circle cx="12" cy="12" r="9" />
                        </svg>
                    </span>
                    <h1 className="mt-4 text-xl font-semibold text-slate-900">Something went wrong</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        The portal hit an unexpected error. Your employees and meetings are still saved in this browser.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="mt-6 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
                    >
                        Reload portal
                    </button>
                </div>
            </main>
        )
    }
}
