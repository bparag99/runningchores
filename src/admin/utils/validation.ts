import type { Employee, EmployeeDraft, EmployeeFieldErrors } from '../types/Employee'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function isValidEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value.trim())
}

/**
 * Country code applied to bare national numbers, e.g. "9876543210"
 * becomes "919876543210" for the WhatsApp deep link.
 */
const DEFAULT_COUNTRY_CODE = '91'

/**
 * Converts any phone entry to full international digits, ready for `wa.me`.
 *
 * Handles the three ways a number is realistically entered:
 *  - International with prefix — "+91 98765 43210", "0091 98765 43210" -> kept as is
 *  - National with trunk zero — "098765 43210" -> leading 0 dropped
 *  - Bare national — "9876543210" -> country code prepended
 *
 * A bare number is only assumed to be national when it is exactly 10 digits
 * (the Indian mobile length). Anything else is passed through untouched so a
 * number that already carries a country code is never doubled up.
 */
export function toWhatsAppDigits(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) return ''

    // Already international — leave the country code alone.
    if (trimmed.startsWith('+')) return trimmed.slice(1).replace(/\D/g, '')
    if (trimmed.startsWith('00')) return trimmed.slice(2).replace(/\D/g, '')

    // National format: drop any trunk prefix before measuring the length.
    const national = trimmed.replace(/\D/g, '').replace(/^0+/, '')
    if (!national) return ''

    return national.length === 10 ? `${DEFAULT_COUNTRY_CODE}${national}` : national
}

/** Pretty international display, e.g. "+919876543210". No spacing. */
export function formatPhoneNumber(value: string): string {
    const digits = toWhatsAppDigits(value)
    return digits ? `+${digits}` : ''
}

export function isValidWhatsAppNumber(value: string): boolean {
    const digits = toWhatsAppDigits(value)
    return digits.length >= 10 && digits.length <= 15
}

export function isValidName(value: string): boolean {
    return value.trim().length >= 2
}

export function validateEmployeeDraft(draft: EmployeeDraft, existing: Employee[], editingId?: string): EmployeeFieldErrors {
    const errors: EmployeeFieldErrors = {}

    if (!isValidName(draft.name)) {
        errors.name = 'Employee name is required.'
    }

    const email = draft.email.trim().toLowerCase()
    if (!email) {
        errors.email = 'Employee email is required.'
    } else if (!isValidEmail(email)) {
        errors.email = 'Enter a valid email address.'
    } else if (existing.some(employee => employee.email.trim().toLowerCase() === email && employee.id !== editingId)) {
        errors.email = 'An employee with this email already exists.'
    }

    if (!draft.whatsappNumber.trim()) {
        errors.whatsappNumber = 'WhatsApp number is required.'
    } else if (!isValidWhatsAppNumber(draft.whatsappNumber)) {
        errors.whatsappNumber = 'Enter a valid WhatsApp number (10–15 digits).'
    }

    return errors
}

export function hasErrors(errors: EmployeeFieldErrors): boolean {
    return Object.values(errors).some(Boolean)
}

export function getInitials(name: string): string {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('')
}
