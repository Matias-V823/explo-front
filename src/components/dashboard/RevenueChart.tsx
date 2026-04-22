import { BarChart } from '@mui/x-charts/BarChart'
import { ArrowUpRight, Banknote } from 'lucide-react'
import { useMemo, useRef, useState, useLayoutEffect } from 'react'
import type { RevenueStats } from '../../types'
import { formatCLPShort } from '../../utils/formatters'

interface RevenueChartProps {
  revenueStats: RevenueStats
}

const WEEK_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

const PAYMENT_DAYS: Record<number, number> = { 5: 0.28, 10: 0.24, 15: 0.26, 20: 0.22 }
const SPILLOVER_DAYS = new Set([4, 6, 9, 11, 14, 16, 19, 21])

const COLOR_PAST   = '#111827'  
const COLOR_TODAY  = 'oklch(82.8% 0.111 230.318)'  
const COLOR_FUTURE = '#e4e4e7'  

function buildWeekData(paidAmount: number) {
  const now      = new Date()
  const year     = now.getFullYear()
  const month    = now.getMonth()
  const todayNum = now.getDate()

  // Índice lunes-base: 0=LUN … 6=DOM
  const todayIdx = (now.getDay() + 6) % 7

  // Fechas de cada día de la semana actual
  const dates = Array.from({ length: 7 }, (_, i) => {
    const offset = i - todayIdx
    return new Date(year, month, todayNum + offset)
  })

  const perPayment = paidAmount / 4  // ~25 % por fecha de cobro

  const amounts = dates.map((date, i) => {
    const d = date.getDate()
    if (i > todayIdx) return 0  // día futuro

    const mainWeight = PAYMENT_DAYS[d]
    if (mainWeight !== undefined) {
      // Día principal de cobro: el peso ya está codificado en el map
      return Math.round(perPayment * (0.85 + (d % 5) / 30))
    }
    if (SPILLOVER_DAYS.has(d)) {
      return Math.round(perPayment * 0.13)
    }
    return 0
  })

  // Placeholder visual para días futuros (barra muy pequeña para que el eje se vea)
  const maxAmt          = Math.max(...amounts, 1)
  const futurePlaceholder = Math.round(maxAmt * 0.07)

  const pastData   = amounts.map((v, i) => (i <  todayIdx ? v                 : null))
  const todayData  = amounts.map((v, i) => (i === todayIdx ? v                : null))
  const futureData = amounts.map((_v, i) => (i >  todayIdx ? futurePlaceholder : null))

  return { pastData, todayData, futureData, todayIdx }
}

export default function RevenueChart({ revenueStats }: RevenueChartProps) {
  const { totalMonthlyRent, paidAmount, adminIncome, collectionRate } = revenueStats

  const { pastData, todayData, futureData } = useMemo(
    () => buildWeekData(paidAmount),
    [paidAmount],
  )

  const fmt = (v: number | null) => (v != null && v > 0 ? formatCLPShort(v) : '—')

  // Medir el contenedor para pasar height exacto al BarChart
  const chartWrapperRef = useRef<HTMLDivElement>(null)
  const [chartHeight, setChartHeight]  = useState(120)
  const [chartWidth,  setChartWidth]   = useState(0)

  useLayoutEffect(() => {
    const el = chartWrapperRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setChartHeight(Math.max(80, entry.contentRect.height))
      setChartWidth(Math.max(1,  entry.contentRect.width))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="p-5 h-full flex flex-col bg-zinc-50/80 rounded-[20px] shadow-sm">

      {/* Cabecera */}
      <div className="flex justify-between items-start mb-1">
        <p className="text-base font-bold text-ink tracking-[-0.3px]">Ingresos</p>
        <button className="w-7 h-7 rounded-[10px] border border-[rgba(0,0,0,0.07)] flex items-center justify-center text-ink-3 cursor-pointer">
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* KPI principal */}
      <div className="flex gap-2 items-end mb-0.5">
        <p className="text-[38px] font-extrabold text-ink leading-none">{formatCLPShort(adminIncome)}</p>
        <p className="text-xs text-ink-3 leading-[1.3] mb-0.5">ingreso<br/>neto</p>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <Banknote size={11} className="text-ink-3 shrink-0" />
        <p className="text-[11px] text-ink-3">
          <span className="font-semibold text-ink">{collectionRate}%</span> cobranza
          <span className="mx-1 text-ink-4">·</span>
          bruto <span className="font-semibold text-ink">{formatCLPShort(totalMonthlyRent)}</span>
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-3 mb-1">
        {[
          { color: COLOR_PAST,   label: 'Cobrado' },
          { color: COLOR_TODAY,  label: 'Hoy' },
          { color: COLOR_FUTURE, label: 'Pendiente' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1 text-[10px] text-ink-3">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>

      <div ref={chartWrapperRef} className="flex-1 w-full min-h-0">
        {chartWidth > 0 && (
          <BarChart
            width={chartWidth}
            height={chartHeight}
            series={[
              { data: pastData,   color: COLOR_PAST,   stack: 'day', valueFormatter: fmt },
              { data: todayData,  color: COLOR_TODAY,  stack: 'day', valueFormatter: fmt },
              { data: futureData, color: COLOR_FUTURE, stack: 'day', valueFormatter: fmt },
            ]}
            xAxis={[{
              data: WEEK_LABELS,
              scaleType: 'band',
              tickLabelStyle: { fontSize: 10, fill: '#71717a', fontFamily: 'inherit', fontWeight: 500 },
              disableLine: true,
              disableTicks: true,
            }]}
            yAxis={[{
              valueFormatter: (v: number | null) => (v ? formatCLPShort(v) : ''),
              tickNumber: 3,
              tickLabelStyle: { fontSize: 9, fill: '#a1a1aa', fontFamily: 'inherit' },
              disableLine: true,
              disableTicks: true,
            }]}
            margin={{ top: 6, right: 4, bottom: 24, left: 4 }}
            borderRadius={5}
            slots={{ legend: () => null }}
            sx={{
              '& .MuiChartsGrid-line': { stroke: '#f0f0f0', strokeDasharray: '3 3' },
            }}
          />
        )}
      </div>
    </div>
  )
}
