import { Fragment } from 'react'
import { Building2, FileText, AlertTriangle } from 'lucide-react'
import type { KpiStatsData } from '../../types'

export default function KpiStats({ properties, contracts, expirations }: KpiStatsData) {
  const stats = [
    { icon: Building2, value: properties, label: 'Propiedades' },
    { icon: FileText, value: contracts, label: 'Contratos' },
    { icon: AlertTriangle, value: expirations, label: 'Vencimientos' },
  ]

  return (
    <div className="flex items-center gap-3 md:gap-6 xl:gap-8">
      {stats.map(({ icon: Icon, value, label }, i) => (
        <Fragment key={label}>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Icon size={13} strokeWidth={1.6} className="text-ink-4 hidden md:block" />
            <span className="text-[22px] md:text-[34px] xl:text-[40px] font-light text-ink tracking-[-1.5px] leading-none">
              {value}
            </span>
            <span className="text-[10px] md:text-[12px] xl:text-[13px] text-ink-3 leading-[1.3]">
              {label}
            </span>
          </div>
          {i < stats.length - 1 && (
            <div className="w-px h-5 md:h-10 xl:h-12 bg-[rgba(0,0,0,0.1)]" />
          )}
        </Fragment>
      ))}
    </div>
  )
}
