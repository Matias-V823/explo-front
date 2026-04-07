import { useState } from 'react'
import { BarChart2, FileText, PenLine, Mail, ArrowRight, Clock, CheckCircle2 } from 'lucide-react'

interface QuickAction {
  id: string
  icon: typeof BarChart2
  label: string
  sublabel: string
  status: 'pending' | 'active' | 'ok'
  badgeText: string
  ctaLabel: string
  accentColor: string
  iconBg: string
  iconColor: string
}

const actions: QuickAction[] = [
  {
    id: 'resumen',
    icon: BarChart2,
    label: 'Resumen por período',
    sublabel: 'Cierre mensual listo',
    status: 'ok',
    badgeText: 'Abril 2026',
    ctaLabel: 'Ver informe',
    accentColor: '#5B9DD6',
    iconBg: 'rgba(91,157,214,0.10)',
    iconColor: '#5B9DD6',
  },
  {
    id: 'liquidacion',
    icon: FileText,
    label: 'Inf. de liquidación',
    sublabel: '2 propietarios pendientes',
    status: 'pending',
    badgeText: '2 pendientes',
    ctaLabel: 'Generar',
    accentColor: '#E8943A',
    iconBg: 'rgba(232,148,58,0.10)',
    iconColor: '#E8943A',
  },
  {
    id: 'firma',
    icon: PenLine,
    label: 'Firmas electrónicas',
    sublabel: '3 documentos por firmar',
    status: 'pending',
    badgeText: '3 docs',
    ctaLabel: 'Revisar',
    accentColor: '#E05050',
    iconBg: 'rgba(224,80,80,0.10)',
    iconColor: '#E05050',
  },
  {
    id: 'correo',
    icon: Mail,
    label: 'Correo automático',
    sublabel: 'Envío programado activo',
    status: 'active',
    badgeText: 'Activo',
    ctaLabel: 'Configurar',
    accentColor: '#52A97E',
    iconBg: 'rgba(82,169,126,0.10)',
    iconColor: '#52A97E',
  },
]

const statusDotClass: Record<QuickAction['status'], string> = {
  pending: 'bg-[#E8943A]',
  active: 'bg-[#52A97E]',
  ok: 'bg-[#5B9DD6]',
}


export default function ActivityFeed() {
  return (
    <div className="card p-5 h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-base font-bold text-ink tracking-[-0.3px] leading-none mb-0.5">
            Acciones rápidas
          </p>
          <p className="text-xs text-ink-3">operaciones del período</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 flex-1">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              className={`
                relative flex flex-col items-start p-3.5 rounded-[14px] text-left
                transition-all duration-150 overflow-hidden bg-zinc-50 cursor-pointer shadow-sm
              `}
            >
              <span
                className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r-full"
                style={{ backgroundColor: action.accentColor }}
              />

              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center mb-2.5 ml-1"
                style={{ backgroundColor: action.iconBg }}
              >
                <Icon size={14} strokeWidth={1.8} style={{ color: action.iconColor }} />
              </span>

              <p className="text-[12.5px] font-semibold text-ink leading-tight mb-0.5 pl-1">
                {action.label}
              </p>
              <p className="text-[11px] text-ink-3 leading-tight mb-2.5 pl-1">
                {action.sublabel}
              </p>

              <div className="flex items-center justify-between w-full pl-1">
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDotClass[action.status]} ${action.status === 'pending' ? 'animate-pulse' : ''}`}
                  />
                  <span className="text-[10.5px] text-ink-3 font-medium">{action.badgeText}</span>
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
