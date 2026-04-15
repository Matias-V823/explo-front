import type { Availability, PropertyCategory, UtilityStatus, ImportantDate } from './properties'

export type FormUtility = {
  utilityTypeId: number
  serviceProviderId: number
  status: UtilityStatus
  customerNumber: string
  billDueDay: string
}

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
  address: string
  countryId: string
  regionId: string
  cityId: string
  communeId: string
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
  utilities: FormUtility[]
  hasFinancials: boolean
  monthlyRentCLP: string
  administrationPct: string
  paymentDueDay: string
  importantDates: { label: string; date: string; type: ImportantDate['type'] }[]
  images: string[]
  documents: FormDocument[]
}
