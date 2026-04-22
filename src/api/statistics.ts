import { apiFetch } from './client'

export interface Statistics {
  properties: {
    total: number
    withTenant: number
    available: number
  }
  contracts: {
    total: number
    expiringNext30Days: number
    expiringNext90Days: number
  }
  payments: {
    total: number
    paid: number
    pending: number
    partial: number
    overdue: number
  }
  utilities: {
    total: number
    upToDate: number
    pending: number
    cut: number
  }
  revenue: {
    totalMonthlyRent: number
    paidAmount: number
    pendingAmount: number
    partialAmount: number
    overdueAmount: number
    adminIncome: number
    collectionRate: number
  }
}

export interface ProgressItem {
  label: string
  value: number
  variant?: 'dark' | 'yellow' | 'striped'
}

export async function fetchStatistics(): Promise<Statistics> {
  const res = await apiFetch('/statistics')
  if (!res.ok) throw new Error('No se pudo obtener estadísticas')
  return res.json()
}

const safe = (num: number, den: number) => (den === 0 ? 0 : Math.round((num / den) * 100))

export function computeProgressItems(stats: Statistics): ProgressItem[] {
  return [
    {
      label: 'Propiedades arrendadas',
      value: safe(stats.properties.withTenant, stats.properties.total),
      variant: 'dark',
    },
    {
      label: 'Boletas al día',
      value: safe(stats.utilities.upToDate, stats.utilities.total),
      variant: 'yellow',
    },
    {
      label: 'Cobros al día',
      value: safe(stats.payments.paid, stats.payments.total),
      variant: 'yellow',
    },
    {
      label: 'Contratos estables',
      value: safe(
        stats.contracts.total - stats.contracts.expiringNext30Days,
        stats.contracts.total,
      ),
      variant: 'striped',
    },
  ]
}
