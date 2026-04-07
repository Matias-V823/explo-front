import type { PropertyCategory } from '../types/properties'

export const CATEGORIES: { value: PropertyCategory | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas las categorías' },
  { value: 'bodega', label: 'Bodega' },
  { value: 'cabaña', label: 'Cabaña' },
  { value: 'casa', label: 'Casa' },
  { value: 'casa comercial', label: 'Casa comercial' },
  { value: 'comercial e industrial', label: 'Comercial e industrial' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'estacionamiento', label: 'Estacionamiento' },
  { value: 'galpon', label: 'Galpón' },
  { value: 'local comercial', label: 'Local comercial' },
  { value: 'loft', label: 'Loft' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'parcela', label: 'Parcela' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'sitio', label: 'Sitio' },
  { value: 'terreno comercial', label: 'Terreno comercial' },
  { value: 'terreno urbano', label: 'Terreno urbano' },
]
