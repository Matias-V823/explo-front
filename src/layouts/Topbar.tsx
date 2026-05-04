import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const settingsLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex gap-2 rounded-full px-3.5 py-1.5 items-center justify-center transition-colors h-full cursor-pointer no-underline ${
    isActive ? 'bg-ink text-white' : 'bg-zinc-50/80 text-ink-2 hover:bg-zinc-50'
  }`

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
  const [menuOpen, setMenuOpen] = useState(false)

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
    <header className="h-16 flex justify-between items-center px-4 md:px-8 gap-4 md:gap-8 top-0 z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(0,0,0,0.1)] bg-card shrink-0">
        <span className="text-sm font-semibold text-ink tracking-[-0.2px]">Explo</span>
      </div>

      {/* Desktop nav + actions */}
      <div className="hidden md:flex items-center">
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
          <NavLink to="/configuracion" className={settingsLinkClass}>
            <Settings size={15} strokeWidth={1.8} />
            <span className="text-[13.5px] font-medium" title='Configuración'>Configuración</span>
          </NavLink>
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

      {/* Mobile actions */}
      <div className="flex md:hidden items-center gap-1.5">
        <button className="relative w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-2 cursor-pointer">
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
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="w-9 h-9 rounded-full bg-white border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-2 cursor-pointer transition-colors"
        >
          {menuOpen ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mx-4 mt-1 bg-white rounded-2xl border border-[rgba(0,0,0,0.08)] shadow-lg overflow-hidden z-50">
          <nav className="flex flex-col p-2 gap-0.5">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-[14px] no-underline transition-all duration-150 ${
                    isActive
                      ? 'font-semibold text-white bg-ink'
                      : 'font-normal text-ink-2 hover:bg-zinc-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-[rgba(0,0,0,0.06)] p-2 flex flex-col gap-0.5">
            <NavLink
              to="/configuracion"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] no-underline transition-colors cursor-pointer w-full text-left ${
                  isActive ? 'bg-ink text-white font-medium' : 'text-ink-2 hover:bg-zinc-50 font-normal'
                }`
              }
            >
              <Settings size={15} strokeWidth={1.8} />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={() => { setMenuOpen(false); handleLogout() }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] text-ink-3 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer w-full text-left"
            >
              <LogOut size={15} strokeWidth={1.8} />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
