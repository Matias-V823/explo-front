export type Availability = 'arrendar' | 'venta' | 'no-disponible'
export type FilterAvailability = Availability | 'todas'

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
  category: PropertyCategory
}
