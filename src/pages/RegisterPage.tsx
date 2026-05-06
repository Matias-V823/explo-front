import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

interface StrengthResult {
  level: number
  label: string
  bars: string[]
  textColor: string
}

function getPasswordStrength(pwd: string): StrengthResult {
  if (!pwd) return { level: 0, label: '', bars: [], textColor: '' }

  let score = 0
  if (pwd.length >= 8) score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++
  if (/\d/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) return {
    level: 1, label: 'Débil', textColor: 'text-red-500',
    bars: ['bg-red-400', 'bg-zinc-200', 'bg-zinc-200', 'bg-zinc-200'],
  }
  if (score === 2) return {
    level: 2, label: 'Regular', textColor: 'text-amber-500',
    bars: ['bg-amber-400', 'bg-amber-400', 'bg-zinc-200', 'bg-zinc-200'],
  }
  if (score === 3) return {
    level: 3, label: 'Buena', textColor: 'text-yellow-600',
    bars: ['bg-yellow-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-zinc-200'],
  }
  return {
    level: 4, label: 'Fuerte', textColor: 'text-emerald-600',
    bars: ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500'],
  }
}

const inputClass =
  'w-full h-10 px-3.5 rounded-[10px] bg-zinc-50 border border-[rgba(0,0,0,0.1)] text-[13.5px] text-ink placeholder:text-ink-3/50 focus:outline-none focus:border-[rgba(0,0,0,0.3)] focus:bg-white transition-colors'

const labelClass =
  'block text-[11px] font-semibold text-ink tracking-[0.6px] uppercase mb-2'

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [paternalLastName, setPaternalLastName] = useState('')
  const [maternalLastName, setMaternalLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const strength = getPasswordStrength(password)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword
  const confirmMismatch = confirmPassword.length > 0 && !passwordsMatch

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setError('')
    setLoading(true)
    const result = await register(firstName, paternalLastName, maternalLastName, email, password)
    setLoading(false)
    if (result.success) {
      navigate(result.requires2fa ? '/verificar' : '/', { replace: true })
    } else {
      setError(result.error ?? 'Error al crear la cuenta')
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-[26px] font-bold text-ink tracking-[-0.6px] mb-1.5">Crear cuenta</h2>
        <p className="text-[13.5px] text-ink-3">Completa tus datos para comenzar</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* First name */}
        <div>
          <label className={labelClass}>Nombre(s)</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Nombre(s)"
            autoComplete="given-name"
            required
            className={inputClass}
          />
        </div>

        {/* Last names — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Apellido paterno</label>
            <input
              type="text"
              value={paternalLastName}
              onChange={(e) => setPaternalLastName(e.target.value)}
              placeholder="Paterno"
              autoComplete="family-name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Apellido materno</label>
            <input
              type="text"
              value={maternalLastName}
              onChange={(e) => setMaternalLastName(e.target.value)}
              placeholder="Materno"
              autoComplete="additional-name"
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@explo.cl"
            autoComplete="email"
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label className={labelClass}>Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
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
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {strength.bars.map((bar, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${bar}`} />
                ))}
              </div>
              <p className={`text-[11px] mt-1 font-medium ${strength.textColor}`}>{strength.label}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label className={labelClass}>Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              className={[
                'w-full h-10 px-3.5 pr-16 rounded-[10px] border text-[13.5px] text-ink placeholder:text-ink-3/40 focus:outline-none transition-colors',
                confirmMismatch
                  ? 'bg-red-50 border-red-200 focus:border-red-300'
                  : 'bg-zinc-50 border-[rgba(0,0,0,0.1)] focus:border-[rgba(0,0,0,0.3)] focus:bg-white',
              ].join(' ')}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {passwordsMatch && (
                <Check size={13} className="text-emerald-500 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-ink-3 hover:text-ink transition-colors"
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {confirmMismatch && (
            <p className="text-[11px] text-red-500 mt-1">Las contraseñas no coinciden</p>
          )}
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
              <span>Creando cuenta...</span>
            </>
          ) : (
            'Crear cuenta'
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-ink-3">
        ¿Ya tienes cuenta?{' '}
        <Link to="/iniciar-sesion" className="text-ink font-semibold hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </>
  )
}
