import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEditing = id !== undefined

  return (
    <div className="px-10 pt-9 pb-10 max-w-360 mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/propiedades')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white/70 text-ink-3 hover:bg-white hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2} />
        </button>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-ink-3">
            {isEditing ? `Editando #${id}` : 'Nueva propiedad'}
          </p>
          <h1 className="text-[28px] font-extrabold text-ink tracking-[-1px] leading-[1.1]">
            {isEditing ? 'Editar propiedad' : 'Agregar propiedad'}
          </h1>
        </div>
      </div>

      {/* Placeholder — formulario aquí */}
      <div className="bg-white/80 rounded-2xl border border-white/60 shadow-sm p-8 flex items-center justify-center min-h-64">
        <p className="text-[13px] text-ink-3">Formulario próximamente</p>
      </div>
    </div>
  )
}
