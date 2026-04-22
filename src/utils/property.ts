import type { Availability } from "../types/properties";

export const AVAILABILITY_CONFIG: Record<Availability, { label: string; badgeClass: string }> = {
  'disponible-arriendo': {
    label: 'Disponible arriendo',
    badgeClass: 'bg-sky/10 text-sky border border-sky/20',
  },
  'arrendada': {
    label: 'Arrendada',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  },
  'disponible-venta': {
    label: 'Disponible venta',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  'no-disponible': {
    label: 'No disponible',
    badgeClass: 'bg-zinc-100 text-zinc-400 border border-zinc-200',
  },
}
