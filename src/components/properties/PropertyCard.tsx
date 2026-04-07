import { MapPin, User, Phone } from 'lucide-react'
import type { ListingProperty } from '../../types/properties'
import { AVAILABILITY_CONFIG } from '../../data/mockProperties'

interface PropertyCardProps {
  property: ListingProperty
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const badge = AVAILABILITY_CONFIG[property.availability]

  return (
    <div className="bg-white/80 rounded-2xl border border-white/60 shadow-sm flex overflow-hidden hover:-translate-y-px transition-transform duration-200 h-42">
      {/* Image */}
      <div className="w-55 min-w-55 bg-zinc-100 relative overflow-hidden">
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
      <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-ink-3 mb-1">Propiedad</p>
            <h3 className="text-[15px] font-semibold text-ink tracking-[-0.3px] leading-snug truncate">
              {property.name}
            </h3>
          </div>
          <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badge.badgeClass}`}>
            {badge.label}
          </span>
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
            {property.location}
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
