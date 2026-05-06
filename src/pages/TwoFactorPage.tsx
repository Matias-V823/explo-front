import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, RefreshCw } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import OtpInput from '../components/auth/OtpInput'

export default function TwoFactorPage() {
  const { verifyTwoFactor, pendingVerification, resendCode } = useAuthStore((s) => ({
    verifyTwoFactor: s.verifyTwoFactor,
    pendingVerification: s.pendingVerification,
    resendCode: s.resendCode,
  }))
  const navigate = useNavigate()

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!pendingVerification) navigate('/registro', { replace: true })
  }, [pendingVerification, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) return
    setError('')
    setLoading(true)
    const result = await verifyTwoFactor(code)
    setLoading(false)
    if (result.success) {
      navigate('/', { replace: true })
    } else {
      setError(result.error ?? 'Código inválido')
      setDigits(Array(6).fill(''))
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || !pendingVerification) return
    setResending(true)
    await resendCode(pendingVerification.email)
    setResending(false)
    setCooldown(60)
    setDigits(Array(6).fill(''))
    setError('')
  }

  if (!pendingVerification) return null

  const codeComplete = digits.join('').length === 6

  return (
    <>
      <div className="mb-8">
        <div className="w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center mb-5">
          <Mail size={18} className="text-sky-500" />
        </div>
        <h2 className="text-[26px] font-bold text-ink tracking-[-0.6px] mb-1.5">
          Verificación en dos pasos
        </h2>
        <p className="text-[13.5px] text-ink-3 leading-relaxed">
          Enviamos un código de 6 dígitos a{' '}
          <span className="font-medium text-ink">{pendingVerification.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-[11px] font-semibold text-ink tracking-[0.6px] uppercase mb-3">
            Código de verificación
          </label>
          <OtpInput value={digits} onChange={setDigits} hasError={!!error} disabled={loading} />
        </div>

        {error && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] bg-red-50 border border-red-100">
            <AlertCircle size={14} className="text-red-500 shrink-0" />
            <p className="text-[12.5px] text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !codeComplete}
          className="h-10 rounded-[10px] bg-ink text-white text-[13.5px] font-medium hover:bg-zinc-800 active:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            'Verificar código'
          )}
        </button>
      </form>

      <div className="mt-7 flex flex-col items-center gap-1.5">
        <p className="text-[12.5px] text-ink-3">¿No recibiste el código?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="flex items-center gap-1.5 text-[12.5px] text-ink font-semibold hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-opacity"
        >
          {resending
            ? <Loader2 size={12} className="animate-spin" />
            : <RefreshCw size={12} />}
          {cooldown > 0
            ? `Reenviar en ${cooldown}s`
            : resending
              ? 'Reenviando...'
              : 'Reenviar código'}
        </button>
      </div>
    </>
  )
}
