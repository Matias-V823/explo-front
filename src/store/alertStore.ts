import { create } from 'zustand'
import { fetchAlerts } from '../api/alerts'
import type { Alert } from '../types'

interface AlertState {
  alerts: Alert[]
  loading: boolean
  loadAlerts: () => Promise<void>
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  loading: false,

  loadAlerts: async () => {
    set({ loading: true })
    try {
      const alerts = await fetchAlerts()
      set({ alerts })
    } finally {
      set({ loading: false })
    }
  },
}))
