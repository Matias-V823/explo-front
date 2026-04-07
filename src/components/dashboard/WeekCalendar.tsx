import React from 'react'
import type { CalendarEvent } from '../../types'
import { Box, Typography } from '@mui/material'

interface WeekCalendarProps {
  events: CalendarEvent[]
}

const TIME_SLOTS = ['8:00', '9:00', '10:00', '11:00', '12:00']

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

function getWeekDays(date: Date) {
  const day = date.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function WeekCalendar({ events }: WeekCalendarProps) {
  const today = new Date()
  const weekDays = getWeekDays(today)
  const month = today.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })

  const getEventsForDay = (date: Date) =>
    events.filter((e) => {
      const d = new Date(e.date)
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      )
    })

  return (
    <Box className="bg-zinc-50 rounded-[20px] shadow-sm" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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

      <Box sx={{ display: 'grid', gridTemplateColumns: '48px repeat(6, 1fr)', flex: 1, minHeight: 0 }}>
        {/* Column headers */}
        <Box />
        {weekDays.map((d, i) => {
          const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear()
          return (
            <Box key={i} sx={{ textAlign: 'center', pb: 1, borderBottom: '1px solid rgba(0,0,0,0.07)', mb: 0.5 }}>
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

        {/* Time rows */}
        {TIME_SLOTS.map((time) => (
          <React.Fragment key={`time-${time}`}>
            <Box sx={{ fontSize: 11, color: 'text.secondary', pt: 1, pr: 1, textAlign: 'right' }}>
              {time}
            </Box>
            {weekDays.map((d, di) => {
              const dayEvents = getEventsForDay(d)
              const hour = parseInt(time.split(':')[0])
              const slotEvents = dayEvents.filter((_, idx) => {
                const eventHour = 8 + (idx % TIME_SLOTS.length)
                return eventHour === hour
              })

              return (
                <Box
                  key={`${time}-${di}`}
                  sx={{
                    borderTop: '1px solid rgba(0,0,0,0.04)', p: 0.5, minHeight: 40, position: 'relative',
                    ...(di === 0 && { borderLeft: '1px solid rgba(0,0,0,0.07)' })
                  }}
                >
                  {slotEvents.map((event) => {
                    const { card, dot, title, sub } = eventTypeClasses[event.type]
                    return (
                      <Box key={event.id} sx={{ borderRadius: 2, px: 1, py: 0.5, mb: 0.5, bgcolor: card }}>
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
  )
}
