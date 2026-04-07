import { ArrowUpRight } from 'lucide-react'

interface RevenueChartProps {
  weeklyActivity: number[]
}

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MAX_BAR_H = 72

export default function RevenueChart({ weeklyActivity }: RevenueChartProps) {
  const total = weeklyActivity.reduce((a, b) => a + b, 0)
  const maxVal = Math.max(...weeklyActivity)

  return (
    <div className="card p-5 h-full flex flex-col bg-zinc-50/80 rounded-[20px] shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <p className="text-base font-bold text-ink tracking-[-0.3px]">Actividad</p>
        <button className="w-7 h-7 rounded-[10px] border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-3 cursor-pointer">
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="flex gap-2 text-start items-center justify-start">
        <p className="text-[40px] font-extrabold text-ink leading-none">{total}</p>
        <p className="text-xs text-ink-3 leading-[1.3]">gestiones<br />esta semana</p>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-end gap-1.5 h-25">
          {weeklyActivity.map((val, i) => {
            const barH = val > 0 ? Math.max((val / maxVal) * MAX_BAR_H, 4) : 4
            const isPeak = val === maxVal && val > 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
                {isPeak && (
                  <span className="bg-gold text-ink text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                    {val} hoy
                  </span>
                )}
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isPeak ? 'bg-gold' : 'bg-ink'
                  } ${val === 0 ? 'opacity-25' : ''}`}
                  style={{ height: barH }}
                />
              </div>
            )
          })}
        </div>

        <div className="flex gap-1.5 mt-1.5">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-ink-4">{d}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
