import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Loader2 } from 'lucide-react'
import type { FilterAvailability, ListingProperty, PropertyCategory } from '../types/properties'
import { fetchProperties } from '../api/properties'
import PropertyCard from '../components/properties/PropertyCard'
import Pagination from '../components/properties/Pagination'
import FiltersSection from '../components/properties/PropertyFilters'
import DeletePropertyModal from '../components/properties/DeletePropertyModal'

const PAGE_SIZE = 5

export default function PropertiesPage() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<ListingProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState<FilterAvailability>('todas')
  const [category, setCategory] = useState<PropertyCategory | 'todas'>('todas')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return properties.filter(p => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.name.toLowerCase().includes(q) ||
        (p.commune?.name ?? '').toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchesAvailability = availability === 'todas' || p.availability === availability
      const matchesCategory = category === 'todas' || p.category === category
      return matchesSearch && matchesAvailability && matchesCategory
    })
  }, [properties, search, availability, category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handleAvailability(value: FilterAvailability) {
    setAvailability(value)
    setPage(1)
  }

  function handleCategory(value: PropertyCategory | 'todas') {
    setCategory(value)
    setPage(1)
  }

  const counts = {
    total: properties.length,
    disponibleArriendo: properties.filter(p => p.availability === 'disponible-arriendo').length,
    arrendada: properties.filter(p => p.availability === 'arrendada').length,
    disponibleVenta: properties.filter(p => p.availability === 'disponible-venta').length,
    noDisponible: properties.filter(p => p.availability === 'no-disponible').length,
  }

  return (
    <div className="px-4 md:px-6 xl:px-10 pt-5 md:pt-7 xl:pt-9 pb-6 xl:pb-10 max-w-360 mx-auto w-full">
      <div className="mb-5 md:mb-6">
        <h1 className="text-[24px] md:text-[30px] xl:text-[36px] font-extrabold text-ink tracking-[-1.2px] leading-[1.1] mb-1">
          Propiedades
        </h1>
        <p className="text-[13px] text-ink-3">
          {loading ? 'Cargando…' : `${counts.total} propiedades registradas`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <FiltersSection
          search={search}
          availability={availability}
          category={category}
          counts={counts}
          onSearch={handleSearch}
          onAvailability={handleAvailability}
          onCategory={handleCategory}
        />
        <button
          onClick={() => navigate('/propiedades/nueva')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-ink text-white text-[13px] font-medium rounded-xl hover:bg-ink/85 transition-colors cursor-pointer w-full md:w-auto shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          Agregar propiedad
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} strokeWidth={1.5} className="text-zinc-300 animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 size={32} strokeWidth={1.4} className="text-zinc-300 mb-3" />
          <p className="text-[14px] font-medium text-ink-3">Error al cargar las propiedades</p>
          <p className="text-[12.5px] text-zinc-400 mt-1">Intenta recargar la página.</p>
        </div>
      )}

      {!loading && !error && paginated.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onView={id => navigate(`/propiedades/${id}`)}
                onEdit={id => navigate(`/propiedades/${id}/editar`)}
                onDelete={id => {
                  const p = properties.find(p => p.id === id)
                  if (p) setDeleteTarget({ id: p.id, name: p.name })
                }}
              />
            ))}
          </div>
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={filtered.length}
            pageSize={PAGE_SIZE}
            onPage={setPage}
          />
        </>
      )}

      {!loading && !error && paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 size={32} strokeWidth={1.4} className="text-zinc-300 mb-3" />
          <p className="text-[14px] font-medium text-ink-3">Sin resultados</p>
          <p className="text-[12.5px] text-zinc-400 mt-1">
            Intenta con otro término o cambia el filtro de disponibilidad.
          </p>
        </div>
      )}

      {deleteTarget && (
        <DeletePropertyModal
          propertyId={deleteTarget.id}
          propertyName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setProperties(prev => prev.filter(p => p.id !== deleteTarget.id))
            setDeleteTarget(null)
          }}
        />
      )}
    </div>
  )
}
