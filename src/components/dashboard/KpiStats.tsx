import { Building2, FileText, AlertTriangle } from 'lucide-react'
import type { KpiStatsData } from '../../types'

export default function KpiStats({ properties, contracts, expirations }: KpiStatsData) {
  const stats = [
    { icon: Building2, value: properties, label: 'Propiedades' },
    { icon: FileText, value: contracts, label: 'Contratos' },
    { icon: AlertTriangle, value: expirations, label: 'Vencimientos' },
  ]

  return (
    <div className="flex items-center gap-8">
      {stats.map(({ icon: Icon, value, label }, i) => (
        <>
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={16} strokeWidth={1.6} className="text-ink-4" />
            <span className="text-[40px] font-light text-ink tracking-[-1.5px] leading-none">
              {value}
            </span>
            <span className="text-[13px] text-ink-3 leading-[1.3] max-w-12 mr-3">{label}</span>
          </div>
          {i < stats.length - 1 && (
            <div key={`div-${i}`} className="w-px h-12 bg-[rgba(0,0,0,0.1)]" />
          )}
        </>
      ))}
    </div>
  )
}
