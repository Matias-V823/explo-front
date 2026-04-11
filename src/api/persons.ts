import { apiFetch } from './client'
import type { PersonOption } from '../types/persons'

interface PersonResponse {
  id: number
  name: string
  paternalLastName: string
  role: { id: number; name: string }
}

export interface CreatePersonPayload {
  name: string
  paternalLastName: string
  maternalLastName: string
  email: string
  phone: string
  roleName: string
}

export interface CreatedPersonResponse {
  id: number
  name: string
  paternalLastName: string
  maternalLastName: string
  email: string
  phone: string
  role: { id: number; name: string }
}

export async function fetchPersons(): Promise<PersonOption[]> {
  const res = await apiFetch('/persons')
  if (!res.ok) throw new Error('No se pudo obtener el listado de personas')
  const data: PersonResponse[] = await res.json()
  return data.map(p => ({
    id: p.id,
    name: p.name,
    paternalLastName: p.paternalLastName,
    roleId: p.role?.id,
  }))
}

export async function createPerson(payload: CreatePersonPayload): Promise<CreatedPersonResponse> {
  const res = await apiFetch('/persons', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message ?? 'Error al crear la persona')
  }
  return res.json()
}
