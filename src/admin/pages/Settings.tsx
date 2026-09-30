import { useState } from 'react'
import { usePortal } from '../context/PortalContext'
import { authProvider } from '../services/auth'
import { getSheetDiagnostics, getSheetTab } from '../services/googleSheets'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useToast } from '../components/Toast'
import { Button } from '../components/ui/Button'

export function Settings() {
    const { googleMode, googleModeLabel, organizerEmail, session, employees, mentors, meetings, resetAllData, sheetUrl } = usePortal()
    const { showToast } = useToast()
    const [isResetOpen, setResetOpen] = useState(false)
    const diagnostics = getSheetDiagnostics()
    const sheetTab = getSheetTab()

    return (
        <>
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Settings</h1>
                    <p className="mt-1.5 text-sm text-slate-500">Integration status and local data for this portal.</p>
                </header>

                <div className="space-y-5">
                    <Section title="Google Calendar & Meet">
                        <Row
                            label="Integration mode"
                            value={
                                <span
                                    className={[
                                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                        googleMode === 'live'
                                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                            : 'bg-amber-50 text-amber-700 ring-amber-600/20',
                                    ].join(' ')}
                                >
                                    {googleModeLabel}
                                </span>
                            }
                        />
                        <Row
                            label="Organizer account"
                            value={
                                <span className="inline-flex flex-wrap items-center gap-2">
                                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">{organizerEmail}</code>
                                    <span className="text-xs font-normal text-slate-500">set by VITE_ADMIN_EMAIL</span>
                                </span>
                            }
                        />
                        {googleMode === 'demo' && (
                            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                                <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> is not set, so meeting links are
                                simulated. Add a Google Cloud OAuth 2.0 <strong>Web application</strong> client id to create real
                                Calendar events and Meet links. No Gmail password or service-account key is ever stored in this
                                app.
                            </p>
                        )}
                    </Section>

                    <Section title="Administrator">
                        <Row label="Signed in as" value={session?.userId ?? '—'} />
                        <Row
                            label="Password source"
                            value={
                                authProvider.isPasswordConfigured()
                                    ? 'PASSWORD environment secret'
                                    : 'Demo fallback — set the PASSWORD environment secret for your deployment'
                            }
                        />
                    </Section>

                    <Section title="Employee database (Google Sheets)">
                        <Row
                            label="Sheet"
                            value={
                                <a
                                    href={sheetUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="break-all font-mono text-xs text-cyan-700 underline underline-offset-2"
                                >
                                    {sheetUrl}
                                </a>
                            }
                        />
                        <Row label="Tab read" value={`“${getSheetTab()}”`} />
                        <Row label="Source" value="Become a Mentor Google Form responses" />
                        <Row label="Tab read" value={`${sheetTab} (Inquiry is ignored)`} />
                        <Row
                            label="Rows in sheet"
                            value={diagnostics.rowCount > 0 ? String(diagnostics.rowCount) : 'Not synced yet'}
                        />
                        {diagnostics.headers.length > 0 && (
                            <Row
                                label="Columns detected"
                                value={
                                    <span className="font-mono text-xs text-slate-600">
                                        {diagnostics.headers.filter(Boolean).join(' · ')}
                                    </span>
                                }
                            />
                        )}
                        <Row
                            label="Writable column"
                            value="Status — the admin can update it from the Employees page"
                        />
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            The form owns every other column. The portal reads all rows and writes only the Status cell, so
                            form submissions are never overwritten. Rows are cached locally and refreshed with the Sync button.
                        </p>
                    </Section>

                    <Section title="Local data">
                        <Row label="Employees stored locally" value={String(employees.employees.length)} />
                        <Row label="Mentor rows synced" value={String(mentors.records.length)} />
                        <Row label="Meetings stored" value={String(meetings.meetings.length)} />
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            Employees and meeting history are stored in this browser's localStorage. Clearing site data removes
                            them.
                        </p>
                        <div className="mt-4">
                            <Button variant="danger" onClick={() => setResetOpen(true)}>
                                Reset local data
                            </Button>
                        </div>
                    </Section>
                </div>
            </div>

            <ConfirmDialog
                isOpen={isResetOpen}
                title="Reset local data"
                message="This permanently deletes every employee and meeting stored in this browser. Google Calendar events that were already created are not affected."
                confirmLabel="Delete everything"
                destructive
                onConfirm={() => {
                    resetAllData()
                    showToast('Local employees and meeting history cleared.', 'info')
                }}
                onClose={() => setResetOpen(false)}
            />
        </>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <div className="mt-4 space-y-3">{children}</div>
        </section>
    )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4">
            <span className="w-44 shrink-0 text-sm text-slate-500">{label}</span>
            <span className="min-w-0 break-words text-sm font-medium text-slate-900">{value}</span>
        </div>
    )
}
