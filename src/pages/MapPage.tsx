import { Ion, Cartesian3, VerticalOrigin, Color, LabelStyle, Cartesian2 } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Viewer, Entity } from 'resium'
import { useEffect, useState } from 'react'
import { fetchProperties } from '../api/properties'
import type { ListingProperty } from '../types/properties'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN ?? ''

const AVAILABILITY_COLOR: Record<string, string> = {
  arrendar: '#3b82f6',
  venta: '#f59e0b',
  'no-disponible': '#9ca3af',
}

function createHousePin(hex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
    <path d="M20 50 C20 50 3 31 3 18 A17 17 0 1 1 37 18 C37 31 20 50 20 50Z"
      fill="${hex}" stroke="white" stroke-width="1.5"/>
    <polygon points="20,8 9,18 31,18" fill="white" opacity="0.95"/>
    <rect x="11" y="18" width="18" height="13" fill="white" opacity="0.95"/>
    <rect x="16" y="23" width="8" height="8" fill="${hex}"/>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

interface GeoProperty extends ListingProperty {
  lat: number
  lng: number
}

async function geocode(p: ListingProperty): Promise<{ lat: number; lng: number } | null> {
  const q = [p.address, p.commune?.name, p.city.name, p.region.name, p.country.name]
    .filter(Boolean).join(', ')
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'explo-front/1.0' } }
    )
    const data = await res.json()
    if (data[0]) return { lat: +data[0].lat, lng: +data[0].lon }
  } catch {  }
  return null
}

const AVAILABILITY_LABEL: Record<string, string> = {
  arrendar: 'Arrendar',
  venta: 'En venta',
  'no-disponible': 'No disponible',
}

export default function MapaPage() {
  const [geoProps, setGeoProps] = useState<GeoProperty[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const props = await fetchProperties()
      for (const p of props) {
        if (cancelled) return
        const coords = await geocode(p)
        if (coords) setGeoProps(prev => [...prev, { ...p, ...coords }])
        await new Promise(r => setTimeout(r, 1100))
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="p-6">
      <div className="rounded-xl overflow-hidden shadow-lg" style={{ height: '80vh' }}>
        <Viewer
          style={{ width: '100%', height: '100%' }}
          timeline={false}
          animation={false}
          fullscreenButton={false}
        >
          {geoProps.map(p => {
            const color = AVAILABILITY_COLOR[p.availability] ?? '#6366f1'
            return (
              <Entity
                key={p.id}
                name={p.name}
                position={Cartesian3.fromDegrees(p.lng, p.lat)}
                description={`
                  <div style="font-family: system-ui, -apple-system, sans-serif; padding: 8px 4px; font-size: 13px; line-height: 1.5; color: #3f3f46; min-width: 220px;">
                    <div style="font-weight: 600; font-size: 15px; color: #18181b; margin-bottom: 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">
                      ${p.name}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #71717a;">Categoría:</span>
                        <span style="font-weight: 500;">${p.category}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; gap: 16px;">
                        <span style="color: #71717a;">Dirección:</span>
                        <span style="font-weight: 500; text-align: right;">${p.address}, ${p.commune?.name ?? p.city.name}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between;">
                        <span style="color: #71717a;">Estado:</span>
                        <span style="font-weight: 600; color: ${color};">${AVAILABILITY_LABEL[p.availability] ?? p.availability}</span>
                      </div>
                      ${p.financials ? `
                      <div style="display: flex; justify-content: space-between; margin-top: 4px; padding-top: 10px; border-top: 1px dashed #e4e4e7;">
                        <span style="color: #18181b; font-weight: 500;">Arriendo:</span>
                        <span style="font-weight: 600; color: #10b981;">$${p.financials.monthlyRentCLP.toLocaleString('es-CL')} CLP</span>
                      </div>` : ''}
                    </div>
                  </div>
                `}
                billboard={{
                  image: createHousePin(color),
                  verticalOrigin: VerticalOrigin.BOTTOM,
                  width: 40,
                  height: 52,
                  pixelOffset: new Cartesian2(0, 0),
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
                }}
              />
            )
          })}
        </Viewer>
      </div>
    </div>
  )
}
