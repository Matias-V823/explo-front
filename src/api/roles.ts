import { apiFetch } from './client'

export interface RoleOption {
  id: number
  name: string
}

export async function fetchRoles(): Promise<RoleOption[]> {
  const res = await apiFetch('/roles')
  if (!res.ok) throw new Error('No se pudieron cargar los roles')
  return res.json()
}
