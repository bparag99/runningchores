/**
 * Shared Google OAuth session.
 *
 * Calendar and Sheets both need the same access token. Keeping the token here
 * means the admin signs in **once** and both services reuse that session,
 * rather than prompting separately.
 *
 * Security rules enforced here (see DESIGN.md §2):
 *  - No Gmail password, service-account private key, or client secret.
 *  - Only a public OAuth 2.0 *Web application* client id (`VITE_GOOGLE_CLIENT_ID`).
 *  - The access token is cached in `sessionStorage` for its lifetime — it dies
 *    with the tab and is never written to localStorage.
 *  - A failure is never reported as success.
 */

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'
const TOKEN_CACHE_KEY = 'rc.employee-portal.google-token'

export const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events'
export const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

/**
 * Requested scopes. Both are requested together so a single consent covers
 * meeting creation and the employee sheet. Adding a scope here requires the
 * consent screen to list it too, and users must re-consent.
 */
export const GOOGLE_SCOPES = [CALENDAR_SCOPE, SHEETS_SCOPE].join(' ')

export type GoogleIntegrationMode = 'live' | 'demo'

type TokenResponse = {
    access_token?: string
    /** Seconds until the token expires (Google returns ~3600). */
    expires_in?: number
    error?: string
    error_description?: string
}

declare global {
    interface Window {
        google?: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string
                        scope: string
                        callback: (response: TokenResponse) => void
                        error_callback: (error: { type?: string; message?: string }) => void
                    }) => {
                        requestAccessToken: (options?: { prompt?: string }) => void
                    }
                }
            }
        }
    }
}

type CachedToken = { accessToken: string; expiresAt: number }

let accessToken: string | null = null
let pendingAuth: Promise<{ mode: GoogleIntegrationMode }> | null = null
let scriptPromise: Promise<void> | null = null

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

export function getClientId(): string {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
}

export function getGoogleMode(): GoogleIntegrationMode {
    return getClientId() ? 'live' : 'demo'
}

export function getGoogleModeLabel(): string {
    return getGoogleMode() === 'live' ? 'Google: Live' : 'Google Integration: Demo Mode'
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                    */
/* -------------------------------------------------------------------------- */

export class GoogleAuthError extends Error {
    /** Raw Google error type, e.g. "access_denied" — useful for debugging. */
    code?: string
    constructor(message = 'Unable to authenticate with Google. Please sign in again.', code?: string) {
        super(message)
        this.name = 'GoogleAuthError'
        this.code = code
    }
}

export class GoogleApiError extends Error {
    constructor(message = 'Google request failed. Please try again.') {
        super(message)
        this.name = 'GoogleApiError'
    }
}

/**
 * Turns Google's OAuth error type into something an admin can act on.
 * These are console-configuration problems, so a generic "sign in again"
 * message is not useful — the user cannot fix it by retrying.
 */
function describeOAuthError(type: string | undefined, rawMessage?: string): GoogleAuthError {
    switch (type) {
        case 'access_denied':
            return new GoogleAuthError(
                'Google blocked sign-in: the OAuth consent screen is in "Testing" mode and this Google account is not a test user. Add runningchores@gmail.com under OAuth consent screen → Test users, then try again.',
                'access_denied'
            )
        case 'origin_mismatch':
            return new GoogleAuthError(
                'Google blocked sign-in: this page origin is not registered. Add the exact origin (e.g. http://localhost:5173, no trailing slash) under Credentials → your Web client → Authorised JavaScript origins.',
                'origin_mismatch'
            )
        case 'popup_closed':
        case 'user_cancelled':
            return new GoogleAuthError('Google sign-in was cancelled before finishing. Please try again.', type)
        case 'invalid_client':
            return new GoogleAuthError(
                'Google rejected the client id. Check VITE_GOOGLE_CLIENT_ID and that the OAuth client still exists.',
                'invalid_client'
            )
        case 'unauthorized_client':
            return new GoogleAuthError(
                'This OAuth client is not authorised for the requested scope. Check the scopes on the consent screen.',
                'unauthorized_client'
            )
        default:
            return new GoogleAuthError(
                rawMessage ? `Google sign-in failed: ${rawMessage}` : 'Unable to authenticate with Google. Please sign in again.',
                type
            )
    }
}

/* -------------------------------------------------------------------------- */
/*  Identity Services loader                                                  */
/* -------------------------------------------------------------------------- */

function loadGoogleIdentityServices(): Promise<void> {
    if (window.google?.accounts?.oauth2) return Promise.resolve()
    if (scriptPromise) return scriptPromise

    scriptPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`)
        if (existing) {
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', () => reject(new GoogleAuthError()))
            return
        }

        const script = document.createElement('script')
        script.src = GIS_SCRIPT_SRC
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new GoogleAuthError('Unable to load Google sign-in. Check your connection.'))
        document.head.appendChild(script)
    }).catch(error => {
        // Allow a later attempt to retry the load.
        scriptPromise = null
        throw error
    })

    return scriptPromise
}

/* -------------------------------------------------------------------------- */
/*  Token lifecycle                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Reads the cached token, restoring it into memory if it is still valid.
 * sessionStorage (not localStorage) is deliberate: the token dies with the tab
 * and is not written to disk or shared across tabs. It is still readable by any
 * script on the page, so this is a usability cache, not a security boundary.
 */
function restoreCachedToken(): boolean {
    if (accessToken) return true
    try {
        const raw = window.sessionStorage.getItem(TOKEN_CACHE_KEY)
        if (!raw) return false
        const parsed = JSON.parse(raw) as Partial<CachedToken>
        if (!parsed?.accessToken || !parsed?.expiresAt) return false
        if (parsed.expiresAt <= Date.now()) {
            window.sessionStorage.removeItem(TOKEN_CACHE_KEY)
            return false
        }
        accessToken = parsed.accessToken
        return true
    } catch {
        window.sessionStorage.removeItem(TOKEN_CACHE_KEY)
        return false
    }
}

function cacheToken(token: string, expiresInSeconds: number | undefined) {
    // Expire slightly early so we never send a token that dies mid-request.
    const ttl = (expiresInSeconds ?? 3600) - 60
    const expiresAt = Date.now() + Math.max(ttl, 60) * 1000
    accessToken = token
    try {
        window.sessionStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify({ accessToken: token, expiresAt }))
    } catch {
        // Keep the in-memory copy even if storage is unavailable.
    }
}

export function isGoogleAuthenticated(): boolean {
    return restoreCachedToken()
}

export function resetGoogleAuth(): void {
    accessToken = null
    pendingAuth = null
    try {
        window.sessionStorage.removeItem(TOKEN_CACHE_KEY)
    } catch {
        // ignore
    }
}

/** Returns a valid access token, or throws. Used by both Google services. */
export async function getGoogleAccessToken(): Promise<string> {
    await authenticateGoogle()
    if (!accessToken) throw new GoogleAuthError()
    return accessToken
}

export async function authenticateGoogle(): Promise<{ mode: GoogleIntegrationMode }> {
    if (getGoogleMode() === 'demo') {
        await delay(400)
        return { mode: 'demo' }
    }

    // Reuse a still-valid token — this is what avoids the popup on repeat use.
    if (restoreCachedToken()) return { mode: 'live' }

    // Collapse concurrent calls into a single popup rather than racing two.
    if (pendingAuth) return pendingAuth

    pendingAuth = requestGoogleToken().finally(() => {
        pendingAuth = null
    })

    return pendingAuth
}

function requestGoogleToken(): Promise<{ mode: 'live' }> {
    return loadGoogleIdentityServices().then(() => {
        const oauth2 = window.google?.accounts?.oauth2
        if (!oauth2) throw new GoogleAuthError('Google sign-in is unavailable in this browser.')

        return new Promise<{ mode: 'live' }>((resolve, reject) => {
            const client = oauth2.initTokenClient({
                client_id: getClientId(),
                scope: GOOGLE_SCOPES,
                callback: response => {
                    if (response.error || !response.access_token) {
                        accessToken = null
                        reject(describeOAuthError(response.error, response.error_description))
                        return
                    }
                    cacheToken(response.access_token, response.expires_in)
                    resolve({ mode: 'live' })
                },
                error_callback: error => {
                    accessToken = null
                    reject(describeOAuthError(error?.type, error?.message))
                },
            })

            try {
                // No `prompt: 'consent'` — this lets Google reuse an existing
                // Google session silently, so the popup only appears when
                // genuinely needed instead of on every single meeting.
                client.requestAccessToken()
            } catch {
                reject(new GoogleAuthError())
            }
        })
    })
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
