import { useEffect, useState } from 'react'
import { Check, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { formatDate } from '../../utils/formatters'
import { IconButton } from '@mui/material'
import type { Alert } from '../../types'
import { useNavigate } from 'react-router-dom'
import { useTaskStore } from '../../store/taskStore'
import { useDashboardData } from '../../store/dashboardStore'

interface TaskListProps {
  alerts: Alert[]
}

const PRIORITY_SLOT: Record<string, string> = {
  alta: 'bg-red-400',
  media: 'bg-gold',
  baja: 'bg-[rgba(225,225,225,0.60)]',
}

const alertTypeColor: Record<string, string> = {
  danger: '#E05050',
  warning: '#F2C94C',
  info: '#5B9DD6',
}

export default function TaskList({ alerts }: TaskListProps) {
  const allTasks = useTaskStore((state) => state.tasks)
  const today = new Date().toISOString().slice(0, 10)
  const tasks = allTasks.filter((t) => t.dueDate?.slice(0, 10) === today)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const { userId } = useDashboardData()
  const [tab, setTab] = useState<'tasks' | 'alerts'>('tasks')
  const loadTasks = useTaskStore((state) => state.loadTasks)
  const navigate = useNavigate()

  const donePct = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
  const safePct = Math.round(
    ((alerts.length - alerts.filter((a) => a.type === 'danger').length) / alerts.length) * 100
  )
  const docTotal = tasks.filter((t) => t.category === 'documento').length
  const docPct = Math.round(
    (tasks.filter((t) => t.category === 'documento' && t.done).length / Math.max(docTotal, 1)) * 100
  )

  const handleToggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task) toggleTask(id, !task.done)
  }

  const miniProgress = [
    { label: `${donePct}%`, variantClass: 'bg-gold text-ink', title: 'Tareas' },
    { label: `${safePct}%`, variantClass: 'bg-white/75 text-ink', title: '' },
    { label: `${docPct}%`, variantClass: 'bg-white/20 text-white/50', title: '' },
  ]


  useEffect(() => {
    if (userId) loadTasks(userId)
  }, [userId])

  return (
    <div className="card-dark p-5 h-full flex flex-col bg-ink rounded-[20px] shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <div className='flex gap-2 justify-center items-center'>
          <p className="text-lg font-bold text-white tracking-[-0.3px]">
            {tab === 'tasks' ? 'Tareas de Hoy' : 'Alertas'}
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
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${tab === t ? 'bg-gold text-ink' : 'bg-white/8 text-white/60 hover:bg-white/12'
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
              className={`flex items-start gap-2.5 px-3 py-2.5 rounded-[14px] bg-white/5 transition-opacity duration-200 ${task.done ? 'opacity-50' : 'opacity-100'
                } ${i < tasks.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${PRIORITY_SLOT[task.priority]}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13px] font-medium text-white leading-[1.35] mb-0.5 ${task.done ? 'line-through' : ''}`}>
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-[11px] text-white/35">{formatDate(task.dueDate)}</p>
                )}
              </div>
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`w-5 h-5 rounded-md flex items-center cursor-pointer justify-center shrink-0 transition-all duration-150 border-[1.5px] ${task.done ? 'bg-success border-success' : 'bg-transparent border-white/20'
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
