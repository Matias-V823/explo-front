import { BedDouble, Bath, Car, Maximize2, Ruler } from 'lucide-react'
import type { PropertyProgram } from '../../types/properties'

export default function PropertyStats({ program }: { program: PropertyProgram }) {
  const stats: { icon: React.ElementType; value: string | number; label: string }[] = []

  if (program.bedrooms != null) stats.push({ icon: BedDouble, value: program.bedrooms, label: 'dorm.' })
  if (program.bathrooms != null) stats.push({ icon: Bath, value: program.bathrooms, label: 'baños' })
  if (program.parkings != null) stats.push({ icon: Car, value: program.parkings, label: 'estac.' })
  if (program.construction != null) stats.push({ icon: Ruler, value: program.construction.toLocaleString('es-CL'), label: 'm² const.' })
  if (program.terrain != null) stats.push({ icon: Maximize2, value: program.terrain.toLocaleString('es-CL'), label: 'm² terreno' })

  if (stats.length === 0) return null

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {stats.map((s, i) => (
        <div key={i} className="flex items-baseline gap-1.5">
          <span className="text-[26px] font-bold text-ink tracking-[-1px] leading-none">{s.value}</span>
          <span className="text-[12px] text-ink-3 font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
