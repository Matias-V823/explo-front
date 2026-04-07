import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import type { Alert } from '../../types'

interface AlertListProps {
  alerts: Alert[]
}

const alertConfig = {
  danger: {
    icon: AlertCircle,
    iconColor: '#E05050',
    cardClass: 'bg-danger-dim border border-danger-border',
    badgeClass: 'text-danger bg-danger-dim',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: '#F2C94C',
    cardClass: 'bg-gold-dim border border-gold-border',
    badgeClass: 'text-gold bg-gold-dim',
  },
  info: {
    icon: Info,
    iconColor: '#5B9DD6',
    cardClass: 'bg-sky-dim border border-sky-border',
    badgeClass: 'text-sky bg-sky-dim',
  },
}

export default function AlertList({ alerts }: AlertListProps) {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[13px] font-medium text-ink-3 uppercase tracking-[0.6px]">Alertas</p>
        <span className="text-[11px] font-semibold text-danger bg-danger-dim px-2 py-0.5 rounded-[20px]">
          {alerts.filter((a) => a.type === 'danger').length} críticas
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
        {alerts.map((alert) => {
          const { icon: Icon, iconColor, cardClass } = alertConfig[alert.type]
          return (
            <div key={alert.id} className={`flex gap-3 p-3 rounded-[10px] ${cardClass}`}>
              <div className="pt-0.5 shrink-0">
                <Icon size={15} color={iconColor} strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink mb-0.5 leading-[1.3]">{alert.title}</p>
                <p className="text-[11.5px] text-ink-3 leading-[1.4] mb-1">{alert.description}</p>
                <p className="text-[11px] text-ink-4">{formatDate(alert.date)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
