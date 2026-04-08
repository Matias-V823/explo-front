import { CalendarClock } from 'lucide-react'
import type { ImportantDate } from '../../types/properties'
import { formatDateFull } from '../../utils/formatters'

const DATE_COLOR: Record<string, string> = {
  vencimiento: 'bg-red-50 text-red-500 border-red-100',
  revision: 'bg-amber-50 text-amber-600 border-amber-100',
  pago: 'bg-sky/10 text-sky border-sky/20',
  inicio: 'bg-emerald-50 text-emerald-600 border-emerald-100',
}

export default function PropertyDateList({ dates }: { dates: ImportantDate[] }) {
  if (dates.length === 0) return null

  return (
    <div className="mt-4">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-zinc-400 mb-2.5">Fechas importantes</p>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-4">
        {dates.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
            <div className="flex items-center gap-2.5">
              <CalendarClock size={13} strokeWidth={1.8} className="text-ink-3 shrink-0" />
              <span className="text-[12.5px] text-ink">{item.label}</span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${DATE_COLOR[item.type]}`}>
              {formatDateFull(item.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
