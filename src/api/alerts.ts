import { apiFetch } from './client'
import type { Alert } from '../types'

export async function fetchAlerts(): Promise<Alert[]> {
  const res = await apiFetch('/alerts')
  if (!res.ok) throw new Error('No se pudo obtener las alertas')
  return res.json() as Promise<Alert[]>
}
