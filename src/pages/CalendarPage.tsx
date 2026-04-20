import { Fragment, useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCalendarStore } from '../store/calendarStore'
import type { CalendarEventFull, CreateEventPayload } from '../api/calendar'
import NewEventModal from '../components/calendar/NewEventModal'

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8)
const DAYS_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const TYPE_CONFIG = {
  cobro: {
    label: 'Cobro',
    accent: '#A87B1E',
    bg: '#FBF5E6',
    text: '#6B4E00',
    chipBorder: 'rgba(168,123,30,0.28)',
    dotClass: 'bg-[#A87B1E]',
  },
  vencimiento: {
    label: 'Vencimiento',
    accent: '#C0302A',
    bg: '#FFF1F0',
    text: '#891F1A',
    chipBorder: 'rgba(192,48,42,0.28)',
    dotClass: 'bg-[#C0302A]',
  },
  visita: {
    label: 'Visita',
    accent: '#1A7044',
    bg: '#EFF9F2',
    text: '#124D2E',
    chipBorder: 'rgba(26,112,68,0.28)',
    dotClass: 'bg-[#1A7044]',
  },
} as const

type EventType = keyof typeof TYPE_CONFIG

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6)
  const start = monday.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  const end = sunday.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${start} – ${end}`
}

interface DetailPopover {
  event: CalendarEventFull
  x: number
  y: number
}

export default function CalendarPage() {
  const today = new Date()
  const navigate = useNavigate()
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(today))
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null)
  const [detail, setDetail] = useState<DetailPopover | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const { events, loading, loadEvents, addEvent, removeEvent } = useCalendarStore()

  useEffect(() => { loadEvents() }, [])

  useEffect(() => {
    if (!gridRef.current) return
    const rowH = 60
    const scrollTo = Math.max(today.getHours() - 9, 0) * rowH
    gridRef.current.scrollTop = scrollTo
  }, [])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentMonday, i))

  const getSlotEvents = (date: Date, hour: number) =>
    events.filter((e) => {
      if (e.date !== toISO(date)) return false
      return parseInt(e.startTime.split(':')[0]) === hour
    })

  const weekEvents = events.filter((e) => {
    const d = new Date(e.date + 'T00:00:00')
    return d >= currentMonday && d <= addDays(currentMonday, 6)
  })

  const typeCounts = {
    cobro: weekEvents.filter((e) => e.type === 'cobro').length,
    vencimiento: weekEvents.filter((e) => e.type === 'vencimiento').length,
    visita: weekEvents.filter((e) => e.type === 'visita').length,
  }

  const isCurrentWeek = isSameDay(currentMonday, getMonday(today))

  const openCreate = (date: Date, hour: number) => {
    setDetail(null)
    // property-sourced events are read-only — clicking an empty slot still opens modal
    setSelectedSlot({ date, hour })
  }

  const closeModal = () => setSelectedSlot(null)

  const handleSubmit = (payload: CreateEventPayload) => {
    addEvent(payload)
    closeModal()
  }

  const openDetail = (e: React.MouseEvent, event: CalendarEventFull) => {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDetail({ event, x: rect.left, y: rect.bottom + 8 })
  }

  const handleDelete = (id: string) => {
    removeEvent(id)
    setDetail(null)
  }

  const currentHour = today.getHours()

  return (
    <div className="px-8 pt-8 pb-10 max-w-350 mx-auto w-full">

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-extrabold text-ink tracking-[-1px] leading-[1.1] mb-2">
            Calendario
          </h1>
          <p className="text-[13px]" style={{ color: '#9B9791' }}>
            {loading ? 'Cargando…' : `${weekEvents.length} evento${weekEvents.length !== 1 ? 's' : ''} esta semana`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          <div className="flex items-center gap-1.5">
            {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(([type, cfg]) => (
              <div
                key={type}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1.75 rounded-lg bg-white text-xs"
                style={{ border: `1px solid ${cfg.chipBorder}`, borderLeft: `2.5px solid ${cfg.accent}` }}
              >
                <span className="font-bold tabular-nums" style={{ color: cfg.text }}>{typeCounts[type]}</span>
                <span style={{ color: cfg.text, opacity: 0.65 }}>{cfg.label}</span>
              </div>
            ))}
          </div>

          <div
            className="flex items-center gap-0.5 bg-white rounded-[10px] p-0.5"
            style={{ border: '1px solid rgba(0,0,0,0.09)' }}
          >
            <button
              onClick={() => setCurrentMonday((m) => addDays(m, -7))}
              className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: '#9B9791' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.color = '#0F0F0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9B9791' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-[13px] font-semibold text-ink px-2.5 min-w-52.5 text-center select-none tabular-nums">
              {formatWeekRange(currentMonday)}
            </span>
            <button
              onClick={() => setCurrentMonday((m) => addDays(m, 7))}
              className="w-7 h-7 rounded-[7px] flex items-center justify-center transition-colors cursor-pointer"
              style={{ color: '#9B9791' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.color = '#0F0F0E' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#9B9791' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {!isCurrentWeek && (
            <button
              onClick={() => setCurrentMonday(getMonday(today))}
              className="px-3.5 py-1.75 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 cursor-pointer"
              style={{ backgroundColor: '#0F0F0E', color: '#FFFFFF' }}
            >
              Hoy
            </button>
          )}
        </div>
      </div>

      <div
        className="rounded-2xl bg-white overflow-hidden"
        style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 1px 4px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.05)' }}
      >
        <div ref={gridRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 230px)' }}>
          <div className="grid" style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}>

            <div
              className="sticky top-0 z-10 bg-white h-13"
              style={{ borderRight: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
            />
            {weekDays.map((d, i) => {
              const isToday = isSameDay(d, today)
              return (
                <div
                  key={i}
                  className="top-0 z-10 h-13 flex flex-col items-center justify-center"
                  style={{
                    borderLeft: '1px solid rgba(0,0,0,0.06)',
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                    backgroundColor: isToday ? 'rgba(168,123,30,0.05)' : '#ffffff',
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.7px] mb-1.25"
                    style={{ color: isToday ? '#A87B1E' : '#9B9791' }}
                  >
                    {DAYS_SHORT[i]}
                  </span>
                  <div
                    className="w-6.5 h-6.5 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors"
                    style={isToday
                      ? { backgroundColor: '#0F0F0E', color: '#FFFFFF' }
                      : { color: '#0F0F0E' }
                    }
                  >
                    {d.getDate()}
                  </div>
                </div>
              )
            })}

            {HOURS.map((hour) => (
              <Fragment key={hour}>
                <div
                  className="h-15 flex items-start justify-end pr-3 pt-2.25"
                  style={{ borderRight: '1px solid rgba(0,0,0,0.06)', borderTop: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <span className="text-[10px] font-semibold tracking-[0.2px]" style={{ color: '#B0ABA5' }}>
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>

                {weekDays.map((day, di) => {
                  const isToday = isSameDay(day, today)
                  const isNow = isToday && hour === currentHour
                  const slotEvents = getSlotEvents(day, hour)

                  return (
                    <div
                      key={`${hour}-${di}`}
                      onClick={() => openCreate(day, hour)}
                      className="h-15 px-1 pt-1 pb-0.5 relative cursor-pointer group transition-colors"
                      style={{
                        borderLeft: '1px solid rgba(0,0,0,0.06)',
                        borderTop: '1px solid rgba(0,0,0,0.06)',
                        backgroundColor: isNow
                          ? 'rgba(168,123,30,0.07)'
                          : isToday
                          ? 'rgba(168,123,30,0.025)'
                          : 'transparent',
                      }}
                      onMouseEnter={e => {
                        if (!isNow) (e.currentTarget as HTMLElement).style.backgroundColor = isToday ? 'rgba(168,123,30,0.055)' : 'rgba(0,0,0,0.018)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = isNow ? 'rgba(168,123,30,0.07)' : isToday ? 'rgba(168,123,30,0.025)' : 'transparent'
                      }}
                    >
                      {isNow && (
                        <>
                          <div
                            className="absolute top-0 left-0 right-0 z-10"
                            style={{ height: '1.5px', backgroundColor: '#C0302A' }}
                          />
                          <div
                            className="absolute z-10 rounded-full"
                            style={{ top: '-3.5px', left: '-1px', width: '8px', height: '8px', backgroundColor: '#C0302A' }}
                          />
                        </>
                      )}

                      {slotEvents.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Plus
                            size={10}
                            className="opacity-0 group-hover:opacity-20 transition-opacity"
                            style={{ color: '#6B6660' }}
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-0.5 relative z-10">
                        {slotEvents.map((event) => {
                          const cfg = TYPE_CONFIG[event.type]
                          return (
                            <button
                              key={event.id}
                              onClick={(e) => openDetail(e, event)}
                              className="w-full text-left rounded-r pl-1.75 pr-2 py-0.75 flex items-center gap-1.5 min-w-0 transition-all cursor-pointer overflow-hidden hover:brightness-95"
                              style={{
                                borderLeft: `2.5px solid ${cfg.accent}`,
                                backgroundColor: cfg.bg,
                              }}
                            >
                              <span
                                className="text-[10.5px] font-semibold truncate leading-tight"
                                style={{ color: cfg.text }}
                              >
                                {event.title}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {detail && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDetail(null)} />
          <div
            className="fixed z-50 bg-white rounded-xl p-4 w-72"
            style={{
              top: Math.min(detail.y, window.innerHeight - 260),
              left: Math.min(detail.x, window.innerWidth - 300),
              border: '1px solid rgba(0,0,0,0.09)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="h-0.75 rounded-full mb-4"
              style={{ backgroundColor: TYPE_CONFIG[detail.event.type].accent, width: '32px' }}
            />

            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-ink leading-tight truncate mb-0.5">
                  {detail.event.title}
                </p>
                <p className="text-[11px]" style={{ color: '#9B9791' }}>
                  {new Date(detail.event.date + 'T00:00:00').toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' })}
                  {' · '}
                  {detail.event.startTime}
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                style={{ color: '#9B9791' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.06)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <X size={11} />
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md"
                style={{
                  backgroundColor: TYPE_CONFIG[detail.event.type].bg,
                  color: TYPE_CONFIG[detail.event.type].text,
                  borderLeft: `2px solid ${TYPE_CONFIG[detail.event.type].accent}`,
                }}
              >
                {TYPE_CONFIG[detail.event.type].label}
              </span>
              {detail.event.source === 'property' && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: '#6B6660' }}
                >
                  <Building2 size={10} strokeWidth={2} />
                  Propiedad
                </span>
              )}
            </div>

            {detail.event.description && (
              <p
                className="text-xs leading-[1.55] mb-3 rounded-lg px-3 py-2"
                style={{ color: '#3D3B38', backgroundColor: 'rgba(0,0,0,0.03)' }}
              >
                {detail.event.description}
              </p>
            )}

            {detail.event.source === 'property' && detail.event.propertyId != null ? (
              <button
                onClick={() => { setDetail(null); navigate(`/propiedades/${detail.event.propertyId}`) }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer"
                style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#0F0F0E', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <Building2 size={11} />
                Ver propiedad
              </button>
            ) : (
              <button
                onClick={() => handleDelete(detail.event.id)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-[9px] text-xs font-semibold transition-colors cursor-pointer"
                style={{ border: '1px solid rgba(192,48,42,0.18)', color: '#C0302A', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#FFF1F0'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
              >
                <Trash2 size={11} />
                Eliminar evento
              </button>
            )}
          </div>
        </>
      )}

      {selectedSlot && (
        <NewEventModal
          slot={selectedSlot}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
