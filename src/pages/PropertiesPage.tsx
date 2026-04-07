import { useState, useMemo } from 'react'
import { Building2 } from 'lucide-react'
import type { FilterAvailability } from '../types/properties'
import { MOCK_PROPERTIES } from '../data/mockProperties'
import PropertyCard from '../components/properties/PropertyCard'
import Pagination from '../components/properties/Pagination'
import FiltersSection from '../components/properties/PropertyFilters'

const PAGE_SIZE = 5

export default function PropertiesPage() {
  const [search, setSearch] = useState('')
  const [availability, setAvailability] = useState<FilterAvailability>('todas')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return MOCK_PROPERTIES.filter(p => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchesAvailability = availability === 'todas' || p.availability === availability
      return matchesSearch && matchesAvailability
    })
  }, [search, availability])

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

  const counts = {
    total: MOCK_PROPERTIES.length,
    arrendar: MOCK_PROPERTIES.filter(p => p.availability === 'arrendar').length,
    venta: MOCK_PROPERTIES.filter(p => p.availability === 'venta').length,
    noDisponible: MOCK_PROPERTIES.filter(p => p.availability === 'no-disponible').length,
  }

  return (
    <div className="px-10 pt-9 pb-10 max-w-360 mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-[36px] font-extrabold text-ink tracking-[-1.2px] leading-[1.1] mb-1">
          Propiedades
        </h1>
        <p className="text-[13px] text-ink-3">{counts.total} propiedades registradas</p>
      </div>

      <FiltersSection
        search={search}
        availability={availability}
        counts={counts}
        onSearch={handleSearch}
        onAvailability={handleAvailability}
      />

      {paginated.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {paginated.map(property => (
              <PropertyCard key={property.id} property={property} />
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Building2 size={32} strokeWidth={1.4} className="text-zinc-300 mb-3" />
          <p className="text-[14px] font-medium text-ink-3">Sin resultados</p>
          <p className="text-[12.5px] text-zinc-400 mt-1">
            Intenta con otro término o cambia el filtro de disponibilidad.
          </p>
        </div>
      )}
    </div>
  )
}
