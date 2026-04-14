import { useState } from 'react'
import { Check, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import { IconButton } from '@mui/material'
import type { Task, Alert } from '../../types'
import { useNavigate } from 'react-router-dom'

interface TaskListProps {
  tasks: Task[]
  alerts: Alert[]
}

const priorityDotClass: Record<string, string> = {
  alta: 'bg-danger',
  media: 'bg-gold',
  baja: 'bg-white/25',
}

const alertTypeColor: Record<string, string> = {
  danger: '#E05050',
  warning: '#F2C94C',
  info: '#5B9DD6',
}

export default function TaskList({ tasks: initialTasks, alerts }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [tab, setTab] = useState<'tasks' | 'alerts'>('tasks')
  const navigate = useNavigate()

  const donePct = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
  const safePct = Math.round(
    ((alerts.length - alerts.filter((a) => a.type === 'danger').length) / alerts.length) * 100
  )
  const docTotal = tasks.filter((t) => t.category === 'documento').length
  const docPct = Math.round(
    (tasks.filter((t) => t.category === 'documento' && t.done).length / Math.max(docTotal, 1)) * 100
  )

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const miniProgress = [
    { label: `${donePct}%`, variantClass: 'bg-gold text-ink', title: 'Tareas' },
    { label: `${safePct}%`, variantClass: 'bg-white/75 text-ink', title: '' },
    { label: `${docPct}%`, variantClass: 'bg-white/20 text-white/50', title: '' },
  ]

  return (
    <div className="card-dark p-5 max-h-150 flex flex-col bg-ink rounded-[20px] shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <div className='flex gap-2 justify-center items-center'>
          <p className="text-lg font-bold text-white tracking-[-0.3px]">
            {tab === 'tasks' ? 'Tareas' : 'Alertas'}
          </p>
          <span className="text-lg font-extrabold text-white tracking-[-0.8px]">
            {tab === 'tasks'
              ? `${tasks.filter((t) => t.done).length}/${tasks.length}`
              : `${alerts.filter((a) => a.type === 'danger').length}/${alerts.length}`}
          </span>
        </div>
        <IconButton
          onClick={() => navigate('/tasks')}
          size="small"
          sx={{ width: 28, height: 28, borderRadius: '10px', border: '1px solid rgba(220,220,220,0.30)', cursor: 'pointer' }}
        >
          <ArrowUpRight size={14} color="#6b7280" />
        </IconButton>
      </div>

      {/* Mini progress bars */}
      <div className="flex gap-1.5 mb-3.5">
        {miniProgress.map(({ label, variantClass, title }, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1">
            <span className="text-[10px] text-white/40">{label}</span>
            <div className={`h-5.5 rounded-md flex items-center pl-2 text-[11px] font-semibold ${variantClass}`}>
              {title}
            </div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-3">
        {(['tasks', 'alerts'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
              tab === t ? 'bg-gold text-ink' : 'bg-white/8 text-white/60 hover:bg-white/12'
            }`}
          >
            {t === 'tasks' ? 'Tareas' : 'Alertas'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto min-h-0 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        {tab === 'tasks'
          ? tasks.map((task, i) => (
              <div
                key={task.id}
                className={`flex items-start gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/5 transition-opacity duration-200 ${
                  task.done ? 'opacity-50' : 'opacity-100'
                } ${i < tasks.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${priorityDotClass[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-medium text-white leading-[1.35] mb-0.5 ${task.done ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-[11px] text-white/35">{formatDate(task.dueDate)}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150 border-[1.5px] ${
                    task.done ? 'bg-success border-success' : 'bg-transparent border-white/20'
                  }`}
                >
                  {task.done && <Check size={11} color="#fff" strokeWidth={3} />}
                </button>
              </div>
            ))
          : alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/5">
                <AlertTriangle
                  size={14}
                  color={alertTypeColor[alert.type]}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-white leading-[1.3] mb-0.5">{alert.title}</p>
                  <p className="text-[11px] text-white/35 leading-[1.4]">{alert.description}</p>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
