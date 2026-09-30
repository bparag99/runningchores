import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
    isLoading?: boolean
    fullWidth?: boolean
    children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
    primary:
        'bg-cyan-600 text-white shadow-sm hover:bg-cyan-700 disabled:bg-cyan-600/50 focus-visible:ring-cyan-500',
    secondary:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 disabled:text-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 disabled:text-slate-400',
    danger: 'bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-500',
}

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
}

export function Button({
    variant = 'secondary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    className = '',
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled || isLoading}
            aria-busy={isLoading || undefined}
            className={[
                'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed',
                VARIANTS[variant],
                SIZES[size],
                fullWidth ? 'w-full' : '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {isLoading && <Spinner />}
            {children}
        </button>
    )
}

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}
