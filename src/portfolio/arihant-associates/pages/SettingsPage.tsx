import { Settings, UserRound } from 'lucide-react'

export function SettingsPage() {
  return <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3b5998]">Settings</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Workspace settings</h2><div className="mt-7 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-100 p-5"><Settings className="text-[#3b5998]" size={20} /><h3 className="mt-4 font-bold">Report defaults</h3><p className="mt-2 text-sm leading-6 text-slate-500">Manage report categories, branch details, and default inspection settings.</p></div><div className="rounded-2xl border border-slate-100 p-5"><UserRound className="text-[#3b5998]" size={20} /><h3 className="mt-4 font-bold">Account</h3><p className="mt-4 text-sm leading-6 text-slate-500">Sanjay Jain · Certified valuation practice administrator.</p></div></div></div>
}
