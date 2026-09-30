const alphabet = '23456789abcdefghjkmnpqrstuvwxyz'
const codeLength = 16
const acceptedByteLimit = Math.floor(256 / alphabet.length) * alphabet.length

export function createMeetingCode(): string {
  const code: string[] = []

  while (code.length < codeLength) {
    const bytes = new Uint8Array((codeLength - code.length) * 2)
    crypto.getRandomValues(bytes)

    for (const byte of bytes) {
      if (byte >= acceptedByteLimit) continue
      code.push(alphabet[byte % alphabet.length])
      if (code.length === codeLength) break
    }
  }

  return code.join('')
}

export function normalizeMeetingCode(value: string): string {
  return value.toLowerCase().replace(/[\s-]/g, '')
}

export function isValidMeetingCode(value: string): boolean {
  const normalized = normalizeMeetingCode(value)
  return /^[23456789abcdefghjkmnpqrstuvwxyz]{12,16}$/.test(normalized)
}

export function formatMeetingCode(value: string): string {
  return value.match(/.{1,4}/g)?.join('-') ?? value
}

/** App route for this feature. Kept here so invite links never drift from the registry. */
export const MEET_ROUTE = '/portfolio/meet'

export function getMeetingInviteUrl(code: string): string {
  const url = new URL(MEET_ROUTE, window.location.origin)
  url.searchParams.set('code', code)
  return url.toString()
}