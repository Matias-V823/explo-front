import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PieChart } from '@mui/x-charts/PieChart'
import { Box, Typography, IconButton } from '@mui/material'
import type { Property } from '../../types'

interface PropertyStatusChartProps {
  properties: Property[]
}

export default function PropertyStatusChart({ properties }: PropertyStatusChartProps) {
  const [active, setActive] = useState<string | null>(null)

  const rentedCount = properties.filter((p) => p.status === 'arrendada').length
  const availableCount = properties.filter((p) => p.status === 'disponible').length
  const maintenanceCount = properties.filter((p) => p.status === 'mantencion').length
  const total = properties.length
  const occupancy = total > 0 ? Math.round((rentedCount / total) * 100) : 0

  const chartData = [
    { id: 'Arrendadas', value: rentedCount, color: '#F59E0B' }, 
    { id: 'Disponibles', value: availableCount, color: '#111827' }, 
    { id: 'Mantención', value: maintenanceCount, color: '#E5E7EB' }, 
  ]

  const legendItems = [
    { label: 'Arrendadas', id: 'Arrendadas', count: rentedCount, dotColor: '#F59E0B' },
    { label: 'Disponibles', id: 'Disponibles', count: availableCount, dotColor: '#111827' },
    { label: 'Mantención', id: 'Mantención', count: maintenanceCount, dotColor: '#E5E7EB' },
  ]

  return (
    <Box className="card p-5 h-full flex flex-col bg-zinc-50 rounded-[20px] shadow-sm">
      {/* Header */}
      <Box className="flex justify-between items-start mb-1">
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="#111827" letterSpacing="-0.3px" lineHeight={1.2}>
            Cartera
          </Typography>
          <Typography variant="caption" color="#6B7280" mt={0.5} display="block">
            estado actual
          </Typography>
        </Box>
        <IconButton size="small" sx={{ width: 28, height: 28, borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)' }}>
          <ArrowUpRight size={14} color="#6b7280" />
        </IconButton>
      </Box>

      {/* Radial arc gauge (MUI x-charts) */}
      <Box className="flex-1 flex items-center justify-center relative min-h-40">
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 54,
              outerRadius: 68,
              paddingAngle: 2,
              cornerRadius: 4,
              faded: { innerRadius: 54, additionalRadius: -4, color: 'gray' }
            },
          ]}
          height={160}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
          highlightedItem={active ? { seriesId: 'default'} : null}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <g transform="translate(160, 160)">
          </g>
        </PieChart>
        
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
           <Typography variant="h5" fontWeight={800} color="#1A1A1A" letterSpacing="-1px" lineHeight={1}>
             {occupancy}%
           </Typography>
           <Typography variant="caption" color="#BBBBBB" fontSize={10} lineHeight={1.2}>
             ocupación
           </Typography>
        </Box>
      </Box>

      {/* Legend */}
      <Box className="flex flex-col gap-1.5 mt-2">
        {legendItems.map(({ label, id, count, dotColor }) => (
          <Box
            key={id}
            component="button"
            onClick={() => setActive(active === id ? null : id)}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              py: 0.5,
              opacity: active && active !== id ? 0.4 : 1,
              transition: 'opacity 150ms',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              p: 0
            }}
          >
            <Box className="flex items-center gap-1.5">
              <Box sx={{ width: 8, height: 8, borderRadius: '2px', backgroundColor: dotColor, border: dotColor === '#E5E7EB' ? '1px solid rgba(0,0,0,0.12)' : 'none' }} />
              <Typography variant="caption" color="#4B5563">
                {label}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={600} color="#111827">
              {count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
