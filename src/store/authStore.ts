import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginWithBackend, registerUser, verifyTwoFactorCode, resendTwoFactorCode } from '../api/auth'
import { disconnectNotificationSocket } from '../api/notificationSocket'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface PendingVerification {
  email: string
  source: 'register' | 'login'
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  pendingVerification: PendingVerification | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (firstName: string, paternalLastName: string, maternalLastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string; requires2fa?: boolean }>
  verifyTwoFactor: (code: string) => Promise<{ success: boolean; error?: string }>
  resendCode: (email: string) => Promise<void>
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

function buildUser(payload: Record<string, unknown>, email: string): AuthUser {
  return {
    id: (payload.sub as string) ?? '',
    name: (payload.name as string) ?? (payload.preferred_username as string) ?? email,
    email: (payload.email as string) ?? email,
    role: ((payload.realm_access as { roles?: string[] })?.roles?.[0]) ?? '',
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      pendingVerification: null,

      login: async (email, password) => {
        try {
          const { access_token } = await loginWithBackend(email, password)
          const payload = decodeJwtPayload(access_token)
          set({ user: buildUser(payload, email), token: access_token, isAuthenticated: true })
          return { success: true }
        } catch (err) {
          return { success: false, error: err instanceof Error ? err.message : 'Error al iniciar sesión' }
        }
      },

      register: async (firstName, paternalLastName, maternalLastName, email, password) => {
        try {
          const data = await registerUser({ firstName, paternalLastName, maternalLastName, email, password })
          if (data.requires2fa) {
            set({ pendingVerification: { email, source: 'register' } })
            return { success: true, requires2fa: true }
          }
          if (data.access_token) {
            const payload = decodeJwtPayload(data.access_token)
            set({ user: buildUser(payload, email), token: data.access_token, isAuthenticated: true })
          }
          return { success: true, requires2fa: false }
        } catch (err) {
          return { success: false, error: err instanceof Error ? err.message : 'Error al crear la cuenta' }
        }
      },

      verifyTwoFactor: async (code) => {
        const { pendingVerification } = get()
        if (!pendingVerification) return { success: false, error: 'Sesión expirada, vuelve a intentarlo' }
        try {
          const { access_token } = await verifyTwoFactorCode({ email: pendingVerification.email, code })
          const payload = decodeJwtPayload(access_token)
          set({
            user: buildUser(payload, pendingVerification.email),
            token: access_token,
            isAuthenticated: true,
            pendingVerification: null,
          })
          return { success: true }
        } catch (err) {
          return { success: false, error: err instanceof Error ? err.message : 'Código inválido' }
        }
      },

      resendCode: async (email) => {
        try {
          await resendTwoFactorCode(email)
        } catch {
          // UI handles cooldown state; silent failure here
        }
      },

      logout: () => {
        disconnectNotificationSocket()
        set({ user: null, token: null, isAuthenticated: false, pendingVerification: null })
      },
    }),
    {
      name: 'explo_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
