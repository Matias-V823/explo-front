import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { CreateEventPayload } from '../../api/calendar'

type EventType = 'cobro' | 'vencimiento' | 'visita'

const TYPE_CONFIG = {
  cobro:      { label: 'Cobro',      accent: '#A87B1E', bg: '#FBF5E6', text: '#6B4E00', chipBorder: 'rgba(168,123,30,0.28)' },
  vencimiento:{ label: 'Vencimiento',accent: '#C0302A', bg: '#FFF1F0', text: '#891F1A', chipBorder: 'rgba(192,48,42,0.28)'  },
  visita:     { label: 'Visita',     accent: '#1A7044', bg: '#EFF9F2', text: '#124D2E', chipBorder: 'rgba(26,112,68,0.28)'  },
} as const

const labelCls = 'block text-[9px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1'
const inputCls = 'w-full h-7 px-2.5 rounded-md bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[11.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors'

function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatSlotDate(date: Date): string {
  return date.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
}

interface Props {
  slot: { date: Date; hour: number }
  onClose: () => void
  onSubmit: (payload: CreateEventPayload) => void
}

export default function NewEventModal({ slot, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    title: '',
    type: 'visita' as EventType,
    description: '',
    date: toISO(slot.date),
    startTime: `${String(slot.hour).padStart(2, '0')}:00`,
  })

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    onSubmit({
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      startTime: form.startTime,
      description: form.description.trim() || undefined,
    })
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px]">Nuevo evento</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5 capitalize">
              {formatSlotDate(slot.date)}
              {' · '}
              {String(slot.hour).padStart(2, '0')}:00
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center cursor-pointer text-zinc-400 hover:text-ink transition-colors"
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          <div>
            <label className={labelCls}>Título</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
              placeholder="Nombre del evento…"
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Tipo</label>
            <div className="flex gap-1.5">
              {(Object.entries(TYPE_CONFIG) as [EventType, typeof TYPE_CONFIG[EventType]][]).map(([type, cfg]) => {
                const selected = form.type === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('type', type)}
                    className="flex-1 h-7 rounded-md text-[11px] font-semibold transition-all cursor-pointer"
                    style={{
                      borderLeft: selected ? `2.5px solid ${cfg.accent}` : '1px solid rgba(0,0,0,0.08)',
                      borderTop: selected ? `1px solid ${cfg.chipBorder}` : '1px solid rgba(0,0,0,0.08)',
                      borderRight: selected ? `1px solid ${cfg.chipBorder}` : '1px solid rgba(0,0,0,0.08)',
                      borderBottom: selected ? `1px solid ${cfg.chipBorder}` : '1px solid rgba(0,0,0,0.08)',
                      backgroundColor: selected ? cfg.bg : '#FAFAFA',
                      color: selected ? cfg.text : '#A1A1AA',
                    }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hora</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => set('startTime', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Opcional…"
              rows={2}
              className="w-full px-2.5 py-1.5 rounded-md bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[11.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-8 rounded-lg border border-zinc-200 text-[11.5px] font-medium text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="flex-1 h-8 rounded-lg bg-ink text-white text-[11.5px] font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-30 disabled:cursor-default cursor-pointer"
            >
              Crear evento
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  )
}
