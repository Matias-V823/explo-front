import { useRef, useState, useEffect } from 'react'
import { MapPin, User, Phone, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import type { ListingProperty } from '../../types/properties'
import { AVAILABILITY_CONFIG } from '../../utils/property'

interface PropertyCardProps {
  property: ListingProperty
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

function PropertyMenu({ id, onView, onEdit, onDelete }: {
  id: number
  onView: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handle(fn: (id: number) => void) {
    setOpen(false)
    fn(id)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-zinc-200 bg-white/60 text-ink-3 hover:bg-white hover:text-ink transition-colors z-9999"
      >
        <MoreHorizontal size={14} strokeWidth={2} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-20 w-44 bg-white rounded-xl border border-zinc-200 shadow-md py-1 overflow-hidden">
          <button
            onClick={() => handle(onView)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-ink-3 hover:bg-zinc-50 hover:text-ink transition-colors cursor-pointer"
          >
            <Eye size={13} strokeWidth={1.8} />
            Ver propiedad
          </button>
          <button
            onClick={() => handle(onEdit)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-ink-3 hover:bg-zinc-50 hover:text-ink transition-colors cursor-pointer"
          >
            <Pencil size={13} strokeWidth={1.8} />
            Editar propiedad
          </button>
          <div className="mx-2 my-1 border-t border-zinc-100" />
          <button
            onClick={() => handle(onDelete)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 size={13} strokeWidth={1.8} />
            Eliminar propiedad
          </button>
        </div>
      )}
    </div>
  )
}

export default function PropertyCard({ property, onView, onEdit, onDelete }: PropertyCardProps) {
  const badge = AVAILABILITY_CONFIG[property.availability]

  return (
    <div className="bg-white/80 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row overflow-hidden hover:-translate-y-px transition-transform duration-200 md:h-60">
      {/* Image */}
      <div className="h-44 md:h-auto md:w-55 md:min-w-55 bg-zinc-100 relative overflow-hidden shrink-0">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        {property.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
            +{property.images.length - 1} foto
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-5 flex flex-col gap-2.5 md:gap-3 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-ink-3 mb-1">Propiedad</p>
            <h3 className="text-[15px] font-semibold text-ink tracking-[-0.3px] leading-snug truncate">
              {property.name}
            </h3>
            <p className="text-[12px] text-ink-3 truncate uppercase">{property.category}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badge.badgeClass}`}>
              {badge.label}
            </span>
            <PropertyMenu
              id={property.id}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-[12.5px] text-ink-3 leading-[1.55] line-clamp-2">
          {property.description}
        </p>

        {/* UF value */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-bold text-ink tracking-[-0.8px] font-mono">
            {property.valueUF.toLocaleString('es-CL')}
          </span>
          <span className="text-[12px] font-medium text-ink-3">UF</span>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-1 border-t border-zinc-100">
          <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
            <MapPin size={12} strokeWidth={1.8} className="shrink-0" />
            {[property.commune?.name, property.city.name].filter(Boolean).join(', ')}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
            <User size={12} strokeWidth={1.8} className="shrink-0" />
            {property.ownerName}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
            <Phone size={12} strokeWidth={1.8} className="shrink-0" />
            {property.contact}
          </span>
        </div>
      </div>
    </div>
  )
}
