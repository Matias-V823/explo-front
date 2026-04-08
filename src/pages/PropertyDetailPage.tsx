import { useParams, useNavigate } from 'react-router-dom'
import { Building2, MapPin, Pencil, Trash, UserRound } from 'lucide-react'
import { MOCK_PROPERTIES, AVAILABILITY_CONFIG } from '../data/mockProperties'
import PropertyImageGallery from '../components/properties/PropertyImageGallery'
import PropertyPersonCard from '../components/properties/PropertyPersonCard'
import PropertyUtilities from '../components/properties/PropertyUtilities'
import PropertyFinancials from '../components/properties/PropertyFinancials'
import PropertyDocumentList from '../components/properties/PropertyDocumentList'
import PropertyDateList from '../components/properties/PropertyDateList'
import PropertyStats from '../components/properties/PropertyStats'

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const property = MOCK_PROPERTIES.find(p => p.id === Number(id))

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <Building2 size={32} strokeWidth={1.4} className="text-zinc-300" />
        <p className="text-[14px] font-medium text-ink-3">Propiedad no encontrada</p>
        <button onClick={() => navigate('/propiedades')} className="text-[13px] text-sky hover:underline">
          Volver al listado
        </button>
      </div>
    )
  }

  const badge = AVAILABILITY_CONFIG[property.availability]

  return (
    <div className="flex items-start gap-6 px-7 pt-6 pb-10">

      {/* ── Left column ── */}
      <div className="flex flex-col w-[44%] shrink-0 gap-4">
        <PropertyImageGallery
          images={property.images}
          name={property.name}
          valueUF={property.valueUF}
          badgeLabel={badge.label}
          badgeClass={badge.badgeClass}
          onBack={() => navigate('/propiedades')}
        />

        {/* Personas involucradas */}
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.6px] text-zinc-400 mb-2.5">
            Personas involucradas
          </p>
          <div className="flex gap-2.5">
            <PropertyPersonCard personId={property.ownerId} role="owner" roleLabel="Propietario" />
            {property.tenantId ? (
              <PropertyPersonCard personId={property.tenantId} role="tenant" roleLabel="Arrendatario" />
            ) : (
              <div className="flex-1 rounded-2xl border border-dashed border-zinc-200 bg-white flex flex-col items-center justify-center gap-1.5 min-h-25">
                <UserRound size={16} strokeWidth={1.4} className="text-zinc-300" />
                <p className="text-[11px] text-zinc-400">Sin arrendatario</p>
              </div>
            )}
          </div>
        </div>

        <PropertyDateList dates={property.importantDates} />
      </div>

      {/* ── Right column ── */}
      <div className="flex-1 flex flex-col mt-[14%]">

        {/* Header — outside the card */}
        <div className="flex items-start justify-between mb-4 px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.7px] text-zinc-400 mb-1.5">
              {property.category} · {property.location}
            </p>
            <h1 className="text-[30px] font-extrabold text-ink tracking-[-1.2px] leading-[1.1]">
              {property.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[13px] text-zinc-400 mt-1.5">
              <MapPin size={13} strokeWidth={1.8} />
              {property.location}
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => navigate(`/propiedades/${property.id}/editar`)}
              className="flex items-center gap-2 px-2 py-2 bg-ink text-white text-[10px] font-semibold rounded-full hover:bg-ink/85 transition-colors cursor-pointer shrink-0 mt-1"
            >
              <Pencil size={12} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => navigate(`/propiedades/${property.id}/eliminar`)}
              className="flex items-center gap-2 px-2 py-2 bg-red-600/90 text-white text-[10px] font-semibold rounded-full hover:bg-red-700 transition-colors cursor-pointer shrink-0 mt-1"
            >
              <Trash size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Detail card */}
        <div className="bg-white rounded-3xl shadow-sm overflow-y-auto max-h-[150vh] px-7 py-6
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-zinc-200
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <p className="text-[13.5px] text-zinc-500 leading-[1.7] mb-5">{property.description}</p>

          <PropertyStats program={property.program} />

          <div className="border-t border-zinc-100 my-5" />

          <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px] mb-3">Servicios básicos</h2>
          <PropertyUtilities utilities={property.utilities} />

          {property.financials && <PropertyFinancials f={property.financials} />}

          <PropertyDocumentList documents={property.documents} />
        </div>

      </div>
    </div>
  )
}
