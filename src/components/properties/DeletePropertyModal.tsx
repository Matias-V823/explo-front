import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Loader2, Trash2 } from 'lucide-react'
import { deleteProperty } from '../../api/properties'

interface Props {
  propertyId: number
  propertyName: string
  onClose: () => void
  onDeleted: () => void
}

export default function DeletePropertyModal({ propertyId, propertyName, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      await deleteProperty(propertyId)
      onDeleted()
    } catch (err) {
      setError((err as Error).message)
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
            <Trash2 size={18} strokeWidth={1.8} className="text-red-500" />
          </div>

          <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px] mb-1">
            Eliminar propiedad
          </h2>
          <p className="text-[12.5px] text-zinc-500 leading-[1.55]">
            ¿Estás seguro de que deseas eliminar{' '}
            <span className="font-semibold text-ink">"{propertyName}"</span>?
            Esta acción no se puede deshacer.
          </p>

          {error && (
            <p className="mt-3 text-[11.5px] text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-9 rounded-xl border border-zinc-200 text-[12.5px] font-medium text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 h-9 rounded-xl bg-red-600 text-white text-[12.5px] font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={13} strokeWidth={2} className="animate-spin" />}
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
