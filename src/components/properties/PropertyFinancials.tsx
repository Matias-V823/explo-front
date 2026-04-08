import type { PropertyFinancials as FinancialsData, TransferStatus } from '../../types/properties'
import { formatDateFull } from '../../utils/formatters'

const TRANSFER_CONFIG: Record<TransferStatus, { label: string; bg: string; text: string; dot: string }> = {
  pagado: { label: 'Pagado', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  pendiente: { label: 'Pendiente', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  parcial: { label: 'Parcial', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400' },
  atrasado: { label: 'Atrasado', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400 animate-pulse' },
}

const CONCEPT_LABEL: Record<string, string> = {
  arriendo: 'Arriendo mensual', electricidad: 'Electricidad',
  agua: 'Agua', gas: 'Gas', otro: 'Otro',
}

function fmt(n: number) {
  return `$${n.toLocaleString('es-CL')} CLP`
}

export default function PropertyFinancials({ f }: { f: FinancialsData }) {
  const t = TRANSFER_CONFIG[f.transferStatus]

  return (
    <>
      <div className="border-t border-zinc-100 my-5" />

      <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px] mb-4">Gestión de arriendo</h2>

      <div className="flex gap-2.5 mb-4">
        <div className="flex-1 px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-zinc-400 mb-1">Arriendo</p>
          <p className="text-md font-extrabold text-ink tracking-[-0.6px] leading-none">{fmt(f.monthlyRentCLP)}</p>
          <p className="text-[10.5px] text-zinc-400 mt-1">Vence día {f.paymentDueDay} de cada mes</p>
        </div>
        <div className="flex-1 px-3.5 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-zinc-400 mb-1">Administración</p>
          <div className="flex items-baseline gap-2">
            <p className="text-md font-extrabold text-ink tracking-[-0.6px] leading-none">{fmt(f.administrationAmount)}</p>
            <div className="flex-1 border-b border-dashed border-zinc-200" />
            <span className="text-[11px] font-semibold text-zinc-400">({f.administrationPct}%)</span>
          </div>
          <p className="text-[10.5px] text-zinc-400 mt-1">Comisión del corredor</p>
        </div>
      </div>

      <div className={`rounded-xl px-4 py-3 ${t.bg}`}>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-zinc-500">Estado transferencia arrendador</p>
          <span className={`flex items-center gap-1.5 text-[11.5px] font-bold ${t.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
            {t.label}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11.5px] text-zinc-500">
          <span>Próximo pago: <span className="font-medium text-ink">{formatDateFull(f.nextPaymentDate)}</span></span>
          {f.lastPaymentDate && (
            <span>Último pago: <span className="font-medium text-ink">{formatDateFull(f.lastPaymentDate)}</span></span>
          )}
        </div>

        {f.pendingItems && f.pendingItems.length > 0 && (
          <div className="mt-3 pt-3 border-t border-black/5 flex flex-col gap-1.5">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.5px] text-zinc-400 mb-0.5">Pendiente de pago</p>
            {f.pendingItems.map((item) => (
              <div key={item.concept} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  <span className="text-[12px] text-ink-3">{CONCEPT_LABEL[item.concept]}</span>
                </div>
                <span className="text-[12px] font-semibold text-red-600">{fmt(item.amount)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1.5 border-t border-black/5 mt-0.5">
              <span className="text-[11.5px] font-bold text-ink">Total pendiente</span>
              <span className="text-[13px] font-extrabold text-red-600">
                {fmt(f.pendingItems.reduce((s, i) => s + i.amount, 0))}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
