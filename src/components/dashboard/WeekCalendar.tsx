import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCalendarStore } from '../../store/calendarStore'
import { WEEKDAY_LABELS, toDateISO, getWeekDays } from '../../utils/calendar'

const SLOT_START_HOUR = 8
const SLOT_END_HOUR = 20
const WINDOW_SIZE = 7

function getVisibleTimeSlots(currentHour: number): string[] {
  const clamped = Math.max(SLOT_START_HOUR, Math.min(SLOT_END_HOUR, currentHour))
  const relative = clamped - SLOT_START_HOUR
  const windowIndex = Math.floor(relative / WINDOW_SIZE)
  const posInWindow = relative % WINDOW_SIZE

  let windowStart = SLOT_START_HOUR + windowIndex * WINDOW_SIZE
  if (posInWindow === WINDOW_SIZE - 1) {
    windowStart = SLOT_START_HOUR + (windowIndex + 1) * WINDOW_SIZE
  }
  windowStart = Math.min(windowStart, SLOT_END_HOUR - WINDOW_SIZE + 1)

  return Array.from({ length: WINDOW_SIZE }, (_, i) => {
    const h = windowStart + i
    return h <= SLOT_END_HOUR ? `${h}:00` : null
  }).filter(Boolean) as string[]
}

const eventTypeClasses = {
  cobro:      { card: '#111827',          dot: '#D4AF37',    title: '#ffffff', sub: 'rgba(255,255,255,0.5)' },
  vencimiento:{ card: '#FFF8E7',          dot: '#f44336',    title: '#1a1a1a', sub: 'rgba(26,26,26,0.5)' },
  visita:     { card: '#e8f5e9',          dot: '#4caf50',    title: '#1a1a1a', sub: 'rgba(26,26,26,0.5)' },
}

const legendItems = [
  { label: 'Cobro',       dotColor: '#D4AF37'    },
  { label: 'Vencimiento', dotColor: '#f44336'  },
  { label: 'Visita',      dotColor: '#4caf50' },
]


export default function WeekCalendar() {
  const { events, loadEvents } = useCalendarStore()
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours())
  const navigate = useNavigate()

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours())
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  const visibleTimeSlots = getVisibleTimeSlots(currentHour)

  const today = new Date()
  const weekDays = getWeekDays(today, 6)
  const month = today.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  const getEventsForDay = (date: Date) =>
    events.filter((e) => e.date === toDateISO(date))

  return (
    <Box className="bg-zinc-50 rounded-[20px] shadow-sm" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }} onClick={() => navigate('/calendario')}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
          {month.charAt(0).toUpperCase() + month.slice(1)}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {legendItems.map(({ label, dotColor }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: dotColor }} />
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Column headers — fijos */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '48px repeat(6, 1fr)', flexShrink: 0 }}>
        <Box />
        {weekDays.map((d, i) => {
          const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          return (
            <Box key={i} sx={{ textAlign: 'center', pb: 1, borderBottom: '1px solid rgba(0,0,0,0.07)', mb: 0.5, minWidth: 0, overflow: 'hidden' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {WEEKDAY_LABELS[i]}
              </Typography>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, bgcolor: isToday ? 'text.primary' : 'transparent', color: isToday ? 'primary.contrastText' : 'text.primary',
                fontWeight: isToday ? 'bold' : 'normal'
              }}>
                {d.getDate()}
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* Time rows — scrollable */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '48px repeat(6, 1fr)' }}>
          {visibleTimeSlots.map((time) => (
            <React.Fragment key={`time-${time}`}>
              <Box sx={{ fontSize: 11, color: 'text.secondary', pt: 1, pr: 1, textAlign: 'right' }}>
                {time}
              </Box>
              {weekDays.map((d, di) => {
                const dayEvents = getEventsForDay(d)
                const hour = parseInt(time.split(':')[0])
                const slotEvents = dayEvents.filter((e) => {
                  if (!e.startTime) return false
                  const eventHour = parseInt(e.startTime.split(':')[0])
                  return eventHour === hour
                })

                return (
                  <Box
                    key={`${time}-${di}`}
                    sx={{
                      borderTop: '1px solid rgba(0,0,0,0.04)', p: 0.5, minHeight: 40, position: 'relative',
                      minWidth: 0, overflow: 'hidden',
                      ...(di === 0 && { borderLeft: '1px solid rgba(0,0,0,0.07)' })
                    }}
                  >
                    {slotEvents.map((event) => {
                      const { card, dot, title, sub } = eventTypeClasses[event.type]
                      return (
                        <Box key={event.id} sx={{ borderRadius: 2, px: 1, py: 0.5, mb: 0.5, bgcolor: card, minWidth: 0, overflow: 'hidden' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: '1px' }}>
                            <Box sx={{ width: 4, height: 4, borderRadius: '50%', flexShrink: 0, bgcolor: dot }} />
                            <Typography sx={{ fontSize: 10, fontWeight: 'bold', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: title }}>
                              {event.title.split(' — ')[0]}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: 9.5, color: sub }}>
                            {event.title.split(' — ')[1] ?? ''}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Box>
                )
              })}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
