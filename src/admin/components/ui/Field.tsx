import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const CONTROL_BASE =
    'w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400'

function controlClasses(invalid?: boolean) {
    return invalid
        ? `${CONTROL_BASE} border-rose-300 focus:border-rose-400 focus:ring-rose-200`
        : `${CONTROL_BASE} border-slate-300 focus:border-cyan-500 focus:ring-cyan-100`
}

type FieldShellProps = {
    label: string
    htmlFor: string
    error?: string
    hint?: string
    required?: boolean
    children: ReactNode
}

function FieldShell({ label, htmlFor, error, hint, required, children }: FieldShellProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
                {label}
                {required && <span className="ml-0.5 text-rose-500">*</span>}
            </label>
            {children}
            {error ? (
                <p id={`${htmlFor}-error`} className="text-xs font-medium text-rose-600">
                    {error}
                </p>
            ) : hint ? (
                <p id={`${htmlFor}-hint`} className="text-xs text-slate-500">
                    {hint}
                </p>
            ) : null}
        </div>
    )
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
    label: string
    error?: string
    hint?: string
}

export function Field({ label, error, hint, required, className = '', ...rest }: FieldProps) {
    const id = useId()
    return (
        <FieldShell label={label} htmlFor={id} error={error} hint={hint} required={required}>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                className={`${controlClasses(Boolean(error))} h-11 ${className}`}
                {...rest}
            />
        </FieldShell>
    )
}

type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
    label: string
    error?: string
    hint?: string
}

export function TextArea({ label, error, hint, required, className = '', ...rest }: TextAreaProps) {
    const id = useId()
    return (
        <FieldShell label={label} htmlFor={id} error={error} hint={hint} required={required}>
            <textarea
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                className={`${controlClasses(Boolean(error))} min-h-24 py-2.5 ${className}`}
                {...rest}
            />
        </FieldShell>
    )
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
    label: string
    error?: string
    hint?: string
    children: ReactNode
}

export function Select({ label, error, hint, required, className = '', children, ...rest }: SelectProps) {
    const id = useId()
    return (
        <FieldShell label={label} htmlFor={id} error={error} hint={hint} required={required}>
            <select
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                className={`${controlClasses(Boolean(error))} h-11 pr-9 ${className}`}
                {...rest}
            >
                {children}
            </select>
        </FieldShell>
    )
}
