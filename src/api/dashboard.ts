import type { DashboardData } from '../types'
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
    weeklyActivity: [4, 6, 3, 8, 5, 2, 1],
    kpiStats: {
      properties: stats.properties.total,
      contracts: stats.contracts.total,
      expirations: stats.contracts.expiringNext30Days,
    },
    properties: [
      { id: 'p1', address: 'Av. Providencia 831, Of. 402', status: 'arrendada', tenant: 'Carlos Mendoza', monthlyRent: 950_000, contractEnd: '2026-09-01' },
      { id: 'p2', address: 'Las Condes 1420, Dep. 78', status: 'arrendada', tenant: 'Familia Herrera', monthlyRent: 1_250_000, contractEnd: '2026-04-24' },
      { id: 'p3', address: 'Vitacura 890, Casa', status: 'arrendada', tenant: 'Roberto Silva', monthlyRent: 1_800_000, contractEnd: '2026-05-05' },
      { id: 'p4', address: 'Lo Barnechea 45, Dep. 12', status: 'mantencion', monthlyRent: 780_000 },
      { id: 'p5', address: 'Ñuñoa 320, Dep. 3A', status: 'arrendada', tenant: 'Ana Fuentes', monthlyRent: 620_000, contractEnd: '2026-11-15' },
      { id: 'p6', address: 'Maipú 1100, Casa', status: 'disponible', monthlyRent: 550_000 },
      { id: 'p7', address: 'Santiago Centro 890', status: 'disponible', monthlyRent: 480_000 },
    ],
  }

  return { data, userId: backendUser.id }
}
