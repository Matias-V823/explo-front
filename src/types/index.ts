export interface User {
  name: string
  role: string
  avatarUrl: string
}

export interface MetricData {
  id: string
  label: string
  value: number | string
  delta?: number
  deltaLabel?: string
  variant: 'neutral' | 'success' | 'warning' | 'danger'
  unit?: string
}

export interface Property {
  id: string
  address: string
  status: 'arrendada' | 'disponible' | 'mantencion'
  tenant?: string
  monthlyRent: number
  contractEnd?: string
}

export interface Alert {
  id: string
  type: 'danger' | 'warning' | 'info'
  title: string
  description: string
  date: string
}

export interface Task {
  id: string
  title: string
  priority: 'alta' | 'media' | 'baja'
  done: boolean
  dueDate?: string
  category: 'cliente' | 'documento' | 'admin'
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'cobro' | 'vencimiento' | 'visita'
}

export interface RevenuePoint {
  month: string
  ingresos: number
  meta: number
}

export interface ProgressItem {
  label: string
  value: number
  variant?: 'dark' | 'yellow' | 'striped'
}

export interface KpiStatsData {
  properties: number
  contracts: number
  expirations: number
}

export interface DashboardData {
  user: User
  alerts: Alert[]
  properties: Property[]
  weeklyActivity: number[]
  progressItems: ProgressItem[]
  kpiStats: KpiStatsData
}
