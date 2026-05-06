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
