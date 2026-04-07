import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import type { MetricData } from '../../types'

interface MetricCardProps {
  metric: MetricData
}

const variantBarClass: Record<string, string> = {
  neutral: 'bg-sky',
  success: 'bg-success',
  warning: 'bg-gold',
  danger: 'bg-danger',
}

const variantDeltaClass: Record<string, string> = {
  neutral: 'text-sky',
  success: 'text-success',
  warning: 'text-gold',
  danger: 'text-danger',
}

export default function MetricCard({ metric }: MetricCardProps) {
  const displayValue =
    metric.unit === 'clp'
      ? formatCurrency(metric.value as number)
      : metric.value

  const hasDelta = metric.delta !== undefined
  const isPositiveDelta = (metric.delta ?? 0) >= 0

  return (
    <div className="card p-5 relative overflow-hidden hover:-translate-y-px transition-transform duration-200">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[16px] ${variantBarClass[metric.variant]}`} />

      <p className="text-[11.5px] font-medium text-ink-3 uppercase tracking-[0.6px] mb-2.5">
        {metric.label}
      </p>

      <p className={`font-bold text-ink tracking-[-0.8px] leading-[1.1] ${metric.unit === 'clp' ? 'text-[22px]' : 'text-[32px]'}`}>
        {displayValue}
      </p>

      {metric.deltaLabel && (
        <div className="flex items-center gap-1.5 mt-2.5">
          {hasDelta && (
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${variantDeltaClass[metric.variant]}`}>
              {isPositiveDelta ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {Math.abs(metric.delta!)}
              {metric.unit === 'clp' ? '%' : ''}
            </div>
          )}
          <p className="text-[11.5px] text-ink-4">{metric.deltaLabel}</p>
        </div>
      )}
    </div>
  )
}
