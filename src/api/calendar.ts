import { apiFetch } from './client'

export interface CalendarEventFull {
  id: string
  title: string
  date: string
  startTime: string
  type: 'cobro' | 'vencimiento' | 'visita'
  description?: string
  source: 'manual' | 'property'
  propertyId?: number
  propertyName?: string
}

export interface CreateEventPayload {
  title: string
  date: string
  startTime: string
  type: 'cobro' | 'vencimiento' | 'visita'
  description?: string
}

export async function fetchCalendarEvents(): Promise<CalendarEventFull[]> {
  const res = await apiFetch('/calendar')
  if (!res.ok) throw new Error('Error al cargar los eventos')
  return res.json()
}

export async function createCalendarEvent(payload: CreateEventPayload): Promise<CalendarEventFull> {
  const res = await apiFetch('/calendar', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al crear el evento')
  return res.json()
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  const res = await apiFetch(`/calendar/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar el evento')
}
