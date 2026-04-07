import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Map,
  ArrowLeftRight,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/propiedades', label: 'Propiedades', icon: Building2 },
  { to: '/contactos', label: 'Contactos', icon: Users },
  { to: '/boletas', label: 'Boletas', icon: Receipt },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/transacciones', label: 'Transacciones', icon: ArrowLeftRight },
]

export default function Sidebar() {
  return (
    <aside className="w-[228px] min-w-[228px] bg-dark border-r border-white/[0.06] flex flex-col p-6 gap-1 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-3 pb-7">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[10px] bg-sky flex items-center justify-center">
            <TrendingUp size={17} color="#fff" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white tracking-[-0.2px]">Property</p>
            <p className="text-[11px] text-white/40 mt-px">Corretaje</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] no-underline text-[13.5px] transition-all duration-150 border-l-2 ${
                isActive
                  ? 'font-medium text-white bg-white/[0.1] border-sky'
                  : 'font-normal text-white/50 bg-transparent border-transparent hover:bg-white/[0.06] hover:text-white/75'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
        <p className="text-[11px] text-white/30 mb-1">Versión</p>
        <p className="text-xs text-white/45">Property Dashboard v1.0</p>
      </div>
    </aside>
  )
}
