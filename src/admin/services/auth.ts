/**
 * Authentication abstraction.
 *
 * The portal is frontend-only, so the default `AuthProvider` validates the
 * submitted password against the `PASSWORD` environment variable, which is
 * supplied as a secret by the hosting provider (Vercel, Netlify, CI, .env…).
 *
 * SECURITY: Vite compiles this value into the client bundle, so it is NOT a
 * true secret — anyone who loads the page can read it from the JS or the
 * network tab. It raises the bar against casual access, not against a
 * determined user. See src/admin/README-ENV.md. Replace the implementation
 * below with a real identity provider to get genuine authentication; no UI
 * component needs to change.
 */

const SESSION_KEY = 'rc.employee-portal.session'

const DEFAULT_USER_ID = 'admin'

/** Used only when no PASSWORD secret is configured, so the app still runs. */
const FALLBACK_PASSWORD = 'admin123'

export type Credentials = {
    userId: string
    password: string
}

export type AuthSession = {
    userId: string
    issuedAt: string
}

export interface AuthProvider {
    signIn(credentials: Credentials): Promise<AuthSession>
    signOut(): Promise<void>
    restoreSession(): AuthSession | null
    /** User id surfaced on the login screen as a hint. */
    getDemoUserId(): string
    /** True when a real PASSWORD secret was supplied. */
    isPasswordConfigured(): boolean
}

/** Reads the admin password straight from the `PASSWORD` env secret. */
function getEnvPassword(): string {
    return import.meta.env.PASSWORD || FALLBACK_PASSWORD
}

function readEnvCredentials() {
    return {
        userId: import.meta.env.VITE_ADMIN_USER_ID?.trim() || DEFAULT_USER_ID,
        password: getEnvPassword(),
    }
}

/** Length-independent comparison; avoids leaking the password via timing. */
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let mismatch = 0
    for (let i = 0; i < a.length; i += 1) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return mismatch === 0
}

const demoAuthProvider: AuthProvider = {
    async signIn({ userId, password }) {
        const expected = readEnvCredentials()

        // Small artificial delay so the button's loading state is visible.
        await new Promise(resolve => setTimeout(resolve, 350))

        if (userId.trim() !== expected.userId || !safeEqual(password, expected.password)) {
            throw new Error('Invalid user ID or password.')
        }

        const session: AuthSession = { userId: expected.userId, issuedAt: new Date().toISOString() }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        return session
    },

    async signOut() {
        localStorage.removeItem(SESSION_KEY)
    },

    restoreSession() {
        try {
            const raw = localStorage.getItem(SESSION_KEY)
            if (!raw) return null
            const parsed = JSON.parse(raw) as Partial<AuthSession>
            if (!parsed?.userId || !parsed?.issuedAt) return null
            return { userId: parsed.userId, issuedAt: parsed.issuedAt }
        } catch {
            // Corrupted payload (E7): drop it and treat the admin as signed out.
            localStorage.removeItem(SESSION_KEY)
            return null
        }
    },

    getDemoUserId() {
        return readEnvCredentials().userId
    },

    isPasswordConfigured() {
        return Boolean(import.meta.env.PASSWORD)
    },
}

export const authProvider: AuthProvider = demoAuthProvider
