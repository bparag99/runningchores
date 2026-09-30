export interface Employee {
    id: string
    name: string
    email: string
    whatsappNumber: string
    department?: string
    active: boolean
    createdAt: string

    /* --- Google Sheets ("Become a Mentor" form) fields --- */

    /** True when this row came from the linked Google Sheet. */
    fromSheet?: boolean
    /** 1-based sheet row, used to write Status back to the exact cell. */
    sheetRowNumber?: number
    /** Column A — form submission timestamp. */
    submittedAt?: string
    /** Column D — "I want to mentor as". */
    mentorAs?: string
    /** Column E */
    skillDescription?: string
    /** Column F — admin managed, written back to the sheet. */
    status?: string
}

/** Fields the admin supplies in the add/edit form. */
export type EmployeeDraft = {
    name: string
    email: string
    whatsappNumber: string
    department?: string
}

export type EmployeeFieldErrors = Partial<Record<keyof EmployeeDraft, string>>

/** Statuses that mean "do not schedule meetings with this person". */
export const INACTIVE_STATUSES = ['inactive', 'rejected', 'declined', 'dropped', 'on hold', 'cancelled']

/** An empty or unrecognised status is treated as bookable. */
export function isBookableStatus(status: string | undefined): boolean {
    const value = (status ?? '').trim().toLowerCase()
    if (!value) return true
    return !INACTIVE_STATUSES.includes(value)
}
