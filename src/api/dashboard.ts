import type { DashboardData } from '../types'
import { apiFetch } from './client'

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

export async function fetchDashboardData(): Promise<DashboardData> {
  const response = await apiFetch('/users/me')
  if (!response.ok) throw new Error('No se pudo obtener el perfil del usuario')
  const backendUser: BackendUser = await response.json()

  const fullName = [backendUser.name, backendUser.paternalLastName, backendUser.maternalLastName]
    .filter(Boolean)
    .join(' ')

  return {
    user: {
      name: fullName || backendUser.email,
      role: backendUser.role?.name ?? '',
      avatarUrl: backendUser.avatarUrl! ?? undefined,
    },
    metrics: [
      {
        id: 'total-propiedades',
        label: 'Propiedades activas',
        value: 42,
        delta: 3,
        deltaLabel: 'este mes',
        variant: 'neutral',
      },
      {
        id: 'boletas-generadas',
        label: 'Boletas generadas',
        value: 38,
        delta: 2,
        deltaLabel: 'pendientes',
        variant: 'success',
      },
      {
        id: 'contratos-vencer',
        label: 'Contratos por vencer',
        value: 5,
        delta: -1,
        deltaLabel: 'próximos 30 días',
        variant: 'warning',
      },
      {
        id: 'proximos-cobros',
        label: 'Próximos cobros',
        value: 12,
        deltaLabel: 'esta semana',
        variant: 'neutral',
      },
      {
        id: 'ingresos-mes',
        label: 'Ingresos del mes',
        value: 18_450_000,
        delta: 8.4,
        deltaLabel: 'vs mes anterior',
        variant: 'success',
        unit: 'clp',
      },
    ],
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
    tasks: [
      { id: 't1', title: 'Llamar a C. Mendoza por atraso', priority: 'alta', done: false, dueDate: '2026-04-07', category: 'cliente' },
      { id: 't2', title: 'Preparar contrato renovación Las Condes', priority: 'alta', done: false, dueDate: '2026-04-09', category: 'documento' },
      { id: 't3', title: 'Enviar boletas de abril', priority: 'media', done: true, dueDate: '2026-04-05', category: 'admin' },
      { id: 't4', title: 'Coordinar visita Vitacura 890', priority: 'media', done: false, dueDate: '2026-04-11', category: 'cliente' },
      { id: 't5', title: 'Actualizar tasación Ñuñoa 320', priority: 'baja', done: false, dueDate: '2026-04-15', category: 'documento' },
    ],
    calendarEvents: [
      { id: 'e1', title: 'Cobro — Providencia 831', date: '2026-04-08', type: 'cobro' },
      { id: 'e2', title: 'Vencimiento — Las Condes 1420', date: '2026-04-24', type: 'vencimiento' },
      { id: 'e3', title: 'Visita — Lo Barnechea 45', date: '2026-04-10', type: 'visita' },
      { id: 'e4', title: 'Cobro — Ñuñoa 320', date: '2026-04-08', type: 'cobro' },
      { id: 'e5', title: 'Cobro — Vitacura 890', date: '2026-04-10', type: 'cobro' },
      { id: 'e6', title: 'Vencimiento — Vitacura 890', date: '2026-05-05', type: 'vencimiento' },
    ],
    revenueData: [
      { month: 'Noviembre', ingresos: 14_200_000, meta: 16_000_000 },
      { month: 'Diciembre', ingresos: 15_800_000, meta: 16_000_000 },
      { month: 'Enero', ingresos: 13_400_000, meta: 16_000_000 },
      { month: 'Febrero', ingresos: 16_900_000, meta: 16_000_000 },
      { month: 'Marzo', ingresos: 17_020_000, meta: 16_000_000 },
      { month: 'Abril', ingresos: 18_450_000, meta: 16_000_000 },
    ],
    weeklyActivity: [4, 6, 3, 8, 5, 2, 1],
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
}
