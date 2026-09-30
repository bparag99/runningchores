import { useRef, useState } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clipboard,
  Copy,
  Link2,
  LockKeyhole,
  Plus,
  Video,
} from 'lucide-react'
import {
  createMeetingCode,
  formatMeetingCode,
  getMeetingInviteUrl,
  isValidMeetingCode,
  MEET_ROUTE,
  normalizeMeetingCode,
} from './meetingCode'
import './meet.css'

type LobbyMode = 'create' | 'join'

function getCodeFromUrl(): string {
  return normalizeMeetingCode(new URLSearchParams(window.location.search).get('code') ?? '')
}

function updateAddress(code?: string) {
  const url = new URL(MEET_ROUTE, window.location.origin)
  if (code) url.searchParams.set('code', code)
  window.history.replaceState({}, '', url)
}

export default function MeetPage() {
  const initialCode = getCodeFromUrl()
  const [mode, setMode] = useState<LobbyMode>(initialCode ? 'join' : 'create')
  const [meetingCode, setMeetingCode] = useState(initialCode)
  const [displayName, setDisplayName] = useState('')
  const [activeCode, setActiveCode] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const inviteInputRef = useRef<HTMLInputElement>(null)

  const inviteUrl = activeCode ? getMeetingInviteUrl(activeCode) : ''

  const startMeeting = (code: string) => {
    setError('')
    setCopyState('idle')
    setMeetingCode(code)
    setActiveCode(code)
    updateAddress(code)
  }

  const createMeeting = () => {
    if (!displayName.trim()) {
      setError('Add your name before starting the meeting.')
      return
    }

    try {
      startMeeting(createMeetingCode())
    } catch {
      setError('Secure meeting codes are unavailable in this browser. Open this page over HTTPS and try again.')
    }
  }

  const joinMeeting = () => {
    const normalizedCode = normalizeMeetingCode(meetingCode)
    if (!displayName.trim()) {
      setError('Add your name before joining the meeting.')
      return
    }
    if (!isValidMeetingCode(normalizedCode)) {
      setError('Enter a valid meeting code. Codes are 12 to 16 letters or numbers.')
      return
    }

    startMeeting(normalizedCode)
  }

  const copyInvite = async () => {
    if (!inviteUrl) return

    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopyState('copied')
    } catch {
      setCopyState('manual')
      window.setTimeout(() => {
        inviteInputRef.current?.focus()
        inviteInputRef.current?.select()
      }, 0)
    }
  }

  const leaveMeeting = () => {
    setActiveCode(null)
    setCopyState('idle')
    updateAddress()
  }

  if (activeCode) {
    return (
      <main className="meet-page meet-page--call">
        <header className="meet-call-header">
          <button className="meet-back-button" onClick={leaveMeeting} type="button" aria-label="Leave meeting and return to lobby">
            <ArrowLeft size={18} />
            <span>Back to lobby</span>
          </button>
          <div className="meet-call-meta">
            <span className="meet-live-mark" aria-hidden="true" />
            <span>Meeting</span>
            <span className="meet-call-code">{formatMeetingCode(activeCode)}</span>
          </div>
          <button className="meet-copy-button" onClick={copyInvite} type="button">
            {copyState === 'copied' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copyState === 'copied' ? 'Link copied' : 'Invite'}</span>
          </button>
        </header>

        <div className="meet-call-warning" role="note">
          <LockKeyhole size={15} />
          <span>Prototype room on Jitsi public service. Anyone with the code or link may be able to join.</span>
          {copyState === 'manual' && (
            <input
              ref={inviteInputRef}
              aria-label="Meeting invite link"
              className="meet-copy-fallback"
              readOnly
              value={inviteUrl}
              onClick={(event) => event.currentTarget.select()}
            />
          )}
          {copyState === 'manual' && <span className="meet-copy-hint">Link selected. Copy it to share.</span>}
        </div>

        <section className="meet-frame-wrap" aria-label="Video meeting">
          <JitsiMeeting
            key={activeCode}
            domain="meet.jit.si"
            roomName={`runningchores-${activeCode}`}
            userInfo={{ displayName: displayName.trim(), email: '' }}
            lang="en"
            configOverwrite={{
              prejoinPageEnabled: false,
              startWithAudioMuted: true,
              startWithVideoMuted: true,
            }}
            getIFrameRef={(parentNode) => {
              parentNode.style.width = '100%'
              parentNode.style.height = '100%'
              parentNode.style.border = '0'
            }}
            onReadyToClose={leaveMeeting}
          />
        </section>
      </main>
    )
  }

  return (
    <main className="meet-page">
      <header className="meet-topbar">
        <a className="meet-brand" href="/" aria-label="RunningChores home">
          <span className="meet-brand-icon"><Video size={18} /></span>
          <span>RunningChores <b>Meet</b></span>
        </a>
      </header>

      <section className="meet-main">
        <div className="meet-intro">
          <p className="meet-eyebrow">A room for the conversation</p>
          <h1>Meet face to face,<br /><em>in a moment.</em></h1>
          <p className="meet-intro-copy">Start a room and share the invite, or enter a meeting code to join.</p>
        </div>

        <div className="meet-workspace">
          <section className="meet-form-panel" aria-label="Create or join a meeting">
            <div className="meet-mode-control" role="tablist" aria-label="Meeting action">
              <button
                className={mode === 'create' ? 'is-active' : ''}
                onClick={() => { setMode('create'); setError('') }}
                type="button"
                role="tab"
                aria-selected={mode === 'create'}
              >
                <Plus size={16} /> Create meeting
              </button>
              <button
                className={mode === 'join' ? 'is-active' : ''}
                onClick={() => { setMode('join'); setError('') }}
                type="button"
                role="tab"
                aria-selected={mode === 'join'}
              >
                <Link2 size={16} /> Join with code
              </button>
            </div>

            <div className="meet-form-content">
              <div>
                <h2>{mode === 'create' ? 'Start a new meeting' : 'Join a meeting'}</h2>
                <p>{mode === 'create' ? 'Your invite code is ready to share as soon as you start.' : 'Paste the code from your meeting invite.'}</p>
              </div>

              {mode === 'join' && (
                <label className="meet-field">
                  <span>Meeting code</span>
                  <input
                    autoComplete="off"
                    autoCapitalize="none"
                    maxLength={19}
                    placeholder="e.g. 7k4m-2p9x-..."
                    value={meetingCode}
                    onChange={(event) => { setMeetingCode(event.target.value); setError('') }}
                    onKeyDown={(event) => { if (event.key === 'Enter') joinMeeting() }}
                  />
                </label>
              )}

              <label className="meet-field">
                <span>Your name</span>
                <input
                  autoComplete="name"
                  maxLength={60}
                  placeholder="How others will see you"
                  value={displayName}
                  onChange={(event) => { setDisplayName(event.target.value); setError('') }}
                  onKeyDown={(event) => { if (event.key === 'Enter') mode === 'create' ? createMeeting() : joinMeeting() }}
                />
              </label>

              {error && <p className="meet-error" role="alert">{error}</p>}

              <button className="meet-primary-button" onClick={mode === 'create' ? createMeeting : joinMeeting} type="button">
                <span>{mode === 'create' ? 'Create and join' : 'Join meeting'}</span>
                <ArrowRight size={18} />
              </button>
              <p className="meet-name-note">Your name is a display label and is not verified.</p>
            </div>
          </section>
        </div>

        <footer className="meet-footer">
          <span>Meet · RunningChores</span>
          <span>Video calls powered by Jitsi</span>
        </footer>
      </section>
    </main>
  )
}