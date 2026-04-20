import { create } from 'zustand'
import {
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  type CalendarEventFull,
  type CreateEventPayload,
} from '../api/calendar'

interface CalendarState {
  events: CalendarEventFull[]
  loading: boolean
  loadEvents: () => Promise<void>
  addEvent: (payload: CreateEventPayload) => Promise<void>
  removeEvent: (id: string) => Promise<void>
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  loading: false,

  loadEvents: async () => {
    set({ loading: true })
    try {
      const events = await fetchCalendarEvents()
      set({ events })
    } finally {
      set({ loading: false })
    }
  },

  addEvent: async (payload) => {
    const event = await createCalendarEvent(payload)
    set((state) => ({ events: [...state.events, event] }))
  },

  removeEvent: async (id) => {
    const event = get().events.find(e => e.id === id)
    if (!event || event.source !== 'manual') return
    await deleteCalendarEvent(id)
    set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
  },
}))
