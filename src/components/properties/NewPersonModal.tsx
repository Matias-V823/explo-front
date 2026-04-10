import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2 } from 'lucide-react'
import { apiFetch } from '../../api/client'

interface CreatedPerson {
  id: number
  name: string
  paternalLastName: string
  maternalLastName: string
  email: string
  phone: string
  role: { id: number; name: string }
}

interface Role {
  id: number
  name: string
}

interface Props {
  onClose: () => void
  onCreated: (person: CreatedPerson) => void
}

const inputCls = 'w-full h-7 px-2.5 rounded-md bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[11.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors'
const labelCls = 'block text-[9px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1'

export default function NewPersonModal({ onClose, onCreated }: Props) {
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [form, setForm] = useState({
    name: '', paternalLastName: '', maternalLastName: '',
    email: '', phone: '', roleName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/roles')
      .then(r => r.json())
      .then((data: Role[]) => {
        setRoles(data)
        if (data.length > 0) setForm(prev => ({ ...prev, roleName: data[0].name }))
      })
      .catch(() => setError('No se pudieron cargar los roles'))
      .finally(() => setRolesLoading(false))
  }, [])

  function set(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch('/persons', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { message?: string }
        throw new Error(err.message ?? 'Error al crear la persona')
      }
      const person = await res.json() as CreatedPerson
      onCreated(person)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px]">Nueva persona</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">Ingresa los datos de contacto</p>
          </div>
          <button onClick={onClose} type="button"
            className="w-8 h-8 flex items-center justify-center cursor-pointer  text-zinc-400 hover:text-ink transition-colors">
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Nombres */}
          <div>
            <label className={labelCls}>Nombre</label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Nombre" required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Apellido paterno</label>
              <input value={form.paternalLastName} onChange={e => set('paternalLastName', e.target.value)}
                placeholder="Apellido" required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Apellido materno</label>
              <input value={form.maternalLastName} onChange={e => set('maternalLastName', e.target.value)}
                placeholder="Apellido" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Correo electrónico</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="correo@ejemplo.cl" required className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Teléfono</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="+56 9 1234 5678" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Rol</label>
              <select value={form.roleName} onChange={e => set('roleName', e.target.value)}
                disabled={rolesLoading}
                className="w-full h-7 px-2.5 rounded-md bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[11.5px] focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors appearance-none disabled:opacity-50">
                {rolesLoading
                  ? <option>Cargando…</option>
                  : roles.map(r => (
                    <option key={r.id} value={r.name}>
                      {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          {error && (
            <p className="text-[12.5px] text-red-500 px-1">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-8 rounded-lg border border-zinc-200 text-[11.5px] font-medium text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-8 rounded-lg bg-ink text-white text-[11.5px] font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {loading ? 'Guardando…' : 'Crear persona'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
