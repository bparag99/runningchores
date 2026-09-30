/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * Admin sign-in password, supplied as a deployment secret.
     *
     * Exposed via `envPrefix: ['VITE_', 'PASSWORD']` in vite.config.ts.
     * It is compiled into the client bundle, so it is NOT a true secret —
     * it deters casual access only. See src/admin/README-ENV.md.
     */
    readonly PASSWORD?: string

    /** Google OAuth 2.0 *Web application* client id. Public — not a secret. Absent => Demo Mode. */
    readonly VITE_GOOGLE_CLIENT_ID?: string
    /** Administrator user id. Defaults to "admin". */
    readonly VITE_ADMIN_USER_ID?: string
    /**
     * Google account that organises every meeting (the admin's Google account).
     * Defaults to "runningchores@gmail.com".
     */
    readonly VITE_ADMIN_EMAIL?: string
    /**
     * Employee/mentor database — the "Become a Mentor" Google Form sheet.
     * Defaults to the Running Chores form response sheet.
     */
    readonly VITE_SHEET_ID?: string
    /** Tab id from the sheet URL (?gid=...). Defaults to the form response tab. */
    readonly VITE_SHEET_GID?: string
    /**
     * Which tab to read. The workbook has two tabs: "Inquiry" and "Mentors".
     * Defaults to "Mentors" (the employee database).
     */
    readonly VITE_SHEET_TAB?: string
    /**
     * Name of the tab to read. The workbook has two tabs — "Inquiry" and
     * "Mentor" — and the portal reads "Mentor".
     */
    readonly VITE_SHEET_TAB?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
