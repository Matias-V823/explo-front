import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { PropertyUtility, UtilityStatus } from '../../types/properties'
import { fetchBillStatus } from '../../api/properties'

const STATUS_CONFIG: Record<UtilityStatus, { label: string; dot: string; text: string }> = {
  'al-dia':    { label: 'Al día',    dot: 'bg-emerald-400', text: 'text-emerald-600' },
  'pendiente': { label: 'Pendiente', dot: 'bg-amber-400',   text: 'text-amber-600' },
  'cortado':   { label: 'Cortado',   dot: 'bg-red-400',     text: 'text-red-600' },
  'no-aplica': { label: 'No aplica', dot: 'bg-zinc-300',    text: 'text-zinc-400' },
}

const LABEL_MAP: Record<string, string> = {
  empresa:        'Empresa',
  nombre_cliente: 'Cliente',
  boleta:         'N° Boleta',
  direccion:      'Dirección',
  deuda:          'Deuda',
  saldoanterior:  'Saldo anterior',
  estado:         'Estado',
  regulado:       'Regulado',
  observacion:    'Observación',
  item:           'Último cobro',
}

const SKIP_KEYS = new Set(['CodError', 'MsgError'])

function parseIfJson(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, unknown>
    return null
  } catch {
    return null
  }
}

function formatValue(key: string, value: unknown): React.ReactNode {
  const nested = parseIfJson(value)
  if (nested) {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.entries(nested).map(([k, v]) => (
          <div key={k} className="bg-zinc-50 border border-zinc-100 rounded-lg px-2.5 py-1.5 text-center">
            <p className="text-[10px] text-zinc-400">{k}</p>
            <p className="text-[12px] font-semibold text-ink">
              {typeof v === 'number' ? `$${v.toLocaleString('es-CL')}` : String(v)}
            </p>
          </div>
        ))}
      </div>
    )
  }

  if (key === 'deuda') {
    const amount = Number(value)
    return (
      <span className={`text-[12.5px] font-semibold ${amount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
        {amount > 0 ? `$${amount.toLocaleString('es-CL')}` : 'Sin deuda'}
      </span>
    )
  }

  return <span className="text-[12.5px] text-ink font-medium">{String(value)}</span>
}

function BillCard({ data }: { data: Record<string, unknown> }) {
  const empresa = data.empresa as string | undefined
  const observacion = data.observacion as string | undefined
  const deuda = Number(data.deuda ?? 0)
  const codError = data.CodError ?? data.codError
  const isOk = codError === '0' || codError === 0 || codError === undefined
  const hasDebt = deuda > 0

  const visibleEntries = Object.entries(data).filter(
    ([k]) => !SKIP_KEYS.has(k) && k !== 'empresa' && k !== 'observacion'
  )

  return (
    <div className="mt-2.5 border border-zinc-100 rounded-xl overflow-hidden text-[12.5px]">
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100">
        <span className="font-semibold text-ink">{empresa ?? 'Proveedor'}</span>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
          !isOk
            ? 'bg-red-100 text-red-600'
            : hasDebt
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
        }`}>
          {!isOk ? 'Error' : hasDebt ? 'Con deuda' : 'Al día'}
        </span>
      </div>

      {observacion && (
        <div className={`px-3.5 py-2 text-[11.5px] ${hasDebt ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {observacion}
        </div>
      )}

      <div className="divide-y divide-zinc-100">
        {visibleEntries.map(([key, value]) => (
          <div key={key} className="flex items-start gap-3 px-3.5 py-2">
            <span className="text-zinc-400 w-24 shrink-0 pt-0.5">
              {LABEL_MAP[key] ?? key}
            </span>
            <div className="flex-1 min-w-0">
              {formatValue(key, value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type BillState =
  | { status: 'loading' }
  | { status: 'success'; data: Record<string, unknown> }
  | { status: 'error'; message: string }

function deriveBillSummary(data: Record<string, unknown>): { billNumber: string | null; hasDebt: boolean; isOk: boolean } {
  const codError = data.CodError ?? data.codError
  const isOk = codError === '0' || codError === 0 || codError === undefined
  const hasDebt = isOk && Number(data.deuda ?? 0) > 0
  const billNumber = data.boleta != null ? String(data.boleta) : null
  return { billNumber, hasDebt, isOk }
}

function UtilityRowWithBill({ utility }: { utility: PropertyUtility }) {
  const [bill, setBill] = useState<BillState>({ status: 'loading' })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetchBillStatus(utility.id)
      .then(data => setBill({ status: 'success', data }))
      .catch(err => setBill({ status: 'error', message: (err as Error).message }))
  }, [utility.id])

  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12.5px] font-medium text-ink">{utility.utilityType.name}</span>
          {utility.serviceProvider && (
            <span className="text-[11px] text-zinc-400">{utility.serviceProvider.name}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {bill.status === 'loading' && (
            <Loader2 size={12} className="animate-spin text-zinc-300" />
          )}

          {bill.status === 'error' && (
            <span className="text-[11px] text-red-400">Sin datos</span>
          )}

          {bill.status === 'success' && (() => {
            const { billNumber, hasDebt, isOk } = deriveBillSummary(bill.data)
            return (
              <>
                {billNumber && (
                  <span className="text-[10.5px] font-mono text-zinc-400 bg-zinc-50 border border-zinc-100 px-1.5 py-0.5 rounded-md">
                    {billNumber}
                  </span>
                )}
                <span className={`flex items-center gap-1 text-[11.5px] font-semibold ${
                  !isOk ? 'text-red-500' : hasDebt ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    !isOk ? 'bg-red-400' : hasDebt ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  {!isOk ? 'Error' : hasDebt ? 'Con deuda' : 'Al día'}
                </span>
              </>
            )
          })()}
        </div>
      </div>

      {bill.status === 'success' && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1.5 text-[11px] font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors"
          >
            {expanded ? 'Ocultar' : 'Ver más'}
          </button>
          {expanded && <BillCard data={bill.data} />}
        </>
      )}

      {bill.status === 'error' && (
        <p className="mt-1 text-[11px] text-red-400">{bill.message}</p>
      )}
    </div>
  )
}

export default function PropertyUtilities({ utilities }: { utilities: PropertyUtility[] }) {
  if (utilities.length === 0) {
    return <p className="text-[12.5px] text-zinc-400 py-2">Sin servicios registrados</p>
  }

  return (
    <div className="flex flex-col divide-y divide-zinc-100">
      {utilities.map((u) => {
        if (u.serviceProvider?.billQueryUrl) {
          return <UtilityRowWithBill key={u.id} utility={u} />
        }

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
