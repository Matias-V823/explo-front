import type { Availability } from "../types/properties";

export const AVAILABILITY_CONFIG: Record<Availability, { label: string; badgeClass: string }> = {
  arrendar: {
    label: 'Arrendar',
    badgeClass: 'bg-sky/10 text-sky border border-sky/20',
  },
  venta: {
    label: 'En venta',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  'no-disponible': {
    label: 'No disponible',
    badgeClass: 'bg-zinc-100 text-zinc-400 border border-zinc-200',
  },
}