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
  propertyId: number
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

export interface PropertyStats {
  rented: number
  available: number
  maintenance: number
  total: number
}

export interface RevenueStats {
  totalMonthlyRent: number
  paidAmount: number
  pendingAmount: number
  partialAmount: number
  overdueAmount: number
  adminIncome: number
  collectionRate: number
}

export interface DashboardData {
  user: User
  propertyStats: PropertyStats
  revenueStats: RevenueStats
  progressItems: ProgressItem[]
  kpiStats: KpiStatsData
}
