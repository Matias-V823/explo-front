import { Zap, Droplets, Flame } from 'lucide-react'
import type { PropertyUtilities as UtilitiesData, UtilityStatus } from '../../types/properties'

const STATUS_CONFIG: Record<UtilityStatus, { label: string; dot: string; text: string }> = {
  'al-dia': { label: 'Al día', dot: 'bg-emerald-400', text: 'text-emerald-600' },
  'pendiente': { label: 'Pendiente', dot: 'bg-amber-400', text: 'text-amber-600' },
  'cortado': { label: 'Cortado', dot: 'bg-red-400', text: 'text-red-600' },
  'no-aplica': { label: 'No aplica', dot: 'bg-zinc-300', text: 'text-zinc-400' },
}

interface RowProps {
  icon: React.ElementType
  label: string
  status: UtilityStatus
  billNumber?: string
}

function UtilityRow({ icon: Icon, label, status, billNumber }: RowProps) {
  const s = STATUS_CONFIG[status]
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-[12.5px] text-ink-3">
        <Icon size={13} strokeWidth={1.8} /> {label}
      </div>
      <div className="flex items-center gap-3">
        {billNumber && (
          <span className="text-[10.5px] text-zinc-400 font-mono bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded-md">
            {billNumber}
          </span>
        )}
        <div className={`flex items-center gap-1.5 text-[11.5px] font-semibold ${s.text} min-w-16 justify-end`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
          {s.label}
        </div>
      </div>
    </div>
  )
}

export default function PropertyUtilities({ utilities }: { utilities: UtilitiesData }) {
  return (
    <div className="flex flex-col divide-y divide-zinc-100">
      <UtilityRow icon={Zap} label="Electricidad" status={utilities.electricity} billNumber={utilities.electricityBill} />
      <UtilityRow icon={Droplets} label="Agua" status={utilities.water} billNumber={utilities.waterBill} />
      <UtilityRow icon={Flame} label="Gas" status={utilities.gas} billNumber={utilities.gasBill} />
    </div>
  )
}
