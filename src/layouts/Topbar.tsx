import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/propiedades', label: 'Propiedades' },
  // { to: '/contactos', label: 'Contactos' },
  // { to: '/boletas', label: 'Boletas' },
  { to: '/mapa', label: 'Mapa' },
  // { to: '/transacciones', label: 'Transacciones' },
  { to: '/calendario', label: 'Calendario' },
]

export default function Topbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/iniciar-sesion', { replace: true })
  }

  const initials = user?.name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('') ?? 'U'

  return (
    <header className="h-16 flex justify-between items-center px-8 gap-8 top-0 z-50">
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] bg-card shrink-0">
        <span className="text-sm font-semibold text-ink tracking-[-0.2px]">Explo</span>
      </div>
      <div className='flex'>
        <nav className="flex items-end justify-end gap-1 bg-zinc-50/80 rounded-full px-1.5 py-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-full text-[13.5px] no-underline whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'font-medium text-white bg-ink'
                    : 'font-normal text-ink-2 hover:bg-[rgba(0,0,0,0.05)]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0 h-9">
          <button className="flex gap-2 bg-zinc-50/80 rounded-full px-3.5 py-1.5 items-center justify-center text-ink-2 hover:bg-zinc-50 transition-colors h-full cursor-pointer">
            <Settings size={15} strokeWidth={1.8} />
            <span className="text-[13.5px] font-medium">Settings</span>
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-2 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Bell size={15} strokeWidth={1.8} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger border-[1.5px] border-white/80" />
          </button>
          <button
            title={user?.name}
            className="w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-sm font-bold text-ink cursor-pointer"
          >
            {initials}
          </button>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-3 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>

    </header>
  )
}
