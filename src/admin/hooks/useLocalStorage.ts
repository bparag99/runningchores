import { useCallback, useEffect, useState } from 'react'

/**
 * `useState` backed by `localStorage`.
 *
 * Reads are defensive: a missing or corrupted payload falls back to `fallback`
 * instead of throwing (error case E7 in DESIGN.md).
 */
export function useLocalStorage<T>(key: string, fallback: T) {
    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') return fallback
        try {
            const raw = window.localStorage.getItem(key)
            if (raw === null) return fallback
            return JSON.parse(raw) as T
        } catch {
            window.localStorage.removeItem(key)
            return fallback
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value))
        } catch {
            // Quota or private-mode failure: the app keeps working in memory.
        }
    }, [key, value])

    const remove = useCallback(() => {
        try {
            window.localStorage.removeItem(key)
        } catch {
            // ignore
        }
        setValue(fallback)
        // `fallback` is intentionally excluded: it is a stable literal at every call site.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key])

    return [value, setValue, remove] as const
}
