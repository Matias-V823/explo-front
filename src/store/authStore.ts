import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const MOCK_USER: AuthUser = {
  id: '1',
  name: 'Gloria González Avila',
  email: 'gloria@explo.cl',
  role: 'Agente Inmobiliario',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 600))
        if (email === 'gloria@explo.cl' && password === 'explo123') {
          set({ user: MOCK_USER, isAuthenticated: true })
          return { success: true }
        }
        return { success: false, error: 'Correo o contraseña incorrectos' }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'explo_auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
