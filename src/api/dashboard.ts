import type { DashboardData, PropertyStats, RevenueStats } from '../types'
import { apiFetch } from './client'
import { fetchStatistics, computeProgressItems } from './statistics'

interface BackendUser {
  id: number
  keycloakId: string
  name: string
  paternalLastName: string
  maternalLastName: string
  email: string
  phone: string
  role: { id: number; name: string } | null
  avatarUrl: string | null
}

export interface DashboardResult {
  data: DashboardData
  userId: number
}

export async function fetchDashboardData(): Promise<DashboardResult> {
  const [response, stats] = await Promise.all([
    apiFetch('/users/me'),
    fetchStatistics(),
  ])
  if (!response.ok) throw new Error('No se pudo obtener el perfil del usuario')
  const backendUser: BackendUser = await response.json()

  const fullName = [backendUser.name, backendUser.paternalLastName, backendUser.maternalLastName]
    .filter(Boolean)
    .join(' ')

  const data: DashboardData = {
    user: {
      name: fullName || backendUser.email,
      role: backendUser.role?.name ?? '',
      avatarUrl: backendUser.avatarUrl! ?? undefined,
    },

    alerts: [
      {
        id: 'a1',
        type: 'danger',
        title: 'Pago atrasado — Av. Providencia 831',
        description: 'Carlos Mendoza lleva 12 días de atraso en su arriendo.',
        date: '2026-03-25',
      },
      {
        id: 'a2',
        type: 'warning',
        title: 'Contrato crítico — Las Condes 1420',
        description: 'Vence en 18 días. Sin confirmación de renovación.',
        date: '2026-04-24',
      },
      {
        id: 'a3',
        type: 'warning',
        title: 'Contrato por vencer — Vitacura 890',
        description: 'Vence en 29 días. Arrendatario solicitó reunión.',
        date: '2026-05-05',
      },
      {
        id: 'a4',
        type: 'info',
        title: 'Mantención programada — Lo Barnechea 45',
        description: 'Visita técnica el 10 de abril.',
        date: '2026-04-10',
      },
    ],
    progressItems: computeProgressItems(stats),
    kpiStats: {
      properties: stats.properties.total,
      contracts: stats.contracts.total,
      expirations: stats.contracts.expiringNext30Days,
    },
    propertyStats: {
      rented: stats.properties.withTenant,
      available: stats.properties.available,
      maintenance: stats.properties.total - stats.properties.withTenant - stats.properties.available,
      total: stats.properties.total,
    } satisfies PropertyStats,
    revenueStats: {
      totalMonthlyRent: stats.revenue.totalMonthlyRent,
      paidAmount: stats.revenue.paidAmount,
      pendingAmount: stats.revenue.pendingAmount,
      partialAmount: stats.revenue.partialAmount,
      overdueAmount: stats.revenue.overdueAmount,
      adminIncome: stats.revenue.adminIncome,
      collectionRate: stats.revenue.collectionRate,
    } satisfies RevenueStats,
  }

  return { data, userId: backendUser.id }
}
