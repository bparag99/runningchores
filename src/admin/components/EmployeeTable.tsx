import { useMemo, useState } from 'react'
import type { Employee } from '../types/Employee'
import { getInitials, formatPhoneNumber, isValidWhatsAppNumber } from '../utils/validation'
import { EmptyState } from './EmptyState'
import { Button } from './ui/Button'

type EmployeeTableProps = {
    employees: Employee[]
    onCreateMeeting: () => void
}

type SortKey = 'name' | 'createdAt'

export function EmployeeTable({ employees, onCreateMeeting }: EmployeeTableProps) {
    const [query, setQuery] = useState('')
    const [sortKey, setSortKey] = useState<SortKey>('name')

    const visibleEmployees = useMemo(() => {
        const term = query.trim().toLowerCase()

        const filtered = term
            ? employees.filter(employee =>
                  [employee.name, employee.email, employee.whatsappNumber, employee.department ?? '']
                      .join(' ')
                      .toLowerCase()
                      .includes(term)
              )
            : [...employees]

        return filtered.sort((a, b) =>
            sortKey === 'name' ? a.name.localeCompare(b.name) : b.createdAt.localeCompare(a.createdAt)
        )
    }, [employees, query, sortKey])

    return (
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-4">
                <div className="relative min-w-0 flex-1">
                    <svg
                        viewBox="0 0 20 20"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="9" cy="9" r="5.5" />
                        <path d="M13.5 13.5L17 17" strokeLinecap="round" />
                    </svg>
                    <input
                        type="search"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search by name, email, WhatsApp or department"
                        aria-label="Search employees"
                        className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    />
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="sr-only sm:not-sr-only">Sort</span>
                    <select
                        value={sortKey}
                        onChange={event => setSortKey(event.target.value as SortKey)}
                        aria-label="Sort employees"
                        className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    >
                        <option value="name">Name (A–Z)</option>
                        <option value="createdAt">Recently added</option>
                    </select>
                </label>
            </div>

            {visibleEmployees.length === 0 ? (
                <div className="p-5">
                    {employees.length === 0 ? (
                        <EmptyState
                            title="No employees yet"
                            description="Employees come from the Become a Mentor form. Sync the mentor database above to load them."
                        />
                    ) : (
                        <EmptyState
                            title="No matching employees"
                            description={`Nothing matches “${query}”. Try a different name, email or phone number.`}
                            action={
                                <Button variant="secondary" onClick={() => setQuery('')}>
                                    Clear search
                                </Button>
                            }
                        />
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full border-collapse text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Employee
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Email
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        WhatsApp
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>
                                    <th scope="col" className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Source
                                    </th>
                                </tr>
                            </thead>                            <tbody className="divide-y divide-slate-100">
                                {visibleEmployees.map(employee => (
                                    <tr key={employee.id} className="transition hover:bg-slate-50/70">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                                                    {getInitials(employee.name)}
                                                </span>
                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-slate-900">{employee.name}</p>
                                                    {employee.mentorAs ? (
                                                        <p className="truncate text-xs text-cyan-700">{employee.mentorAs}</p>
                                                    ) : (
                                                        employee.department && (
                                                            <p className="truncate text-xs text-slate-500">{employee.department}</p>
                                                        )
                                                    )}
                                                    {employee.skillDescription && (
                                                        <p className="truncate text-xs text-slate-400" title={employee.skillDescription}>
                                                            {employee.skillDescription}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {employee.email ? (
                                                <a
                                                    href={`mailto:${employee.email}`}
                                                    className="text-slate-700 underline decoration-slate-300 underline-offset-2 transition hover:text-cyan-700"
                                                >
                                                    {employee.email}
                                                </a>
                                            ) : (
                                                <span
                                                    title="The mentor form does not collect email. Meetings cannot be invited to this person until an email is added."
                                                    className="text-xs text-amber-700"
                                                >
                                                    Not provided
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="whitespace-nowrap tabular-nums text-slate-700">
                                                    {formatPhoneNumber(employee.whatsappNumber) || '—'}
                                                </span>
                                                {employee.whatsappNumber.trim() && !isValidWhatsAppNumber(employee.whatsappNumber) && (
                                                    <span className="text-[11px] text-rose-600">Not a usable number</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span
                                                className={[
                                                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                                    employee.active
                                                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                        : 'bg-slate-100 text-slate-500 ring-slate-500/20',
                                                ].join(' ')}
                                            >
                                                {employee.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span
                                                title={
                                                    employee.fromSheet
                                                        ? 'From the Become a Mentor sheet — row numbers match the spreadsheet.'
                                                        : 'Added locally in this browser.'
                                                }
                                                className={[
                                                    'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
                                                    employee.fromSheet
                                                        ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
                                                        : 'bg-slate-100 text-slate-500 ring-slate-500/20',
                                                ].join(' ')}
                                            >
                                                {employee.fromSheet ? `Sheet row ${employee.sheetRowNumber}` : 'Local'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <ul className="divide-y divide-slate-100 md:hidden">
                        {visibleEmployees.map(employee => (
                            <li key={employee.id} className="px-5 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-700">
                                            {getInitials(employee.name)}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-900">{employee.name}</p>
                                            <p className="truncate text-xs text-slate-500">{employee.department || employee.email}</p>
                                        </div>
                                    </div>
                                    <span
                                        className={[
                                            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                                            employee.active
                                                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                                : 'bg-slate-100 text-slate-500 ring-slate-500/20',
                                        ].join(' ')}
                                    >
                                        {employee.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <dl className="mt-3 space-y-1 text-sm text-slate-600">
                                    <div className="flex gap-2">
                                        <dt className="w-20 shrink-0 text-slate-500">Email</dt>
                                        <dd className="truncate">{employee.email}</dd>
                                    </div>
                                    <div className="flex gap-2">
                                        <dt className="w-20 shrink-0 text-slate-500">WhatsApp</dt>
                                        <dd className="whitespace-nowrap tabular-nums">{formatPhoneNumber(employee.whatsappNumber) || '—'}</dd>
                                    </div>
                                </dl>
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <span
                                        className={[
                                            'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset',
                                            employee.fromSheet
                                                ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
                                                : 'bg-slate-100 text-slate-500 ring-slate-500/20',
                                        ].join(' ')}
                                    >
                                        {employee.fromSheet ? `Sheet row ${employee.sheetRowNumber}` : 'Local'}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
                <p className="text-sm text-slate-500">
                    {visibleEmployees.length} of {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
                </p>
                {employees.length > 0 && (
                    <Button variant="primary" onClick={onCreateMeeting}>
                        Create Meeting
                    </Button>
                )}
            </div>
        </section>
    )
}
