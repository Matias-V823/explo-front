import { useState, useEffect, useRef } from 'react'
import { Check, AlertTriangle, AlertCircle, Info, Plus, X, Bell, BellOff } from 'lucide-react'
import { LinearProgress, Tooltip } from '@mui/material'
import { formatDate } from '../utils/formatters'
import { useDashboardData } from '../store/dashboardStore'
import type { Task } from '../types'

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const DEFAULT_CATEGORIES = ['cliente', 'documento', 'admin']

const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  cliente: { text: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  documento: { text: '#92701a', bg: 'rgba(180,130,20,0.10)' },
  admin: { text: '#6b7280', bg: 'rgba(0,0,0,0.06)' },
}

const EXTRA_CATEGORY_COLORS = [
  { text: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { text: '#059669', bg: 'rgba(5,150,105,0.08)' },
  { text: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  { text: '#db2777', bg: 'rgba(219,39,119,0.08)' },
]

function getCategoryColor(cat: string, allCategories: string[]) {
  if (CATEGORY_COLORS[cat]) return CATEGORY_COLORS[cat]
  const extraIdx = allCategories.filter((c) => !CATEGORY_COLORS[c]).indexOf(cat)
  return EXTRA_CATEGORY_COLORS[extraIdx % EXTRA_CATEGORY_COLORS.length]
}

const PRIORITY_SLOT: Record<string, string> = {
  alta: 'bg-red-400',
  media: 'bg-gold',
  baja: 'bg-[rgba(225,225,225,0.60)]',
}

const PRIORITY_DOT: Record<string, string> = {
  alta: 'bg-red-400',
  media: 'bg-gold',
  baja: 'bg-[rgba(225,225,225,0.60)]',
}

const ALERT_ICON = { danger: AlertCircle, warning: AlertTriangle, info: Info }
const ALERT_COLOR: Record<string, string> = { danger: '#dc2626', warning: '#d97706', info: '#2563eb' }
const ALERT_CARD: Record<string, string> = {
  danger: 'bg-red-50 border-red-200/80',
  warning: 'bg-amber-50 border-amber-200/80',
  info: 'bg-blue-50 border-blue-200/80',
}
const ALERT_TITLE: Record<string, string> = {
  danger: 'text-red-900',
  warning: 'text-amber-900',
  info: 'text-blue-900',
}
const ALERT_DESC: Record<string, string> = {
  danger: 'text-red-700/70',
  warning: 'text-amber-700/70',
  info: 'text-blue-700/70',
}

type StatusFilter = 'todas' | 'pendientes' | 'completadas'
type PriorityFilter = 'todas' | 'alta' | 'media' | 'baja'

const TasksPage = () => {
  const { data, loading } = useDashboardData()
  const [tasks, setTasks] = useState<Task[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pendientes')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('todas')
  const [showForm, setShowForm] = useState(false)
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<Task['priority']>('media')
  const [newCategory, setNewCategory] = useState('admin')
  const [newDueDate, setNewDueDate] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const newCategoryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (data) setTasks(data.tasks)
  }, [data])

  useEffect(() => {
    if (addingCategory) newCategoryInputRef.current?.focus()
  }, [addingCategory])

  const alerts = data?.alerts ?? []

  const filtered = tasks.filter((t) => {
    if (statusFilter === 'pendientes' && t.done) return false
    if (statusFilter === 'completadas' && !t.done) return false
    if (priorityFilter !== 'todas' && t.priority !== priorityFilter) return false
    return true
  })

  const done = tasks.filter((t) => t.done).length
  const total = tasks.length
  const donePct = total ? Math.round((done / total) * 100) : 0
  const urgentes = tasks.filter((t) => !t.done && t.priority === 'alta').length
  const criticalAlerts = alerts.filter((a) => a.type === 'danger').length

  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const alertsThisWeek = alerts.filter((a) => {
    const d = new Date(a.date)
    return d >= weekAgo && d <= today
  }).length

  const sortedSlots = [
    ...tasks.filter((t) => t.priority === 'alta'),
    ...tasks.filter((t) => t.priority === 'media'),
    ...tasks.filter((t) => t.priority === 'baja'),
  ]

  const confirmNewCategory = () => {
    const name = newCategoryName.trim().toLowerCase()
    if (name && !categories.includes(name)) {
      setCategories((prev) => [...prev, name])
      setNewCategory(name)
    }
    setAddingCategory(false)
    setNewCategoryName('')
  }

  const addTask = () => {
    if (!newTitle.trim()) return
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      done: false,
      category: newCategory as Task['category'],
      dueDate: newDueDate || undefined,
    }
    setTasks((prev) => [task, ...prev])
    setNewTitle('')
    setNewDueDate('')
    setNewPriority('media')
    setNewCategory('admin')
    setShowForm(false)
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-ink-3">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="px-10 pt-9 pb-10 max-w-360 mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[32px] font-extrabold text-ink tracking-[-1px] leading-[1.1] mb-2">
            Tareas y alertas
          </h1>
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-ink-3">
              {tasks.filter((t) => !t.done).length} pendientes
            </span>
            <span className="w-1 h-1 rounded-full bg-[rgba(0,0,0,0.15)]" />
            <span className="text-[13px] text-ink-3">{done} completadas</span>
            {criticalAlerts > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-[rgba(0,0,0,0.15)]" />
                <span className="text-[13px] text-red-500">
                  {criticalAlerts} alertas críticas
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip
            title={
              whatsappEnabled
                ? 'Recordatorio activo — haz clic para desactivar'
                : 'Activar recordatorio automático por WhatsApp'
            }
            arrow
            placement="bottom"
            slotProps={{
              tooltip: {
                sx: { bgcolor: '#111827', color: 'rgba(255,255,255,0.8)', fontSize: 11.5 },
              },
              arrow: { sx: { color: '#111827' } },
            }}
          >
            <button
              onClick={() => setWhatsappEnabled((v) => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-[13px] font-medium border transition-all duration-150 cursor-pointer ${
                whatsappEnabled
                  ? 'bg-[rgba(37,211,102,0.1)] text-[#15803d] border-[rgba(37,211,102,0.3)]'
                  : 'bg-white/60 text-ink-3 border-[rgba(0,0,0,0.08)] hover:bg-white hover:text-ink'
              }`}
            >
              <WhatsAppIcon size={14} />
              {whatsappEnabled ? 'Recordatorio activo' : 'Activar recordatorio'}
              {whatsappEnabled ? (
                <Bell size={12} className="opacity-60" />
              ) : (
                <BellOff size={12} className="opacity-40" />
              )}
            </button>
          </Tooltip>

          <button
            onClick={() => setShowForm((v) => !v)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-medium border transition-all duration-150 cursor-pointer ${
              showForm
                ? 'bg-white/60 text-ink-3 border-[rgba(0,0,0,0.08)]'
                : 'bg-ink text-white border-transparent hover:opacity-85'
            }`}
          >
            {showForm ? <X size={13} /> : <Plus size={13} />}
            {showForm ? 'Cancelar' : 'Nueva tarea'}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-zinc-50/80 rounded-[20px] shadow-sm border border-[rgba(0,0,0,0.05)] px-5 py-4">
          <p className="text-[10.5px] font-medium text-ink-3 uppercase tracking-[0.6px] mb-3">
            Alertas esta semana
          </p>
          <div className="flex items-end gap-3">
            <span className="text-[38px] font-extrabold text-ink tracking-[-1.5px] leading-none">
              {alertsThisWeek}
            </span>
            <div className="flex flex-col gap-0.5 pb-1">
              <span className="text-[11px] text-red-500 font-medium">
                {criticalAlerts} críticas
              </span>
              <span className="text-[11px] text-amber-600/80">
                {alerts.filter((a) => a.type === 'warning').length} advertencias
              </span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50/80 rounded-[20px] shadow-sm border border-[rgba(0,0,0,0.05)] px-5 py-4">
          <p className="text-[10.5px] font-medium text-ink-3 uppercase tracking-[0.6px] mb-3">
            Progreso de tareas
          </p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-[38px] font-extrabold text-ink tracking-[-1.5px] leading-none">
              {donePct}%
            </span>
            <span className="text-[12px] text-ink-3 pb-1">
              {done}/{total}
            </span>
          </div>
          <LinearProgress
            variant="determinate"
            value={donePct}
            sx={{
              height: 6,
              borderRadius: 8,
              bgcolor: 'rgba(0,0,0,0.07)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'oklch(82.8% 0.111 230.318)',
                borderRadius: 8,
              },
            }}
          />
        </div>

        <div className="bg-zinc-50/80 rounded-[20px] shadow-sm border border-[rgba(0,0,0,0.05)] px-5 py-4">
          <p className="text-[10.5px] font-medium text-ink-3 uppercase tracking-[0.6px] mb-3">
            Alta prioridad pendiente
          </p>
          <div className="flex items-end gap-3">
            <span
              className={`text-[38px] font-extrabold tracking-[-1.5px] leading-none ${
                urgentes > 0 ? 'text-red-500' : 'text-ink'
              }`}
            >
              {urgentes}
            </span>
            <div className="pb-1">
              <LinearProgress
                variant="determinate"
                value={
                  tasks.filter((t) => t.priority === 'alta').length
                    ? Math.round(
                        (tasks.filter((t) => t.priority === 'alta' && t.done).length /
                          tasks.filter((t) => t.priority === 'alta').length) *
                          100
                      )
                    : 0
                }
                sx={{
                  width: 88,
                  height: 6,
                  borderRadius: 8,
                  bgcolor: 'rgba(0,0,0,0.07)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: urgentes > 0 ? '#ef4444' : '#22c55e',
                    borderRadius: 8,
                  },
                }}
              />
              <span className="text-[10.5px] text-ink-3 mt-1 block">
                {tasks.filter((t) => t.priority === 'alta' && t.done).length}/
                {tasks.filter((t) => t.priority === 'alta').length} resueltas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-zinc-50/80 rounded-[20px] shadow-sm border border-[rgba(0,0,0,0.05)] p-4 mb-5">
          <div className="flex gap-2.5 flex-wrap items-center">
            <input
              autoFocus
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Descripción de la tarea..."
              className="flex-1 min-w-55 bg-white/80 border border-[rgba(0,0,0,0.08)] rounded-[9px] px-3.5 py-2 text-[13px] text-ink placeholder:text-[rgba(0,0,0,0.25)] focus:outline-none focus:border-[rgba(0,0,0,0.18)] transition-colors"
            />

            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
              className="bg-white/80 border border-[rgba(0,0,0,0.08)] rounded-[9px] px-3 py-2 text-[13px] text-ink-3 focus:outline-none focus:border-[rgba(0,0,0,0.18)] transition-colors appearance-none cursor-pointer"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>

            <div className="flex items-center gap-1">
              {addingCategory ? (
                <input
                  ref={newCategoryInputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmNewCategory()
                    if (e.key === 'Escape') {
                      setAddingCategory(false)
                      setNewCategoryName('')
                    }
                  }}
                  onBlur={confirmNewCategory}
                  placeholder="nombre categoría"
                  className="w-36 bg-white border border-[rgba(0,0,0,0.12)] rounded-[9px] px-3 py-2 text-[13px] text-ink placeholder:text-[rgba(0,0,0,0.25)] focus:outline-none transition-colors"
                />
              ) : (
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-white/80 border border-[rgba(0,0,0,0.08)] rounded-[9px] px-3 py-2 text-[13px] text-ink-3 focus:outline-none focus:border-[rgba(0,0,0,0.18)] transition-colors appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              )}
              <Tooltip
                title="Nueva categoría"
                arrow
                placement="top"
                slotProps={{
                  tooltip: { sx: { bgcolor: '#111827', color: 'rgba(255,255,255,0.8)', fontSize: 11 } },
                  arrow: { sx: { color: '#111827' } },
                }}
              >
                <button
                  type="button"
                  onClick={() => setAddingCategory((v) => !v)}
                  className="w-8 h-8 flex items-center justify-center rounded-[9px] bg-white/80 border border-[rgba(0,0,0,0.08)] text-ink-3 hover:text-ink hover:bg-white transition-all cursor-pointer text-[16px] font-light leading-none"
                >
                  +
                </button>
              </Tooltip>
            </div>

            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="bg-white/80 border border-[rgba(0,0,0,0.08)] rounded-[9px] px-3 py-2 text-[13px] text-ink-3 focus:outline-none focus:border-[rgba(0,0,0,0.18)] transition-colors"
            />

            <button
              onClick={addTask}
              disabled={!newTitle.trim()}
              className="px-4 py-2 rounded-[9px] bg-ink text-white text-[13px] font-medium disabled:opacity-30 hover:opacity-85 transition-opacity cursor-pointer disabled:cursor-default"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Body grid */}
      <div className="grid grid-cols-[1fr_340px] gap-4 items-start">

        <div className="bg-ink rounded-[20px] shadow-sm p-5">

          {tasks.length > 0 && (
            <div className="mb-5">
              <div className="flex gap-0.5 mb-2">
                {sortedSlots.map((t) => (
                  <div
                    key={t.id}
                    className={`h-1.5 flex-1 rounded-full transition-opacity duration-300 ${PRIORITY_SLOT[t.priority]} ${
                      t.done ? 'opacity-20' : 'opacity-100'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                {(['alta', 'media', 'baja'] as const).map((p) => {
                  const ptotal = tasks.filter((t) => t.priority === p).length
                  const pdone = tasks.filter((t) => t.priority === p && t.done).length
                  if (!ptotal) return null
                  return (
                    <span key={p} className="text-[11px] text-white/60">
                      <span
                        style={{
                          color:
                            p === 'alta'
                              ? '#f87171'
                              : p === 'media'
                              ? 'oklch(72% 0.111 230.318)'
                              : 'rgba(0,0,0,0.35)',
                        }}
                      >
                        {p}
                      </span>{' '}
                      {pdone}/{ptotal}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex gap-1.5 flex-wrap mb-4">
            {(['todas', 'pendientes', 'completadas'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  statusFilter === f
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {f === 'todas' ? 'Todas' : f === 'pendientes' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
            <div className="w-px bg-white/10 mx-0.5 self-stretch" />
            {(['alta', 'media', 'baja'] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(priorityFilter === p ? 'todas' : p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-150 cursor-pointer ${
                  priorityFilter === p
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[p]}`} />
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-ink-3 text-[13px]">Sin tareas</div>
            )}
            {filtered.map((task, i) => {
              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/5 transition-opacity duration-200 ${
                    task.done ? 'opacity-50' : 'opacity-100'
                  } ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${PRIORITY_DOT[task.priority]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[13px] font-medium text-white leading-[1.35] mb-0.5 ${
                        task.done ? 'line-through' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <p className="text-[11px] text-white/35">{formatDate(task.dueDate)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150 border-[1.5px] cursor-pointer ${
                      task.done
                        ? 'bg-green-500 border-green-500'
                        : 'bg-transparent border-white/20'
                    }`}
                  >
                    {task.done && <Check size={11} color="#fff" strokeWidth={3} />}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-ink rounded-[20px] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-base font-bold text-white tracking-[-0.3px]">Alertas</p>
            {criticalAlerts > 0 && (
              <span className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-full">
                {criticalAlerts} críticas
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {alerts.map((alert) => {
              const Icon = ALERT_ICON[alert.type]
              return (
                <div
                  key={alert.id}
                  className={`flex gap-3 p-3.5 rounded-[13px] border ${ALERT_CARD[alert.type]}`}
                >
                  <Icon
                    size={14}
                    color={ALERT_COLOR[alert.type]}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className={`text-[12.5px] font-medium leading-[1.3] mb-0.5 ${ALERT_TITLE[alert.type]}`}>
                      {alert.title}
                    </p>
                    <p className={`text-[11px] leading-[1.4] mb-1.5 ${ALERT_DESC[alert.type]}`}>
                      {alert.description}
                    </p>
                    <p className="text-[10.5px] text-ink-3">{formatDate(alert.date)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default TasksPage
