export type ArihantView = 'home' | 'dashboard' | 'summary' | 'settings'
export type FieldType = 'text' | 'date' | 'dropdown' | 'group'

export interface OptionItem {
  id: string
  label: string
}

export interface FieldDefinition {
  key: string
  label: string
  type: FieldType
  options?: string[]
  childFields?: FieldDefinition[]
}

export interface ReportSection {
  eventKey: string
  label: string
  fields: FieldDefinition[]
}

export interface ArihantWorkflowState {
  reportType: string
  bankName: string
  city: string
  branchName: string
  referenceNumber: string
  inspectionDate: string
  valuationDate: string
  reportCategory: string
}
