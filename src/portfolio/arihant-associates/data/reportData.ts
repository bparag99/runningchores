import type { OptionItem, ReportSection } from '../types'

export const reportTypes: OptionItem[] = [
  { id: 'residential', label: 'Residential Property Valuation' },
  { id: 'commercial', label: 'Commercial Property Valuation' },
  { id: 'industrial', label: 'Industrial Property Valuation' },
  { id: 'land', label: 'Land & Building Valuation' },
]

export const bankNames: OptionItem[] = [
  { id: 'pnb', label: 'Punjab National Bank' },
  { id: 'ubi', label: 'Union Bank of India' },
  { id: 'sbi', label: 'State Bank of India' },
  { id: 'hdfc', label: 'HDFC Bank' },
]

export const cities: OptionItem[] = [
  { id: 'indore', label: 'Indore' },
  { id: 'dewas', label: 'Dewas' },
  { id: 'pitampur', label: 'Pitampur' },
]

const commonFields = (fields: ReportSection['fields']): ReportSection['fields'] => fields

export const reportSections: ReportSection[] = [
  { eventKey: 'I', label: 'General', fields: commonFields([
    { key: 'valuer_name', label: 'Name & Address of Valuer', type: 'text' },
    { key: 'purpose', label: 'Purpose for which the valuation is made', type: 'text' },
    { key: 'inspection_date', label: 'Date of Inspection', type: 'date' },
    { key: 'valuation_date', label: 'Date on which the valuation is made', type: 'date' },
    { key: 'property_description', label: 'Brief Description of Property', type: 'text' },
    { key: 'property_location', label: 'Location of Property', type: 'text' },
    { key: 'area_classification', label: 'Classification of the Area', type: 'group', childFields: [
      { key: 'high_middle_poor', label: 'High / Middle / Poor', type: 'text' },
      { key: 'urban_semiurban_rural', label: 'Urban / Semi Urban / Rural', type: 'text' },
    ] },
  ]) },
  { eventKey: 'II', label: 'Physical Characteristics', fields: [
    { key: 'property_classification', label: 'Property Classification', type: 'dropdown', options: ['High', 'Medium', 'Low'] },
    { key: 'flooring_type', label: 'Flooring Type', type: 'text' },
    { key: 'roof_type', label: 'Roof Type', type: 'text' },
    { key: 'site_dimensions', label: 'Dimensions of Site / Flat', type: 'text' },
  ] },
  { eventKey: 'III', label: 'Town Planning Parameters', fields: [
    { key: 'town_plan_approval', label: 'Town Plan Approval', type: 'dropdown', options: ['Approved', 'Pending', 'Not Available'] },
    { key: 'layout_map_verified', label: 'Layout Map Verified', type: 'dropdown', options: ['Yes', 'No'] },
    { key: 'local_government', label: 'Corporation Limit / Panchayat / Municipality', type: 'text' },
  ] },
  ...[
    ['IV', 'Legal Aspects'], ['V', 'Socio Cultural Aspects'], ['VI', 'Economic Aspects'],
    ['VII', 'Functional Utilitarian Aspects'], ['VIII', 'Infrastructure Availability'], ['IX', 'Marketability'],
    ['X', 'Engineering Technology Aspects'], ['XI', 'Environmental Factors'], ['XII', 'Architectural Aesthetic Quality'],
    ['XIII', 'Industrial Property Valuation'], ['XIV', 'Valuation'],
  ].map(([eventKey, label]) => ({ eventKey, label, fields: [
    { key: `${eventKey.toLowerCase()}_observations`, label: `${label} observations`, type: 'text' as const },
    { key: `${eventKey.toLowerCase()}_status`, label: 'Section status', type: 'dropdown' as const, options: ['Draft', 'Reviewed', 'Complete'] },
    { key: `${eventKey.toLowerCase()}_notes`, label: 'Notes', type: 'text' as const },
  ] })),
]

export const mockAiFields: Record<string, Record<string, string>> = {
  I: { valuer_name: 'Sanjay Jain', inspection_date: '2024-11-05', valuation_date: '2024-12-12', purpose: 'Investment' },
  II: { property_classification: 'High', flooring_type: 'Marble', roof_type: 'RCC' },
  III: { town_plan_approval: 'Approved', layout_map_verified: 'Yes' },
}
