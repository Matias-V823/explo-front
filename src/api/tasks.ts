import { apiFetch } from './client'
import type { Task } from '../types'

interface BackendTask {
  id: number
  description: string
  category: string
  importance: string
  done: boolean
  dueDate: string | null
}

function toTask(t: BackendTask): Task {
  return {
    id: String(t.id),
    title: t.description,
    priority: t.importance as Task['priority'],
    done: t.done,
    category: t.category as Task['category'],
    dueDate: t.dueDate ?? undefined,
  }
}

export interface CreateTaskPayload {
  description: string
  category: string
  importance: 'alta' | 'media' | 'baja'
  done?: boolean
  dueDate?: string
  userId: number
}

export async function fetchTasks(userId: number): Promise<Task[]> {
  const res = await apiFetch(`/task?userId=${userId}`)
  if (!res.ok) throw new Error('No se pudo obtener las tareas')
  const data: BackendTask[] = await res.json()
  return data.map(toTask)
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await apiFetch('/task', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message ?? 'Error al crear la tarea')
  }
  return toTask(await res.json() as BackendTask)
}

export async function updateTask(id: string, payload: Partial<Omit<CreateTaskPayload, 'userId'>>): Promise<Task> {
  const res = await apiFetch(`/task/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string }
    throw new Error(err.message ?? 'Error al actualizar la tarea')
  }
  return toTask(await res.json() as BackendTask)
}

export async function deleteTask(id: string): Promise<void> {
  const res = await apiFetch(`/task/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar la tarea')
}
