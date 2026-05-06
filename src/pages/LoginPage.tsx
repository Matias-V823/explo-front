import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: ChangeEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error ?? 'Error al iniciar sesión')
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-[26px] font-bold text-ink tracking-[-0.6px] mb-1.5">
          Iniciar sesión
        </h2>
        <p className="text-[13.5px] text-ink-3">Ingresa tus credenciales para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-[11px] font-semibold text-ink tracking-[0.6px] uppercase mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@explo.cl"
            autoComplete="email"
            required
            className="w-full h-10 px-3.5 rounded-[10px] bg-zinc-50 border border-[rgba(0,0,0,0.1)] text-[13.5px] text-ink placeholder:text-ink-3/50 focus:outline-none focus:border-[rgba(0,0,0,0.3)] focus:bg-white transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-[11px] font-semibold text-ink tracking-[0.6px] uppercase">
              Contraseña
            </label>
            <button
              type="button"
              className="text-[12px] text-ink-3 hover:text-ink transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full h-10 px-3.5 pr-10 rounded-[10px] bg-zinc-50 border border-[rgba(0,0,0,0.1)] text-[13.5px] text-ink placeholder:text-ink-3/40 focus:outline-none focus:border-[rgba(0,0,0,0.3)] focus:bg-white transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-red-50 border border-red-100">
            <AlertCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-[12.5px] text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-10 mt-1 rounded-[10px] bg-ink text-white text-[13.5px] font-medium hover:bg-ink-2 active:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Ingresando...</span>
            </>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>

      <div className="mt-7 px-4 py-3 rounded-[10px] bg-zinc-50 border border-[rgba(0,0,0,0.07)]">
        <p className="text-[11px] text-ink-3/60 text-center leading-relaxed">
          Demo&ensp;·&ensp;
          <span className="font-mono text-ink-3">gloria@explo.cl</span>
          &ensp;/&ensp;
          <span className="font-mono text-ink-3">explo123</span>
        </p>
      </div>

      <p className="mt-6 text-center text-[12.5px] text-ink-3">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-ink font-semibold hover:underline">
          Crear cuenta
        </Link>
      </p>
    </>
  )
}
