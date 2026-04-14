import type { Availability, PropertyCategory, UtilityStatus, ImportantDate } from './properties'

export type FormDocument = {
  name: string
  documentTypeId: number
  date: string
  url: string
}

export interface FormState {
  name: string
  category: PropertyCategory
  availability: Availability
  location: string
  valueUF: string
  contact: string
  description: string
  bedrooms: string
  bathrooms: string
  parkings: string
  construction: string
  terrain: string
  ownerId: string
  tenantId: string
  electricity: UtilityStatus
  electricityBill: string
  water: UtilityStatus
  waterBill: string
  gas: UtilityStatus
  gasBill: string
  hasFinancials: boolean
  monthlyRentCLP: string
  administrationPct: string
  paymentDueDay: string
  importantDates: { label: string; date: string; type: ImportantDate['type'] }[]
  images: string[]
  documents: FormDocument[]
}
