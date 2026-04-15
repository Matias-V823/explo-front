import type { PropertyUtility, UtilityStatus } from '../../types/properties'

const STATUS_CONFIG: Record<UtilityStatus, { label: string; dot: string; text: string }> = {
  'al-dia':    { label: 'Al día',    dot: 'bg-emerald-400', text: 'text-emerald-600' },
  'pendiente': { label: 'Pendiente', dot: 'bg-amber-400',   text: 'text-amber-600' },
  'cortado':   { label: 'Cortado',   dot: 'bg-red-400',     text: 'text-red-600' },
  'no-aplica': { label: 'No aplica', dot: 'bg-zinc-300',    text: 'text-zinc-400' },
}

export default function PropertyUtilities({ utilities }: { utilities: PropertyUtility[] }) {
  if (utilities.length === 0) {
    return <p className="text-[12.5px] text-zinc-400 py-2">Sin servicios registrados</p>
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-100">
      {utilities.map((u) => {
        const s = STATUS_CONFIG[u.status]
        return (
          <div key={u.id} className="flex items-center justify-between py-2.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12.5px] font-medium text-ink">{u.utilityType.name}</span>
              {u.serviceProvider && (
                <span className="text-[11px] text-zinc-400">{u.serviceProvider.name}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {u.billDueDay != null && (
                <span className="text-[10.5px] text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded-md">
                  Día {u.billDueDay}
                </span>
              )}
              {u.customerNumber && (
                <span className="text-[10.5px] text-zinc-400 font-mono bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded-md">
                  {u.customerNumber}
                </span>
              )}
              <div className={`flex items-center gap-1.5 text-[11.5px] font-semibold ${s.text} min-w-16 justify-end`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                {s.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
