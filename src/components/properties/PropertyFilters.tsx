import { Search, X } from 'lucide-react'
import type { FilterAvailability } from '../../types/properties'

interface FilterCounts {
  total: number
  arrendar: number
  venta: number
  noDisponible: number
}

interface FiltersSectionProps {
  search: string
  availability: FilterAvailability
  counts: FilterCounts
  onSearch: (value: string) => void
  onAvailability: (value: FilterAvailability) => void
}

const FILTER_TABS: { value: FilterAvailability; label: string; countKey: keyof FilterCounts }[] = [
  { value: 'todas',         label: 'Todas',         countKey: 'total'        },
  { value: 'arrendar',     label: 'Arrendar',      countKey: 'arrendar'     },
  { value: 'venta',        label: 'Venta',         countKey: 'venta'        },
  { value: 'no-disponible', label: 'No disponible', countKey: 'noDisponible' },
]

export default function FiltersSection({
  search,
  availability,
  counts,
  onSearch,
  onAvailability,
}: FiltersSectionProps) {
  return (
    <div className="flex items-center gap-3 mb-5 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-55 max-w-55">
        <Search
          size={14}
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Buscar por nombre, ubicación, propietario…"
          className="w-full pl-8 pr-8 py-2 text-[13px] text-ink placeholder:text-ink-3/60 bg-white/70 border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 focus:bg-white transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink transition-colors"
          >
            <X size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Availability tabs */}
      <div className="flex items-center gap-1 bg-white/60 border border-zinc-200 rounded-xl p-1">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onAvailability(tab.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg text-[12.5px] font-medium transition-colors ${
              availability === tab.value
                ? 'bg-ink text-white'
                : 'text-ink-3 hover:text-ink hover:bg-white/80'
            }`}
          >
            {tab.label}
            <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
              availability === tab.value
                ? 'bg-white/20 text-white'
                : 'bg-zinc-100 text-ink-3'
            }`}>
              {counts[tab.countKey]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
