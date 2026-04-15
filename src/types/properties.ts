export type Availability = 'arrendar' | 'venta' | 'no-disponible'
export type FilterAvailability = Availability | 'todas'
export type UtilityStatus = 'al-dia' | 'pendiente' | 'cortado' | 'no-aplica'

export type PropertyCategory =
  | 'bodega'
  | 'cabaña'
  | 'casa'
  | 'casa comercial'
  | 'comercial e industrial'
  | 'departamento'
  | 'estacionamiento'
  | 'galpon'
  | 'local comercial'
  | 'loft'
  | 'oficina'
  | 'parcela'
  | 'penthouse'
  | 'sitio'
  | 'terreno comercial'
  | 'terreno urbano'

export interface PropertyProgram {
  bedrooms?: number
  bathrooms?: number
  parkings?: number
  terrain?: number      // m²
  construction?: number // m²
}

export interface PropertyUtility {
  id: number
  utilityType: { id: number; name: string }
  serviceProvider: { id: number; name: string; billQueryUrl: string | null } | null
  status: UtilityStatus
  customerNumber: string | null
  billDueDay: number | null
  lastBillUrl: string | null
}

export type TransferStatus = 'pagado' | 'pendiente' | 'parcial' | 'atrasado'

export interface PendingItem {
  concept: 'arriendo' | 'electricidad' | 'agua' | 'gas' | 'otro'
  amount: number
}

export interface PropertyFinancials {
  monthlyRentCLP: number
  administrationPct: number
  administrationAmount: number
  paymentDueDay: number
  nextPaymentDate: string
  lastPaymentDate?: string
  transferStatus: TransferStatus
  pendingItems?: PendingItem[]
}

export interface PropertyDocument {
  id: number
  name: string
  documentType: { id: number; name: string }
  date: string
}

export interface ImportantDate {
  label: string
  date: string
  type: 'vencimiento' | 'revision' | 'pago' | 'inicio'
}

export interface ListingProperty {
  id: number
  images: string[]
  name: string
  description: string
  valueUF: number
  availability: Availability
  category: PropertyCategory
  ownerId: number
  ownerName: string
  contact: string
  location: string
  tenantId?: number
  program: PropertyProgram
  utilities: PropertyUtility[]
  documents: PropertyDocument[]
  importantDates: ImportantDate[]
  financials?: PropertyFinancials
}
