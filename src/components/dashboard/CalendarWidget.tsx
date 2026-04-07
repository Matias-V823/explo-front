import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { CalendarEvent } from '../../types'

interface CalendarWidgetProps {
  events: CalendarEvent[]
}

const eventTypeClasses = {
  cobro: { dot: 'bg-sky', card: 'bg-sky-dim' },
  vencimiento: { dot: 'bg-danger', card: 'bg-danger-dim' },
  visita: { dot: 'bg-success', card: 'bg-success-dim' },
}

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export default function CalendarWidget({ events }: CalendarWidgetProps) {
  const today = new Date()
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const year = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>((acc, e) => {
    const d = new Date(e.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      acc[day] = acc[day] ? [...acc[day], e] : [e]
    }
    return acc
  }, {})

  const eventDays = new Set(Object.keys(eventsByDay).map(Number))
  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : []

  return (
    <div className="card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-[13px] font-medium text-ink-3 uppercase tracking-[0.6px]">Calendario</p>
          <p className="text-[15px] font-semibold text-ink mt-0.5">{MONTHS[month]} {year}</p>
        </div>
        <div className="flex gap-1">
          {[
            { icon: ChevronLeft, fn: () => setCurrent(new Date(year, month - 1, 1)) },
            { icon: ChevronRight, fn: () => setCurrent(new Date(year, month + 1, 1)) },
          ].map(({ icon: Icon, fn }, i) => (
            <button
              key={i}
              onClick={fn}
              className="w-7 h-7 rounded-[8px] border border-[rgba(0,0,0,0.08)] flex items-center justify-center text-ink-2 hover:bg-card-alt transition-colors"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-ink-4 py-1">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-4">
        {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday =
            day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const hasEvent = eventDays.has(day)
          const isSelected = day === selectedDay

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
              className={`aspect-square rounded-[7px] flex flex-col items-center justify-center gap-0.5 text-xs relative transition-all duration-150 border-[1.5px] ${
                isToday
                  ? 'bg-dark text-white font-semibold border-transparent'
                  : isSelected
                    ? 'bg-sky-dim text-sky font-semibold border-sky'
                    : 'text-ink font-normal border-transparent hover:bg-card-alt'
              }`}
            >
              {day}
              {hasEvent && (
                <div className={`absolute bottom-[3px] w-1 h-1 rounded-full ${isToday ? 'bg-white/70' : 'bg-gold'}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* Events */}
      {selectedEvents.length > 0 ? (
        <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto min-h-0">
          {selectedEvents.map((event) => {
            const { dot, card } = eventTypeClasses[event.type]
            return (
              <div key={event.id} className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] ${card}`}>
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                <p className="text-[12.5px] text-ink font-medium">{event.title}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-ink-4 flex-1 pt-2">Sin eventos para este día.</p>
      )}
    </div>
  )
}
