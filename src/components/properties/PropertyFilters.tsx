import { useRef, useState, useEffect } from 'react'
import { Search, X, ChevronDown, Check } from 'lucide-react'
import type { FilterAvailability, PropertyCategory } from '../../types/properties'
import { CATEGORIES } from '../CategoryDropdown'

interface FilterCounts {
  total: number
  arrendar: number
  venta: number
  noDisponible: number
}

interface FiltersSectionProps {
  search: string
  availability: FilterAvailability
  category: PropertyCategory | 'todas'
  counts: FilterCounts
  onSearch: (value: string) => void
  onAvailability: (value: FilterAvailability) => void
  onCategory: (value: PropertyCategory | 'todas') => void
}

const FILTER_TABS: { value: FilterAvailability; label: string; countKey: keyof FilterCounts }[] = [
  { value: 'todas',          label: 'Todas',         countKey: 'total'        },
  { value: 'arrendar',      label: 'Arrendar',      countKey: 'arrendar'     },
  { value: 'venta',         label: 'Venta',         countKey: 'venta'        },
  { value: 'no-disponible', label: 'No disponible', countKey: 'noDisponible' },
]


function CategoryDropdown({
  value,
  onChange,
}: {
  value: PropertyCategory | 'todas'
  onChange: (v: PropertyCategory | 'todas') => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selected = CATEGORIES.find(c => c.value === value)!

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center bg-white/60 border border-zinc-200 rounded-xl p-1">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 px-3 py-1.5 cursor-pointer rounded-lg text-[12.5px] font-medium transition-colors ${
          value !== 'todas'
            ? 'bg-ink text-white'
            : 'text-ink-3 hover:text-ink hover:bg-white/80'
        }`}
      >
        {value !== 'todas' ? selected.label : 'Categoría'}
        {value !== 'todas'
          ? <X size={12} strokeWidth={2.5} onClick={e => { e.stopPropagation(); onChange('todas') }} />
          : <ChevronDown size={13} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        }
      </button>
      </div>

      {open && (
        <div className="absolute left-0 top-10 z-20 w-52 bg-white rounded-xl border border-zinc-200 shadow-md py-1 overflow-y-auto max-h-72">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => { onChange(cat.value); setOpen(false) }}
              className="w-full flex items-center justify-between px-3 py-2 text-[12.5px] text-ink-3 hover:bg-zinc-50 hover:text-ink transition-colors"
            >
              {cat.label}
              {value === cat.value && <Check size={12} strokeWidth={2.5} className="text-ink" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FiltersSection({
  search,
  availability,
  category,
  counts,
  onSearch,
  onAvailability,
  onCategory,
}: FiltersSectionProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
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
              availability === tab.value ? 'bg-white/20 text-white' : 'bg-zinc-100 text-ink-3'
            }`}>
              {counts[tab.countKey]}
            </span>
          </button>
        ))}
      </div>
      <CategoryDropdown value={category} onChange={onCategory} />
    </div>
  )
}
