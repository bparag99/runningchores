import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { mockAiFields } from '../data/reportData'
import type { ArihantView, ArihantWorkflowState } from '../types'

type ArihantContextValue = {
  view: ArihantView
  setView: (view: ArihantView) => void
  workflow: ArihantWorkflowState
  beginReport: (reportType: string, bankName: string) => void
  updateWorkflow: (updates: Partial<ArihantWorkflowState>) => void
  sectionValues: Record<string, Record<string, string>>
  updateSectionValue: (sectionKey: string, fieldKey: string, value: string) => void
  populateWithMockAi: () => void
}

const ArihantContext = createContext<ArihantContextValue | null>(null)

export function ArihantProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ArihantView>('home')
  const [workflow, setWorkflow] = useState<ArihantWorkflowState>({ reportType: '', bankName: '', city: '', branchName: '', referenceNumber: '', inspectionDate: '', valuationDate: '', reportCategory: '' })
  const [sectionValues, setSectionValues] = useState<Record<string, Record<string, string>>>({})

  const value = useMemo<ArihantContextValue>(() => ({
    view,
    setView,
    workflow,
    beginReport: (reportType, bankName) => {
      setWorkflow(previous => ({ ...previous, reportType, bankName, reportCategory: `${bankName}_${reportType}` }))
      setView('dashboard')
    },
    updateWorkflow: updates => setWorkflow(previous => ({ ...previous, ...updates })),
    sectionValues,
    updateSectionValue: (sectionKey, fieldKey, fieldValue) => setSectionValues(previous => ({ ...previous, [sectionKey]: { ...previous[sectionKey], [fieldKey]: fieldValue } })),
    populateWithMockAi: () => setSectionValues(previous => {
      const next = { ...previous }
      Object.entries(mockAiFields).forEach(([sectionKey, values]) => { next[sectionKey] = { ...next[sectionKey], ...values } })
      return next
    }),
  }), [sectionValues, view, workflow])

  return <ArihantContext.Provider value={value}>{children}</ArihantContext.Provider>
}

export function useArihant() {
  const context = useContext(ArihantContext)
  if (!context) throw new Error('useArihant must be used inside ArihantProvider')
  return context
}
