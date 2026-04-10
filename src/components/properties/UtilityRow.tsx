import type { UtilityStatus } from '../../types/properties'
import { UTILITY_OPTIONS } from '../../constants/propertyForm'

export default function UtilityRow({ label, status, bill, onStatus, onBill }: {
  label: string
  status: UtilityStatus
  bill: string
  onStatus: (v: UtilityStatus) => void
  onBill: (v: string) => void
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-24 shrink-0 pt-2.5">
        <span className="text-[12px] font-medium text-ink">{label}</span>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-1">
          {UTILITY_OPTIONS.map(opt => (
            <button key={opt.value} type="button" onClick={() => onStatus(opt.value)}
              className={`flex-1 h-8 rounded-lg text-[11px] font-medium transition-colors ${
                status === opt.value
                  ? 'bg-ink text-white'
                  : 'bg-zinc-50 border border-zinc-200 text-zinc-500 hover:bg-zinc-100'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
        {status !== 'no-aplica' && (
          <input value={bill} onChange={e => onBill(e.target.value)}
            placeholder={`N° boleta ${label.toLowerCase()}`}
            className="w-full h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
        )}
      </div>
    </div>
  )
}
