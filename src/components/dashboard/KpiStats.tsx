import { Building2, FileText, AlertTriangle } from 'lucide-react'
import type { KpiStatsData } from '../../types'

export default function KpiStats({ properties, contracts, expirations }: KpiStatsData) {
  const stats = [
    { icon: Building2, value: properties, label: 'Propiedades' },
    { icon: FileText, value: contracts, label: 'Contratos' },
    { icon: AlertTriangle, value: expirations, label: 'Vencimientos' },
  ]

  return (
    <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
      {stats.map(({ icon: Icon, value, label }, i) => (
        <div key={label} className="flex items-center gap-3 md:gap-6 lg:gap-8">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Icon size={13} strokeWidth={1.6} className="text-ink-4 hidden md:block" />
            <span className="text-[22px] md:text-[34px] lg:text-[40px] font-light text-ink tracking-[-1.5px] leading-none">
              {value}
            </span>
            <span className="text-[10px] md:text-[12px] lg:text-[13px] text-ink-3 leading-[1.3] max-w-[64px] md:max-w-11 lg:max-w-12 md:mr-2 lg:mr-3">
              {label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-5 md:h-10 lg:h-12 bg-[rgba(0,0,0,0.1)]" />
          )}
        </div>
      ))}
    </div>
  )
}
