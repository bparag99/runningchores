/**
 * Google Sheets integration — the employee / mentor database.
 *
 * The sheet is populated by the public "Become a Mentor" Google Form
 * (`MENTOR_FORM_URL` in `src/homepage/site.ts`). This module reads those rows
 * into the portal and can write the admin-managed `Status` cell back.
 *
 * Design notes:
 *  - This is the ONLY module that knows about the Sheets API.
 *  - Columns are matched **by header name**, not by letter, so inserting or
 *    reordering a column in the sheet will not silently scramble the data.
 *  - Every row keeps its 1-based sheet row number so a status update can be
 *    written back to the exact cell it came from.
 *  - The sheet is a Google Form response sheet, so the header row is fixed at
 *    row 1. Writing to any other column is deliberately not supported — only
 *    `Status` is written, because the form owns the rest.
 */

import { getGoogleAccessToken, getGoogleMode, delay, GoogleApiError, GoogleAuthError } from './googleAuth'
import { normalizeWhatsAppNumber } from './whatsapp'

/** Spreadsheet that receives the Become a Mentor form submissions. */
const DEFAULT_SPREADSHEET_ID = '1fe_mOyrmGnoyUYRzImuo_nJ7oKUp96Lx_UffFWIym3E'

/** Tab id from the sheet URL (`?gid=479464051`). */
const DEFAULT_SHEET_GID = '479464051'

/** Default tab to read. The workbook has two: "Inquiry" and "Mentors". */
const DEFAULT_SHEET_TAB = 'Mentors'

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export function getSpreadsheetId(): string {
    return import.meta.env.VITE_SHEET_ID?.trim() || DEFAULT_SPREADSHEET_ID
}

export function getSheetGid(): string {
    return import.meta.env.VITE_SHEET_GID?.trim() || DEFAULT_SHEET_GID
}

/**
 * The workbook has two tabs — "Inquiry" and "Mentor". Ranges are addressed by
 * tab NAME, not by position, because `values/A:F` would silently read whichever
 * tab happens to be first.
 */
export function getSheetTab(): string {
    return import.meta.env.VITE_SHEET_TAB?.trim() || DEFAULT_SHEET_TAB
}

/** Quotes the tab name so spaces and punctuation are valid in an A1 range. */
function tabPrefix(): string {
    return `'${getSheetTab().replace(/'/g, "''")}'`
}

export function getSheetUrl(): string {
    return `https://docs.google.com/spreadsheets/d/${getSpreadsheetId()}/edit?gid=${getSheetGid()}#gid=${getSheetGid()}`
}

/** Status values the admin can apply. Free text is also accepted. */
export const MENTOR_STATUS_OPTIONS = ['Pending', 'Approved', 'Active', 'Inactive', 'On Hold'] as const

export type MentorStatus = (typeof MENTOR_STATUS_OPTIONS)[number] | string

export type MentorRecord = {
    /** 1-based row number in the sheet, used to write Status back. */
    rowNumber: number
    /** Column A */
    timestamp: string
    /** Column B */
    name: string
    /** Column C */
    phoneNumber: string
    /** Column D — "I want to mentor as" */
    mentorAs: string
    /** Column E */
    skillDescription: string
    /** Column F — admin managed */
    status: string
}

/**
 * Header aliases so minor wording changes in the form do not break parsing.
 *
 * Matching is deliberately forgiving: Google Form question headers often carry
 * trailing punctuation ("I want to mentor as?") or the sheet owner renames a
 * column. We try an exact match first, then fall back to containment, always
 * preferring the most specific (longest) alias so that a broad alias such as
 * "skill" cannot steal the "Skill Description" column.
 */
const HEADER_ALIASES = {
    timestamp: ['timestamp', 'submitted on', 'submitted', 'date'],
    name: ['name', 'full name', 'fullname', 'mentor name', 'employee name', 'your name'],
    phoneNumber: ['phone number', 'whatsapp number', 'contact number', 'mobile number', 'phone', 'mobile', 'contact', 'whatsapp'],
    mentorAs: ['i want to mentor as', 'mentor as', 'mentor role', 'role', 'domain', 'area'],
    skillDescription: ['skill description', 'skills description', 'your skills', 'skill', 'skills', 'description', 'expertise'],
    status: ['status', 'current status', 'mentor status', 'state'],
} as const

type HeaderKey = keyof typeof HEADER_ALIASES

/** Diagnostic snapshot of the last read, surfaced in the Settings page. */
export type SheetDiagnostics = {
    headers: string[]
    rowCount: number
    tab: string
}

let lastSheetHeaders: { headers: string[]; rowCount: number } = { headers: [], rowCount: 0 }

export function getSheetDiagnostics(): SheetDiagnostics {
    return { headers: lastSheetHeaders.headers, rowCount: lastSheetHeaders.rowCount, tab: getSheetTab() }
}

/** Column letter for a detected header position (0 -> A, 1 -> B, …). */
function columnLetter(position: number): string {
    let letter = ''
    let remaining = position
    do {
        letter = String.fromCharCode(65 + (remaining % 26)) + letter
        remaining = Math.floor(remaining / 26) - 1
    } while (remaining >= 0)
    return letter
}

/** Cached header→column map from the last read, used to target the write. */
let lastStatusColumn: number | null = null

function normaliseHeader(value: string): string {
    // Strip anything that is not a letter, digit or space so punctuation,
    // emoji and trailing "?" in form questions never break a match.
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

/** Result of header detection, including what the sheet actually returned. */
export type ColumnMapping = {
    index: Partial<Record<HeaderKey, number>>
    headers: string[]
}

function buildHeaderIndex(headerRow: unknown[]): ColumnMapping {
    const index: Partial<Record<HeaderKey, number>> = {}
    const headers = headerRow.map(value => String(value ?? '').trim())

    for (const key of Object.keys(HEADER_ALIASES) as HeaderKey[]) {
        const aliases = HEADER_ALIASES[key] as readonly string[]
        let bestScore = 0
        let bestPosition = -1

        headers.forEach((header, position) => {
            const label = normaliseHeader(header)
            if (!label) return

            for (const alias of aliases) {
                const needle = normaliseHeader(alias)
                if (!needle) continue

                let score = 0
                if (label === needle) score = 1000 + needle.length
                else if (label.startsWith(needle) || needle.startsWith(label)) score = 500 + Math.min(needle.length, label.length)
                else if (label.includes(needle) || needle.includes(label)) score = 100 + Math.min(needle.length, label.length)

                if (score > bestScore) {
                    bestScore = score
                    bestPosition = position
                }
            }
        })

        if (bestPosition >= 0) index[key] = bestPosition
    }

    return { index, headers }
}

function cell(row: unknown[], position: number | undefined): string {
    if (position === undefined) return ''
    return String(row[position] ?? '').trim()
}

/**
 * Reads every mentor row from the sheet.
 * Returns an empty array in Demo Mode so the rest of the UI still works.
 */
export async function fetchMentorRecords(): Promise<MentorRecord[]> {
    if (getGoogleMode() === 'demo') {
        await delay(500)
        return []
    }

    const token = await getGoogleAccessToken()
    // Read a wide range so an extra column in the sheet cannot silently hide
    // data; only the headers we recognise are used below.
    const range = encodeURIComponent(`${tabPrefix()}!A:Z`)

    let response: Response
    try {
        response = await fetch(`${SHEETS_API}/${getSpreadsheetId()}/values/${range}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
    } catch {
        throw new GoogleApiError('Unable to reach Google Sheets. Check your connection and try again.')
    }

    if (!response.ok) throw await toSheetsError(response, 'load the mentor list')

    const payload = (await response.json()) as { values?: unknown[][] }
    const rows = payload.values ?? []
    if (rows.length < 2) {
        lastSheetHeaders = { headers: rows[0]?.map(value => String(value ?? '').trim()) ?? [], rowCount: 0 }
        return []
    }

    const { index: columns, headers } = buildHeaderIndex(rows[0])
    lastSheetHeaders = { headers, rowCount: rows.length - 1 }
    lastStatusColumn = columns.status ?? null

    if (columns.name === undefined) {
        throw new GoogleApiError(
            `Could not find a "Name" column in the "${getSheetTab()}" tab. Columns found: ${headers.filter(Boolean).join(', ') || 'none'}.`
        )
    }

    return rows.slice(1).reduce<MentorRecord[]>((records, row, index) => {
        const name = cell(row, columns.name)
        // Skip the blank padding rows Google Forms leaves at the end.
        if (!name) return records

        records.push({
            rowNumber: index + 2, // +1 for zero-index, +1 for the header row
            timestamp: cell(row, columns.timestamp),
            name,
            phoneNumber: cell(row, columns.phoneNumber),
            mentorAs: cell(row, columns.mentorAs),
            skillDescription: cell(row, columns.skillDescription),
            status: cell(row, columns.status) || 'Pending',
        })
        return records
    }, [])
}

/**
 * Writes the admin-managed Status value back to the exact row it came from.
 * Only the Status column is written; the form owns every other column.
 */
export async function updateMentorStatus(rowNumber: number, status: string): Promise<void> {
    if (!Number.isInteger(rowNumber) || rowNumber < 2) {
        throw new GoogleApiError('Invalid sheet row. Try syncing the list again.')
    }
    if (!status.trim()) throw new GoogleApiError('Status cannot be empty.')

    if (getGoogleMode() === 'demo') {
        await delay(300)
        return
    }

    const token = await getGoogleAccessToken()
    // Column F is the Status column in the form response sheet.
    const a1 = `${tabPrefix()}!F${rowNumber}`
    const range = encodeURIComponent(a1)

    let response: Response
    try {
        response = await fetch(`${SHEETS_API}/${getSpreadsheetId()}/values/${range}?valueInputOption=RAW`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ range: a1, values: [[status.trim()]] }),
        })
    } catch {
        throw new GoogleApiError('Unable to reach Google Sheets. Check your connection and try again.')
    }

    if (!response.ok) throw await toSheetsError(response, 'update the status')
}

async function toSheetsError(response: Response, action: string): Promise<GoogleApiError | GoogleAuthError> {
    if (response.status === 401 || response.status === 403) {
        return new GoogleAuthError()
    }

    if (response.status === 404) {
        return new GoogleApiError(
            `Google could not find the “${getSheetTab()}” tab in that spreadsheet. Check VITE_SHEET_TAB, and confirm the signed-in Google account has at least view access to the sheet.`
        )
    }

    if (response.status === 429) {
        return new GoogleApiError('Google Sheets rate limit reached. Wait a moment and try again.')
    }

    try {
        const body = (await response.json()) as { error?: { message?: string } }
        if (body?.error?.message) {
            const detail = body.error.message
            if (/Unable to parse range/i.test(detail)) {
                return new GoogleApiError(
                    `The tab "${getSheetTab()}" does not exist in this workbook. Set VITE_SHEET_TAB to the exact tab name — tab names are case-sensitive — then try again.`
                )
            }
            if (/insufficientPermissions|has insufficient scope|Request had insufficient/i.test(detail)) {
                return new GoogleAuthError(
                    'Google denied access to the sheet. The signed-in account may not have edit access, or the Sheets scope was not approved. Check the consent screen and the sheet’s sharing settings.',
                    'insufficientPermissions'
                )
            }
            return new GoogleApiError(`Could not ${action}: ${detail}`)
        }
    } catch {
        // Fall through to the generic message.
    }

    return new GoogleApiError(`Could not ${action}. Please try again.`)
}

/** Normalised digits for the WhatsApp deep link, or '' when unusable. */
export function toContactNumber(record: MentorRecord): string {
    return normalizeWhatsAppNumber(record.phoneNumber)
}
