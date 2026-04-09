import { Navigate, Outlet } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const stats = [
  { value: '2.4K+', label: 'Propiedades' },
  { value: '98%', label: 'Satisfacción' },
  { value: '180+', label: 'Agentes' },
]

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[58%] bg-ink relative flex-col overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            ].join(', '),
            backgroundSize: '44px 44px',
          }}
        />

        <div className="absolute top-16 right-16 flex gap-2 opacity-30">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          ))}
        </div>

        <div className="relative z-10 flex flex-col h-full p-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-sky-500 flex items-center justify-center shrink-0">
              <TrendingUp size={17} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="text-[14px] font-semibold text-white tracking-[-0.2px]">Explo</span>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-105">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/8 mb-7 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-[11px] text-white/50 font-medium tracking-[0.4px] uppercase">
                Gestión Inmobiliaria
              </span>
            </div>
            <h1 className="text-[40px] font-bold text-white leading-[1.15] tracking-[-1.2px] mb-5">
              Tu plataforma de corretaje profesional
            </h1>
            <p className="text-[14.5px] text-white/38 leading-relaxed">
              Gestiona propiedades, contactos y transacciones desde un solo lugar.
            </p>
          </div>

          <div className="flex gap-10 pt-8 border-t border-white/[0.07]">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-[24px] font-bold text-white tracking-[-0.5px]">{value}</p>
                <p className="text-[11px] text-white/32 mt-0.5 uppercase tracking-[0.4px]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-[0.04]"
          viewBox="0 0 900 140"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect x="0" y="80" width="60" height="60" fill="white" />
          <rect x="70" y="50" width="45" height="90" fill="white" />
          <rect x="125" y="20" width="80" height="120" fill="white" />
          <rect x="140" y="20" width="8" height="14" fill="#111827" />
          <rect x="215" y="55" width="55" height="85" fill="white" />
          <rect x="280" y="35" width="100" height="105" fill="white" />
          <rect x="310" y="10" width="12" height="25" fill="#111827" />
          <rect x="390" y="60" width="50" height="80" fill="white" />
          <rect x="450" y="30" width="75" height="110" fill="white" />
          <rect x="460" y="15" width="10" height="15" fill="#111827" />
          <rect x="535" y="65" width="45" height="75" fill="white" />
          <rect x="590" y="40" width="90" height="100" fill="white" />
          <rect x="620" y="20" width="14" height="20" fill="#111827" />
          <rect x="690" y="55" width="55" height="85" fill="white" />
          <rect x="755" y="25" width="70" height="115" fill="white" />
          <rect x="770" y="10" width="10" height="15" fill="#111827" />
          <rect x="835" y="70" width="65" height="70" fill="white" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        <div className="flex lg:hidden items-center gap-2.5 px-8 pt-8">
          <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">
            <TrendingUp size={15} color="#fff" strokeWidth={2.2} />
          </div>
          <span className="text-[13px] font-semibold text-ink tracking-[-0.2px]">Explo</span>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-90">
            <Outlet />
          </div>
        </div>

        <p className="text-center text-[11.5px] text-ink-3/50 pb-8">
          © {new Date().getFullYear()} Explo · Plataforma Inmobiliaria
        </p>
      </div>
    </div>
  )
}
