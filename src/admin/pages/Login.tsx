import { useState, type FormEvent } from 'react'
import { usePortal } from '../context/PortalContext'
import { authProvider } from '../services/auth'
import { BrandLogo } from '../components/BrandLogo'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'

export function Login() {
    const { signIn, demoUserId } = usePortal()
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError(null)

        if (!userId.trim() || !password) {
            setError('Enter both your user ID and password.')
            return
        }

        setSubmitting(true)
        try {
            await signIn(userId, password)
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Invalid user ID or password.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <BrandLogo size="xl" className="mx-auto shadow-sm ring-1 ring-slate-900/5" />
                    <h1 className="mt-5 text-2xl font-bold uppercase tracking-[0.18em] text-slate-900">Running Chores</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Employee Management</p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-7">
                    <div className="flex flex-col gap-4">
                        <Field
                            label="User ID"
                            required
                            value={userId}
                            onChange={event => setUserId(event.target.value)}
                            placeholder={demoUserId}
                            autoComplete="username"
                            autoFocus
                        />

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="portal-password" className="text-sm font-medium text-slate-700">
                                Password<span className="ml-0.5 text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="portal-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={event => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-3.5 pr-20 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(previous => !previous)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-medium text-rose-800"
                            >
                                {error}
                            </p>
                        )}

                        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting} className="mt-1">
                            {isSubmitting ? 'Signing in…' : 'Login'}
                        </Button>
                    </div>
                </form>

                <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                    Internal Running Chores tool. Access is limited to administrators.
                    {!authProvider.isPasswordConfigured() && (
                        <>
                            {' '}
                            No <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">PASSWORD</code> env secret set — using the
                            demo default. User ID <code className="rounded bg-slate-200 px-1 py-0.5 font-mono">{demoUserId}</code>
                        </>
                    )}
                </p>
            </div>
        </main>
    )
}
