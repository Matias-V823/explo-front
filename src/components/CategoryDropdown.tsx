import { useEffect, useRef, useState } from "react"
import type { PropertyCategory } from "../types/properties"
import { CATEGORIES } from "../constants/categories"
import { Check, ChevronDown, X } from "lucide-react"

export function CategoryDropdown({
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
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2 px-3 py-1.75 text-[12.5px] font-medium rounded-xl border transition-colors ${value !== 'todas'
                        ? 'bg-ink text-white border-ink'
                        : 'bg-white/60 border-zinc-200 text-ink-3 hover:text-ink hover:bg-white'
                    }`}
            >
                {value !== 'todas' ? selected.label : 'Categoría'}
                {value !== 'todas'
                    ? <X size={12} strokeWidth={2.5} onClick={e => { e.stopPropagation(); onChange('todas') }} />
                    : <ChevronDown size={13} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                }
            </button>

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