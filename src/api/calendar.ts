import { apiFetch } from './client'

export interface CalendarEventFull {
  id: string
  title: string
  date: string
  startTime: string
  type: 'cobro' | 'vencimiento' | 'visita'
  description?: string
}

export interface CreateEventPayload {
  title: string
  date: string
  startTime: string
  type: 'cobro' | 'vencimiento' | 'visita'
  description?: string
}

const MOCK_EVENTS: CalendarEventFull[] = [
  // Semana actual (13–19 Apr 2026)
  { id: 'c1',  title: 'Cobro — Providencia 831',       date: '2026-04-13', startTime: '09:00', type: 'cobro',       description: 'Arriendo mensual Carlos Mendoza' },
  { id: 'c2',  title: 'Cobro — Ñuñoa 320',             date: '2026-04-13', startTime: '10:00', type: 'cobro' },
  { id: 'c3',  title: 'Visita técnica — Lo Barnechea', date: '2026-04-14', startTime: '11:00', type: 'visita',      description: 'Mantención programada, confirmar acceso' },
  { id: 'c4',  title: 'Cobro — Vitacura 890',          date: '2026-04-15', startTime: '09:00', type: 'cobro' },
  { id: 'c5',  title: 'Reunión — Familia Herrera',     date: '2026-04-15', startTime: '15:00', type: 'visita',      description: 'Consulta renovación de contrato Las Condes' },
  { id: 'c6',  title: 'Cobro — Maipú 1100',            date: '2026-04-16', startTime: '09:00', type: 'cobro' },
  { id: 'c7',  title: 'Visita — Maipú 1100',           date: '2026-04-17', startTime: '10:00', type: 'visita',      description: 'Mostrar propiedad a interesados' },
  { id: 'c8',  title: 'Cobro — Las Condes 1420',       date: '2026-04-18', startTime: '09:00', type: 'cobro' },
  // Próxima semana (20–26 Apr 2026)
  { id: 'c9',  title: 'Visita — Santiago Centro 890',  date: '2026-04-20', startTime: '10:00', type: 'visita' },
  { id: 'c10', title: 'Cobro — Providencia 831',       date: '2026-04-21', startTime: '09:00', type: 'cobro' },
  { id: 'c11', title: 'Cobro — Ñuñoa 320',             date: '2026-04-21', startTime: '10:30', type: 'cobro' },
  { id: 'c12', title: 'Vencimiento — Las Condes 1420', date: '2026-04-24', startTime: '10:00', type: 'vencimiento', description: 'Contrato vence, sin confirmación de renovación' },
  { id: 'c13', title: 'Reunión — Roberto Silva',       date: '2026-04-23', startTime: '16:00', type: 'visita',      description: 'Revisión estado propiedad Vitacura' },
  // Semana del 27 Apr – 3 May
  { id: 'c14', title: 'Cobro — Vitacura 890',          date: '2026-04-28', startTime: '09:00', type: 'cobro' },
  { id: 'c15', title: 'Visita — Providencia 831',      date: '2026-04-29', startTime: '11:00', type: 'visita' },
  { id: 'c16', title: 'Vencimiento — Vitacura 890',    date: '2026-05-05', startTime: '09:00', type: 'vencimiento', description: 'Vence en 29 días, arrendatario solicitó reunión' },
  // Semana anterior (6–12 Apr 2026)
  { id: 'c17', title: 'Cobro — Providencia 831',       date: '2026-04-07', startTime: '09:00', type: 'cobro' },
  { id: 'c18', title: 'Visita — Ñuñoa 320',            date: '2026-04-08', startTime: '14:00', type: 'visita',      description: 'Revisión humedad departamento 3A' },
  { id: 'c19', title: 'Cobro — Las Condes 1420',       date: '2026-04-08', startTime: '09:00', type: 'cobro' },
  { id: 'c20', title: 'Reunión — Ana Fuentes',         date: '2026-04-10', startTime: '15:00', type: 'visita' },
]

export async function fetchCalendarEvents(): Promise<CalendarEventFull[]> {
  try {
    const res = await apiFetch('/calendar')
    if (res.ok) return res.json() as Promise<CalendarEventFull[]>
  } catch {
    // fall through to mock
  }
  return Promise.resolve([...MOCK_EVENTS])
}

export async function createCalendarEvent(payload: CreateEventPayload): Promise<CalendarEventFull> {
  try {
    const res = await apiFetch('/calendar', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (res.ok) return res.json() as Promise<CalendarEventFull>
  } catch {
    // fall through to mock
  }
  return Promise.resolve({ id: `evt-${Date.now()}`, ...payload })
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  try {
    await apiFetch(`/calendar/${id}`, { method: 'DELETE' })
  } catch {
    // silent
  }
}
