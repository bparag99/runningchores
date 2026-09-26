import { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface InventoryItem {
  id: string; name: string; description: string; category: string; subCategory: string
  costPrice: number; sellingPrice: number; quantity: number; batchId: string; regNo: string
  date: string; sapWarrantyNo: string; warrantyType: string; serialNumber: string; gst: number
  billNo: string; uploadType: 'Batch' | 'Stock'; status: 'In Stock' | 'Low Stock' | 'Sold Out'
}

interface BillLine { productName: string; batchId: string; quantity: number; sellingPrice: number; gstPct: number; lineTotal: number }
interface Bill { billNo: string; customerName: string; phone: string; date: string; gstNo: string; items: BillLine[]; subtotal: number; gstAmount: number; total: number }
type Screen = 'login' | 'dashboard' | 'inventory' | 'inv-detail' | 'add-inventory' | 'reception' | 'bill-preview' | 'billing-history' | 'settings' | 'profile'
type Tab = 'dashboard' | 'inventory' | 'reception' | 'settings'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: 'MRF Zigma 185/65 R15', description: 'Tubeless radial tyre for passenger cars — low noise, long mileage', category: 'Passenger Car', subCategory: 'Radial Tubeless', costPrice: 4200, sellingPrice: 5800, quantity: 24, batchId: 'MRF-24-A1', regNo: 'KA01AB1234', date: '15/03/2024', sapWarrantyNo: 'SAP-MRF-0091', warrantyType: '2 Year / 40,000 km', serialNumber: 'MRF-ZIG-185-001', gst: 18, billNo: 'BILL-2024-0891', uploadType: 'Batch', status: 'In Stock' },
  { id: 'INV-002', name: 'Apollo Apterra 235/70 R16', description: 'SUV all-terrain tyre with reinforced sidewall', category: 'SUV', subCategory: 'All Terrain', costPrice: 7200, sellingPrice: 9500, quantity: 3, batchId: 'APL-24-B2', regNo: 'KA05CD5678', date: '10/04/2024', sapWarrantyNo: 'SAP-APL-0042', warrantyType: '3 Year / 60,000 km', serialNumber: 'APL-APT-235-002', gst: 18, billNo: 'BILL-2024-0892', uploadType: 'Stock', status: 'Low Stock' },
  { id: 'INV-003', name: 'CEAT SecuraDrive 195/65 R15', description: 'Fuel-efficient tyre optimised for Indian roads', category: 'Passenger Car', subCategory: 'Eco Series', costPrice: 3900, sellingPrice: 5200, quantity: 0, batchId: 'CEAT-24-C3', regNo: 'KA09EF9012', date: '05/04/2024', sapWarrantyNo: 'SAP-CEAT-0067', warrantyType: '2 Year / 35,000 km', serialNumber: 'CEAT-SEC-195-003', gst: 18, billNo: 'BILL-2024-0893', uploadType: 'Batch', status: 'Sold Out' },
  { id: 'INV-004', name: 'Michelin Energy XM2 195/55 R16', description: 'Premium comfort tyre with superior wet grip', category: 'Passenger Car', subCategory: 'Comfort Premium', costPrice: 6500, sellingPrice: 8800, quantity: 16, batchId: 'MCH-24-D4', regNo: 'KA02GH3456', date: '20/04/2024', sapWarrantyNo: 'SAP-MCH-0038', warrantyType: '4 Year / 80,000 km', serialNumber: 'MCH-ENE-195-004', gst: 18, billNo: 'BILL-2024-0894', uploadType: 'Stock', status: 'In Stock' },
  { id: 'INV-005', name: 'Bridgestone Turanza T005 205/55 R16', description: 'Highway performance tyre, ultra-high speed rated', category: 'Passenger Car', subCategory: 'Performance', costPrice: 7800, sellingPrice: 10500, quantity: 2, batchId: 'BRI-24-E5', regNo: 'KA07IJ7890', date: '22/04/2024', sapWarrantyNo: 'SAP-BRI-0015', warrantyType: '3 Year / 50,000 km', serialNumber: 'BRI-TUR-205-005', gst: 18, billNo: 'BILL-2024-0895', uploadType: 'Batch', status: 'Low Stock' },
]

const BILLS: Bill[] = [
  { billNo: 'INV-2024-0891', customerName: 'Rajesh Kumar', phone: '98765 43210', date: '28/04/2024', gstNo: '29AABCT1332L1ZS', items: [{ productName: 'MRF Zigma 185/65 R15', batchId: 'MRF-24-A1', quantity: 4, sellingPrice: 5800, gstPct: 18, lineTotal: 27376 }], subtotal: 23200, gstAmount: 4176, total: 27376 },
  { billNo: 'INV-2024-0892', customerName: 'Priya Sharma', phone: '97654 32109', date: '27/04/2024', gstNo: '', items: [{ productName: 'CEAT SecuraDrive 195/65 R15', batchId: 'CEAT-24-C3', quantity: 2, sellingPrice: 5200, gstPct: 18, lineTotal: 12272 }], subtotal: 10400, gstAmount: 1872, total: 12272 },
  { billNo: 'INV-2024-0893', customerName: 'Suresh Nair', phone: '96543 21098', date: '26/04/2024', gstNo: '32AABCT8876L2ZS', items: [{ productName: 'Apollo Apterra 235/70 R16', batchId: 'APL-24-B2', quantity: 4, sellingPrice: 9500, gstPct: 18, lineTotal: 44840 }, { productName: 'Michelin Energy XM2 195/55 R16', batchId: 'MCH-24-D4', quantity: 2, sellingPrice: 8800, gstPct: 18, lineTotal: 20768 }], subtotal: 55600, gstAmount: 10008, total: 65608 },
  { billNo: 'INV-2024-0890', customerName: 'Anita Reddy', phone: '95432 10987', date: '25/04/2024', gstNo: '36AABCS0987K1ZT', items: [{ productName: 'Bridgestone Turanza T005 205/55 R16', batchId: 'BRI-24-E5', quantity: 4, sellingPrice: 10500, gstPct: 18, lineTotal: 49560 }], subtotal: 42000, gstAmount: 7560, total: 49560 },
]

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

// ─── Shared UI ────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InventoryItem['status'] }) {
  const map = { 'In Stock': 'bg-emerald-50 text-emerald-700 border border-emerald-200', 'Low Stock': 'bg-amber-50 text-amber-700 border border-amber-200', 'Sold Out': 'bg-red-50 text-red-600 border border-red-200' }
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${map[status]}`}>{status}</span>
}

function ScreenHeader({ title, onBack, rightLabel, onRight }: { title: string; onBack?: () => void; rightLabel?: string; onRight?: () => void }) {
  return (
    <div className="bg-slate-900 px-4 pt-10 pb-4 flex items-center gap-3 shrink-0">
      {onBack && (
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}
      <h1 className="flex-1 text-white text-lg font-bold font-serif">{title}</h1>
      {rightLabel && onRight && <button onClick={onRight} className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">{rightLabel}</button>}
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-amber-500' : 'bg-slate-200'}`}>
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('manager@wheelhouse.in')
  const [password, setPassword] = useState('password123')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setError(''); onLogin()
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="h-10" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-2">
        <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
          <svg className="w-11 h-11 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2.5" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white font-serif">Ajanta Tyres</h1>
        <p className="text-slate-400 text-xs tracking-widest uppercase font-medium">Tyre Shop Management</p>
      </div>
      <div className="px-5 pb-8 flex flex-col gap-4">
        <div className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-2 bg-slate-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500" placeholder="your@email.com" />
          </div>
          <div>
            <label className="text-slate-400 text-xs font-semibold tracking-wider uppercase">Password</label>
            <div className="relative mt-2">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-slate-500" placeholder="Min. 6 characters" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                {showPass
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded bg-amber-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-slate-400 text-xs">Remember me</span>
            </label>
            <button className="text-amber-400 text-xs font-semibold hover:text-amber-300 transition-colors">Forgot password?</button>
          </div>
        </div>
        <button onClick={handleLogin} className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 font-bold py-4 rounded-2xl text-base transition-colors font-serif">
          Sign In
        </button>
        <p className="text-center text-slate-600 text-xs">Ajanta Tyres v1.0 · Google Drive Sync Active</p>
      </div>
    </div>
  )
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────

function DashboardScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const totalStock = INVENTORY.reduce((s, i) => s + i.quantity, 0)
  const totalPurchase = INVENTORY.reduce((s, i) => s + i.costPrice * i.quantity, 0)
  const totalSales = BILLS.reduce((s, b) => s + b.total, 0)
  const lowStock = INVENTORY.filter(i => i.status === 'Low Stock').length

  const kpis = [
    { label: 'Total Stock', value: totalStock.toString(), unit: 'units', style: 'bg-slate-800 text-white', val: 'text-amber-400' },
    { label: 'Purchase Value', value: fmt(totalPurchase), unit: '', style: 'bg-white border border-slate-200', val: 'text-slate-900' },
    { label: 'Sales Value', value: fmt(totalSales), unit: '', style: 'bg-amber-500', val: 'text-slate-900' },
    { label: "Today's Bills", value: '3', unit: 'invoices', style: 'bg-white border border-slate-200', val: 'text-slate-900' },
    { label: 'Low Stock', value: lowStock.toString(), unit: 'items', style: 'bg-white border border-slate-200', val: 'text-amber-600' },
    { label: 'Discarded', value: '1', unit: 'items', style: 'bg-white border border-slate-200', val: 'text-red-500' },
  ]

  const activity = [
    { desc: 'Bill INV-2024-0891 — Rajesh Kumar', sub: '4× MRF Zigma · ₹27,376', time: '2h ago', dot: 'bg-emerald-400' },
    { desc: 'Inventory added — MRF Zigma batch', sub: 'MRF-24-A1 · 24 units added', time: '4h ago', dot: 'bg-amber-400' },
    { desc: 'Bill INV-2024-0892 — Priya Sharma', sub: '2× CEAT SecuraDrive · ₹12,272', time: 'Yesterday', dot: 'bg-emerald-400' },
    { desc: 'Low stock alert — Apollo Apterra', sub: '3 units remaining', time: 'Yesterday', dot: 'bg-red-400' },
  ]

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-5 pt-10 pb-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs tracking-widest uppercase font-semibold">Ajanta Tyres</p>
            <h1 className="text-white text-xl font-bold font-serif mt-0.5">Good morning, Aamir</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-900/50 px-2.5 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-semibold">Synced</span>
            </div>
            <button onClick={() => navigate('profile')} className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">A</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</p>
          <div className="grid grid-cols-2 gap-2.5">
            {kpis.map(k => (
              <div key={k.label} className={`rounded-2xl p-4 ${k.style}`}>
                <p className={`text-[11px] font-semibold opacity-60 ${k.style.includes('bg-amber') ? 'text-slate-800' : k.style.includes('bg-slate-8') ? 'text-slate-300' : 'text-slate-500'}`}>{k.label}</p>
                <p className={`text-lg font-bold font-serif mt-1 ${k.val}`}>{k.value}</p>
                {k.unit && <p className={`text-[11px] ${k.style.includes('bg-amber') ? 'text-slate-700' : 'text-slate-400'}`}>{k.unit}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Add Inventory', icon: '📦', to: 'add-inventory' as Screen, style: 'bg-slate-800 text-white' },
              { label: 'New Bill', icon: '🧾', to: 'reception' as Screen, style: 'bg-amber-500 text-slate-900' },
              { label: 'View Stock', icon: '📋', to: 'inventory' as Screen, style: 'bg-white border border-slate-200 text-slate-800' },
              { label: 'Billing History', icon: '📊', to: 'billing-history' as Screen, style: 'bg-white border border-slate-200 text-slate-800' },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.to)} className={`rounded-2xl p-4 text-left flex items-center gap-3 hover:opacity-80 active:opacity-60 transition-opacity ${a.style}`}>
                <span className="text-xl">{a.icon}</span>
                <span className="font-semibold text-sm leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-50">
            {activity.map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-sm font-medium truncate">{item.desc}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.sub}</p>
                </div>
                <span className="text-slate-400 text-xs shrink-0 mt-0.5">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-2" />
      </div>
    </div>
  )
}

// ─── Inventory List Screen ────────────────────────────────────────────────────

function InventoryListScreen({ navigate, onSelect }: { navigate: (s: Screen) => void; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = INVENTORY.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.batchId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-4 pt-10 pb-3 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-xl font-bold font-serif">Inventory</h1>
          <button onClick={() => navigate('add-inventory')} className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg leading-none">+</button>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by product or batch ID..." className="w-full bg-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500" />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5">
          {['All', 'In Stock', 'Low Stock', 'Sold Out'].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${statusFilter === f ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-5xl">📦</div>
            <p className="text-slate-700 font-semibold text-sm">No items found</p>
            <p className="text-slate-400 text-xs">Adjust search or filters</p>
            <button onClick={() => navigate('add-inventory')} className="mt-2 bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-sm">Add Inventory</button>
          </div>
        ) : filtered.map(item => (
          <button key={item.id} onClick={() => { onSelect(item.id); navigate('inv-detail') }} className="w-full bg-white rounded-2xl p-4 text-left shadow-sm hover:shadow-md active:scale-[0.98] transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-semibold text-sm leading-snug">{item.name}</p>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{item.description}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-3 flex items-end gap-4">
              <div><p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Qty</p><p className="text-slate-800 font-bold font-serif">{item.quantity}</p></div>
              <div><p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Price</p><p className="text-slate-800 font-bold font-serif text-sm">{fmt(item.sellingPrice)}</p></div>
              <div className="flex-1"><p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Batch</p><p className="text-slate-500 text-xs font-mono">{item.batchId}</p></div>
              <div><p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">GST</p><p className="text-slate-700 text-sm font-medium">{item.gst}%</p></div>
            </div>
          </button>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Inventory Detail Screen ──────────────────────────────────────────────────

function InventoryDetailScreen({ itemId, onBack }: { itemId: string; onBack: () => void }) {
  const item = INVENTORY.find(i => i.id === itemId)
  if (!item) return null

  const fields = [
    { label: 'ID', value: item.id, mono: true },
    { label: 'Category', value: item.category, mono: false },
    { label: 'Sub-Category', value: item.subCategory, mono: false },
    { label: 'Batch ID', value: item.batchId, mono: true },
    { label: 'Serial Number', value: item.serialNumber, mono: true },
    { label: 'Cost Price', value: fmt(item.costPrice), mono: false },
    { label: 'Selling Price', value: fmt(item.sellingPrice), mono: false },
    { label: 'Quantity', value: item.quantity.toString(), mono: false },
    { label: 'GST', value: `${item.gst}%`, mono: false },
    { label: 'Reg. Number', value: item.regNo, mono: true },
    { label: 'Date Added', value: item.date, mono: false },
    { label: 'SAP Warranty No.', value: item.sapWarrantyNo, mono: true },
    { label: 'Warranty Type', value: item.warrantyType, mono: false },
    { label: 'Bill No.', value: item.billNo, mono: true },
    { label: 'Upload Type', value: item.uploadType, mono: false },
  ]

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <ScreenHeader title="Item Detail" onBack={onBack} rightLabel="Edit" onRight={() => {}} />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-slate-800 px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold font-serif leading-snug">{item.name}</h2>
              <p className="text-slate-400 text-xs mt-1">{item.description}</p>
              <div className="mt-2"><StatusBadge status={item.status} /></div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[{ l: 'Sell Price', v: fmt(item.sellingPrice) }, { l: 'Quantity', v: item.quantity.toString() }, { l: 'GST', v: `${item.gst}%` }].map(s => (
              <div key={s.l} className="bg-slate-700 rounded-xl p-3">
                <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">{s.l}</p>
                <p className="text-white font-bold font-serif text-base mt-0.5">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Full Record</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-50">
            {fields.map(f => (
              <div key={f.label} className="px-4 py-3 flex items-center justify-between gap-4">
                <p className="text-slate-500 text-sm">{f.label}</p>
                <p className={`text-right font-medium ${f.mono ? 'font-mono text-xs text-slate-600' : 'text-slate-800 text-sm'}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-8 flex gap-3">
          <button className="flex-1 bg-slate-800 text-white font-semibold py-3.5 rounded-2xl text-sm hover:bg-slate-700 transition-colors">Edit Item</button>
          <button className="flex-1 bg-red-50 text-red-600 font-semibold py-3.5 rounded-2xl text-sm border border-red-100 hover:bg-red-100 transition-colors">Archive</button>
        </div>
      </div>
    </div>
  )
}

// ─── Add Inventory Screen ─────────────────────────────────────────────────────

function AddInventoryScreen({ onBack }: { onBack: () => void }) {
  const [uploadType, setUploadType] = useState<'batch' | 'single' | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  if (showSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-100 px-6 gap-4 text-center">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-slate-900 text-xl font-bold font-serif">Inventory Added!</h2>
        <p className="text-slate-500 text-sm">The new stock record has been saved to your inventory.</p>
        <button onClick={onBack} className="mt-2 bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-slate-700 transition-colors">Back to Inventory</button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <ScreenHeader title="Add Inventory" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        <p className="text-slate-500 text-sm">Choose how you want to add stock to your inventory.</p>
        <div className="space-y-2.5">
          {([['batch', 'Upload Batch', 'Scan or import multiple items from a purchase invoice', '📑'], ['single', 'Upload Single', 'Add a single tyre item to your current stock', '📦']] as const).map(([id, label, desc, icon]) => (
            <button key={id} onClick={() => setUploadType(id)} className={`w-full bg-white rounded-2xl p-4 text-left flex items-center gap-4 transition-all border-2 ${uploadType === id ? 'border-amber-500' : 'border-transparent hover:border-amber-200'}`}>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">{icon}</div>
              <div><p className="text-slate-900 font-semibold text-sm">{label}</p><p className="text-slate-400 text-xs mt-0.5">{desc}</p></div>
            </button>
          ))}
        </div>
        {uploadType && (
          <div className="border-t border-slate-200 pt-4 space-y-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Method</p>
            {[['📷', 'Use Camera', 'Scan a physical receipt or invoice'], ['🖼️', 'Use File Storage', 'Upload from your device gallery'], ['✏️', 'Manual Entry', 'Fill in item details by hand']].map(([icon, label, desc]) => (
              <button key={label as string} onClick={() => setShowSuccess(true)} className="w-full bg-white rounded-xl p-3.5 text-left flex items-center gap-3 hover:bg-amber-50 active:bg-amber-100 transition-colors">
                <span className="text-xl">{icon}</span>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium text-sm">{label}</p>
                  <p className="text-slate-400 text-xs">{desc}</p>
                </div>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Reception / Billing Screen ───────────────────────────────────────────────

function ReceptionScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [gstNo, setGstNo] = useState('')
  const [lines, setLines] = useState<BillLine[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [selectedId, setSelectedId] = useState('')
  const [qty, setQty] = useState('1')

  const subtotal = lines.reduce((s, l) => s + l.sellingPrice * l.quantity, 0)
  const gstAmt = lines.reduce((s, l) => s + l.sellingPrice * l.quantity * l.gstPct / 100, 0)
  const total = subtotal + gstAmt
  const valid = name.trim() && phone.trim() && lines.length > 0

  const addLine = () => {
    const p = INVENTORY.find(i => i.id === selectedId)
    if (!p) return
    const q = Math.max(1, parseInt(qty) || 1)
    const sub = p.sellingPrice * q
    setLines(prev => [...prev, { productName: p.name, batchId: p.batchId, quantity: q, sellingPrice: p.sellingPrice, gstPct: p.gst, lineTotal: sub + sub * p.gst / 100 }])
    setShowAdd(false); setSelectedId(''); setQty('1')
  }

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-4 pt-10 pb-4 shrink-0 flex items-center justify-between">
        <h1 className="text-white text-xl font-bold font-serif">New Bill</h1>
        <button onClick={() => navigate('billing-history')} className="text-amber-400 text-sm font-semibold hover:text-amber-300 transition-colors">History</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Customer Details</p>
          <div className="bg-white rounded-2xl p-4 space-y-3">
            {[{ l: 'Customer Name *', v: name, s: setName, t: 'text', p: 'e.g. Rajesh Kumar' }, { l: 'Phone Number *', v: phone, s: setPhone, t: 'tel', p: '10-digit mobile number' }, { l: 'GST Number', v: gstNo, s: setGstNo, t: 'text', p: 'Optional — for B2B invoices' }].map(f => (
              <div key={f.l}>
                <label className="text-slate-500 text-xs font-semibold">{f.l}</label>
                <input type={f.t} value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} className="w-full mt-1.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bill Items</p>
            <button onClick={() => setShowAdd(!showAdd)} className="text-amber-600 text-xs font-bold hover:text-amber-500 transition-colors">+ Add Item</button>
          </div>

          {showAdd && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3 space-y-3">
              <div>
                <label className="text-slate-600 text-xs font-semibold">Select Product</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full mt-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="">Choose a product...</option>
                  {INVENTORY.filter(i => i.quantity > 0).map(i => <option key={i.id} value={i.id}>{i.name} (Stock: {i.quantity})</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-600 text-xs font-semibold">Quantity</label>
                <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="w-full mt-1.5 bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              {selectedId && (() => { const p = INVENTORY.find(i => i.id === selectedId); return p ? <p className="text-slate-600 text-xs">{fmt(p.sellingPrice)}/unit + {p.gst}% GST</p> : null })()}
              <div className="flex gap-2">
                <button onClick={addLine} disabled={!selectedId} className="flex-1 bg-amber-500 text-slate-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-40 hover:bg-amber-400 transition-colors">Add to Bill</button>
                <button onClick={() => setShowAdd(false)} className="px-4 bg-white border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {lines.length === 0
            ? <div className="bg-white rounded-2xl p-6 text-center"><div className="text-4xl mb-2">🧾</div><p className="text-slate-400 text-sm">No items added yet — tap + Add Item to start</p></div>
            : <div className="bg-white rounded-2xl divide-y divide-slate-50">
              {lines.map((l, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-slate-800 font-medium text-sm leading-snug flex-1">{l.productName}</p>
                    <button onClick={() => setLines(p => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 transition-colors mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                    <span>Qty {l.quantity}</span><span>·</span><span>{fmt(l.sellingPrice)}/unit</span><span>·</span><span>GST {l.gstPct}%</span>
                    <span className="ml-auto font-semibold text-slate-800 text-sm">{fmt(l.lineTotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>

        {lines.length > 0 && (
          <div className="bg-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-slate-300 text-sm"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between text-slate-300 text-sm"><span>GST</span><span>{fmt(gstAmt)}</span></div>
            <div className="border-t border-slate-600 pt-2 flex justify-between text-white font-bold text-lg">
              <span className="font-serif">Total</span><span className="font-serif">{fmt(total)}</span>
            </div>
          </div>
        )}

        <button onClick={() => navigate('bill-preview')} disabled={!valid} className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-2xl text-base disabled:opacity-40 hover:bg-amber-400 transition-colors font-serif">
          Preview Bill
        </button>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Bill Preview Screen ──────────────────────────────────────────────────────

function BillPreviewScreen({ onBack, navigate }: { onBack: () => void; navigate: (s: Screen) => void }) {
  const bill = BILLS[0]
  const [saved, setSaved] = useState(false)

  if (saved) return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-100 px-6 gap-4 text-center">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h2 className="text-slate-900 text-2xl font-bold font-serif">Bill Saved!</h2>
      <p className="text-slate-500 text-sm">Invoice {bill.billNo} recorded and inventory updated.</p>
      <button onClick={() => navigate('billing-history')} className="mt-2 bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl text-sm hover:bg-slate-700 transition-colors">View History</button>
      <button onClick={() => navigate('dashboard')} className="text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors">Back to Dashboard</button>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <ScreenHeader title="Bill Preview" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-start">
            <div><p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Invoice</p><p className="text-white font-mono font-bold text-sm mt-0.5">{bill.billNo}</p></div>
            <div className="text-right"><p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Date</p><p className="text-white text-sm mt-0.5">{bill.date}</p></div>
          </div>
          <div className="mt-3 border-t border-slate-700 pt-3">
            <p className="text-white font-semibold">{bill.customerName}</p>
            <p className="text-slate-400 text-sm font-mono">{bill.phone}</p>
            {bill.gstNo && <p className="text-slate-500 text-xs font-mono mt-0.5">GSTIN: {bill.gstNo}</p>}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Items</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-50">
            {bill.items.map((item, i) => (
              <div key={i} className="px-4 py-3">
                <p className="text-slate-800 font-medium text-sm">{item.productName}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono">{item.batchId}</span><span>·</span>
                  <span>Qty {item.quantity}</span><span>·</span>
                  <span>{fmt(item.sellingPrice)}/unit</span>
                  <span className="ml-auto font-semibold text-slate-700 text-sm">{fmt(item.lineTotal)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-slate-500 text-sm"><span>Subtotal</span><span>{fmt(bill.subtotal)}</span></div>
          <div className="flex justify-between text-slate-500 text-sm"><span>GST (18%)</span><span>{fmt(bill.gstAmount)}</span></div>
          <div className="border-t border-slate-100 pt-2 flex justify-between text-slate-900 font-bold text-xl font-serif"><span>Total</span><span>{fmt(bill.total)}</span></div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setSaved(true)} className="flex-1 bg-amber-500 text-slate-900 font-bold py-4 rounded-2xl text-base hover:bg-amber-400 transition-colors font-serif">Save Bill</button>
          <button onClick={onBack} className="px-5 bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-2xl text-sm hover:bg-slate-50 transition-colors">Edit</button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Billing History Screen ───────────────────────────────────────────────────

function BillingHistoryScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [search, setSearch] = useState('')
  const filtered = BILLS.filter(b => !search || b.customerName.toLowerCase().includes(search.toLowerCase()) || b.phone.includes(search) || b.billNo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-4 pt-10 pb-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-xl font-bold font-serif">Billing History</h1>
          <button onClick={() => navigate('reception')} className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-amber-400 transition-colors">+ New Bill</button>
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, or invoice no..." className="w-full bg-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filtered.map(bill => (
          <div key={bill.billNo} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-slate-900 font-semibold text-sm">{bill.customerName}</p>
                <p className="text-slate-400 text-xs font-mono mt-0.5">{bill.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-bold font-serif text-sm">{fmt(bill.total)}</p>
                <p className="text-slate-400 text-xs mt-0.5">{bill.date}</p>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded">{bill.billNo}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 text-xs">{bill.items.length} item{bill.items.length > 1 ? 's' : ''}</span>
              <span className="ml-auto">
                <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">Paid</span>
              </span>
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Settings Screen ──────────────────────────────────────────────────────────

function SettingsScreen({ navigate }: { navigate: (s: Screen) => void }) {
  const [autoSync, setAutoSync] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [lowStockAlerts, setLowStockAlerts] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-5 pt-10 pb-5 shrink-0">
        <h1 className="text-white text-xl font-bold font-serif">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        <button onClick={() => navigate('profile')} className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg shrink-0">A</div>
          <div><p className="text-slate-900 font-semibold text-sm">Aamir Khan</p><p className="text-slate-500 text-xs mt-0.5">manager@wheelhouse.in</p></div>
          <svg className="ml-auto w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Sync & Alerts</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-50">
            {[
              { l: 'Auto Sync on Open', sub: 'Sync with Google Drive on launch', v: autoSync, s: () => setAutoSync(!autoSync) },
              { l: 'Notifications', sub: 'Stock and billing alerts', v: notifications, s: () => setNotifications(!notifications) },
              { l: 'Low Stock Alerts', sub: 'Alert when item drops below 5 units', v: lowStockAlerts, s: () => setLowStockAlerts(!lowStockAlerts) },
            ].map(setting => (
              <div key={setting.l} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div><p className="text-slate-800 text-sm font-medium">{setting.l}</p><p className="text-slate-400 text-xs mt-0.5">{setting.sub}</p></div>
                <Toggle value={setting.v} onChange={setting.s} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">App</p>
          <div className="bg-white rounded-2xl divide-y divide-slate-50">
            <div className="px-4 py-3.5 flex items-center justify-between gap-3">
              <div><p className="text-slate-800 text-sm font-medium">Dark Mode</p><p className="text-slate-400 text-xs mt-0.5">Switch to dark theme</p></div>
              <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>
            {['Sync with Google Drive', 'Storage Permissions', 'About WheelHouse'].map(item => (
              <button key={item} className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <p className="text-slate-800 text-sm font-medium">{item}</p>
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl">
          <div className="px-4 py-3 flex justify-between items-center">
            <p className="text-slate-500 text-sm">App Version</p>
            <p className="text-slate-400 text-sm font-mono">v1.0.0</p>
          </div>
        </div>

        <button className="w-full bg-red-50 border border-red-100 text-red-600 font-semibold py-3.5 rounded-2xl text-sm hover:bg-red-100 transition-colors">Logout</button>
        <div className="h-4" />
      </div>
    </div>
  )
}

// ─── Profile Screen ───────────────────────────────────────────────────────────

function ProfileScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('Aamir Khan')
  const [email, setEmail] = useState('manager@wheelhouse.in')
  const [phone, setPhone] = useState('99001 23456')
  const [business, setBusiness] = useState('WheelHouse Tyre Shop')
  const [saved, setSaved] = useState(false)

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden">
      <ScreenHeader title="My Profile" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-3xl shadow-lg">V</div>
          <div className="text-center">
            <p className="text-slate-900 font-bold">{name}</p>
            <p className="text-slate-500 text-sm">{business}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 space-y-3">
          {[{ l: 'Full Name', v: name, s: setName, t: 'text' }, { l: 'Email Address', v: email, s: setEmail, t: 'email' }, { l: 'Phone Number', v: phone, s: setPhone, t: 'tel' }, { l: 'Business Name', v: business, s: setBusiness, t: 'text' }].map(f => (
            <div key={f.l}>
              <label className="text-slate-500 text-xs font-semibold">{f.l}</label>
              <input type={f.t} value={f.v} onChange={e => { f.s(e.target.value); setSaved(false) }} className="w-full mt-1.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
            </div>
          ))}
        </div>

        {saved && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 text-center font-medium">Profile saved successfully!</div>}

        <button onClick={() => setSaved(true)} className="w-full bg-amber-500 text-slate-900 font-bold py-4 rounded-2xl text-base hover:bg-amber-400 transition-colors font-serif">Save Changes</button>
        <button className="w-full bg-red-50 border border-red-100 text-red-600 font-semibold py-3.5 rounded-2xl text-sm hover:bg-red-100 transition-colors">Logout</button>
      </div>
    </div>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; path: string }[] = [
    { id: 'dashboard', label: 'Dashboard', path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'inventory', label: 'Inventory', path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'reception', label: 'Billing', path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'settings', label: 'Settings', path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  return (
    <div className="bg-white border-t border-slate-100 flex shrink-0 pb-2">
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} className="flex-1 flex flex-col items-center gap-1 pt-2.5 pb-1 transition-opacity hover:opacity-80">
          <svg className={`w-5 h-5 transition-colors ${active === t.id ? 'text-amber-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active === t.id ? 2.5 : 1.5} d={t.path} />
          </svg>
          <span className={`text-[10px] font-semibold transition-colors ${active === t.id ? 'text-amber-500' : 'text-slate-400'}`}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [selectedItemId, setSelectedItemId] = useState('')

  const navigate = (s: Screen) => {
    setScreen(s)
    if (s === 'dashboard' || s === 'profile') setActiveTab('dashboard')
    else if (s === 'inventory' || s === 'inv-detail' || s === 'add-inventory') setActiveTab('inventory')
    else if (s === 'reception' || s === 'bill-preview' || s === 'billing-history') setActiveTab('reception')
    else if (s === 'settings') setActiveTab('settings')
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    const map: Record<Tab, Screen> = { dashboard: 'dashboard', inventory: 'inventory', reception: 'reception', settings: 'settings' }
    setScreen(map[tab])
  }

  return (
    <div className="min-h-screen bg-slate-700 flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 50% 30%, #334155 0%, #1e293b 60%, #0f172a 100%)' }}>
      <div
        className="relative flex flex-col overflow-hidden"
        style={{ width: 390, height: 844, borderRadius: 44, boxShadow: '0 0 0 12px #0f172a, 0 0 0 13px #334155, 0 50px 120px rgba(0,0,0,0.8)' }}
      >
        {/* Dynamic island */}
        <div className="absolute top-0 left-1/2 z-50 bg-black" style={{ width: 120, height: 36, borderRadius: '0 0 20px 20px', transform: 'translateX(-50%)' }} />

        {/* Screens */}
        <div className="flex-1 overflow-hidden">
          {screen === 'login' && <LoginScreen onLogin={() => navigate('dashboard')} />}
          {screen === 'dashboard' && <DashboardScreen navigate={navigate} />}
          {screen === 'inventory' && <InventoryListScreen navigate={navigate} onSelect={id => setSelectedItemId(id)} />}
          {screen === 'inv-detail' && <InventoryDetailScreen itemId={selectedItemId} onBack={() => navigate('inventory')} />}
          {screen === 'add-inventory' && <AddInventoryScreen onBack={() => navigate('inventory')} />}
          {screen === 'reception' && <ReceptionScreen navigate={navigate} />}
          {screen === 'bill-preview' && <BillPreviewScreen onBack={() => navigate('reception')} navigate={navigate} />}
          {screen === 'billing-history' && <BillingHistoryScreen navigate={navigate} />}
          {screen === 'settings' && <SettingsScreen navigate={navigate} />}
          {screen === 'profile' && <ProfileScreen onBack={() => navigate('dashboard')} />}
        </div>

        {screen !== 'login' && <BottomNav active={activeTab} onChange={handleTabChange} />}
      </div>
    </div>
  )
}
