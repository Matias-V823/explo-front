export type Availability = 'arrendar' | 'venta' | 'no-disponible'
export type FilterAvailability = Availability | 'todas'

export interface ListingProperty {
  id: number
  images: string[]
  name: string
  description: string
  valueUF: number
  availability: Availability
  ownerName: string
  contact: string
  location: string
}
