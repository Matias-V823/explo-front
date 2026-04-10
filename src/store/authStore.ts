import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginWithBackend } from '../api/auth'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as Record<string, unknown>
  } catch {
    return {}
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { access_token } = await loginWithBackend(email, password)
          const payload = decodeJwtPayload(access_token)

          const user: AuthUser = {
            id: (payload.sub as string) ?? '',
            name: (payload.name as string) ?? (payload.preferred_username as string) ?? email,
            email: (payload.email as string) ?? email,
            role: ((payload.realm_access as { roles?: string[] })?.roles?.[0]) ?? '',
          }

          set({ user, token: access_token, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          return { success: false, error: err instanceof Error ? err.message : 'Error al iniciar sesión' }
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'explo_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
