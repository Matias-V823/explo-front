import { create } from 'zustand'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  type CreateTaskPayload,
} from '../api/tasks'
import type { Task } from '../types'

interface TaskState {
  tasks: Task[]
  loading: boolean
  loadTasks: (userId: number) => Promise<void>
  addTask: (payload: CreateTaskPayload) => Promise<void>
  toggleTask: (id: string, done: boolean) => Promise<void>
  removeTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,

  loadTasks: async (userId) => {
    set({ loading: true })
    try {
      const tasks = await fetchTasks(userId)
      set({ tasks })
    } finally {
      set({ loading: false })
    }
  },

  addTask: async (payload) => {
    const task = await createTask(payload)
    set((state) => ({ tasks: [task, ...state.tasks] }))
  },

  toggleTask: async (id, done) => {
    const updated = await updateTask(id, { done })
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }))
  },

  removeTask: async (id) => {
    await deleteTask(id)
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
  },
}))
