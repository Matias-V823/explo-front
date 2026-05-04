import {
  Ion, Cartesian3, VerticalOrigin, Cartesian2,
  ScreenSpaceEventHandler, ScreenSpaceEventType,
  defined, Color,
} from 'cesium'
import type { Viewer as CesiumViewer } from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { Viewer, Entity } from 'resium'
import type { CesiumComponentRef } from 'resium'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProperties } from '../api/properties'
import type { ListingProperty, Availability } from '../types/properties'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN ?? ''

const AVAILABILITY_COLOR: Record<string, string> = {
  'disponible-arriendo': '#3b82f6',
  'arrendada':           '#10b981',
  'disponible-venta':    '#f59e0b',
  'no-disponible':       '#9ca3af',
}

const AVAILABILITY_LABEL: Record<string, string> = {
  'disponible-arriendo': 'Disponible arriendo',
  'arrendada':           'Arrendada',
  'disponible-venta':    'Disponible venta',
  'no-disponible':       'No disponible',
}

type FilterType = Availability | 'todas'

const FILTERS: FilterType[] = [
  'todas', 'disponible-arriendo', 'disponible-venta', 'arrendada', 'no-disponible',
]

const FILTER_LABELS: Record<FilterType, string> = {
  'todas':               'Todas',
  'disponible-arriendo': 'Arriendo',
  'disponible-venta':    'Venta',
  'arrendada':           'Arrendada',
  'no-disponible':       'No disponible',
}

const FILTER_COLORS: Record<FilterType, string> = {
  'todas':               '#6366f1',
  ...AVAILABILITY_COLOR as Record<Availability, string>,
}

const ACTIVE_TINT   = Color.WHITE
const INACTIVE_TINT = new Color(1, 1, 1, 0.2)

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

interface HoveredCard {
  prop: GeoProperty
  x: number
  y: number
}

async function geocode(p: ListingProperty): Promise<{ lat: number; lng: number } | null> {
  const q = [p.address, p.commune?.name, p.city.name, p.region.name, p.country.name]
    .filter(Boolean).join(', ')
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { 'User-Agent': 'explo-front/1.0' } },
    )
    const data = await res.json()
    if (data[0]) return { lat: +data[0].lat, lng: +data[0].lon }
  } catch { }
  return null
}

export default function MapaPage() {
  const [geoProps, setGeoProps]       = useState<GeoProperty[]>([])
  const [filter, setFilter]           = useState<FilterType>('todas')
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<HoveredCard | null>(null)
  const [viewerReady, setViewerReady] = useState(false)

  const navigate        = useNavigate()
  const viewerRef       = useRef<CesiumComponentRef<CesiumViewer>>(null)
  const containerRef    = useRef<HTMLDivElement>(null)
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null)
  const geoPropsRef     = useRef<GeoProperty[]>([])
  const hasFlewTo       = useRef(false)

  useEffect(() => { geoPropsRef.current = geoProps }, [geoProps])

  // Load & geocode
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

  // Detect viewer ready via RAF
  useEffect(() => {
    let raf: number
    function check() {
      const v = viewerRef.current?.cesiumElement
      if (v && !v.isDestroyed()) {
        setViewerReady(true)
      } else {
        raf = requestAnimationFrame(check)
      }
    }
    raf = requestAnimationFrame(check)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Fly to first loaded properties
  useEffect(() => {
    if (!viewerReady || geoProps.length === 0 || hasFlewTo.current) return
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer || viewer.isDestroyed()) return
    hasFlewTo.current = true
    const lats = geoProps.map(p => p.lat)
    const lngs = geoProps.map(p => p.lng)
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(centerLng, centerLat, 800000),
      duration: 2.5,
    })
  }, [geoProps, viewerReady])

  // Hover + click detection — set up once, reads geoProps via ref
  useEffect(() => {
    if (!viewerReady) return
    const viewer = viewerRef.current?.cesiumElement
    if (!viewer || viewer.isDestroyed()) return

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)

    handler.setInputAction((e: { endPosition: Cartesian2 }) => {
      const picked = viewer.scene.pick(e.endPosition)
      if (defined(picked) && picked.id && typeof picked.id.id === 'string') {
        const prop = geoPropsRef.current.find(p => String(p.id) === picked.id.id)
        if (prop) {
          const screenPos = viewer.scene.cartesianToCanvasCoordinates(
            Cartesian3.fromDegrees(prop.lng, prop.lat),
          )
          if (screenPos) {
            setHoveredCard({ prop, x: screenPos.x, y: screenPos.y })
            return
          }
        }
      }
      setHoveredCard(null)
    }, ScreenSpaceEventType.MOUSE_MOVE)

    handler.setInputAction((e: { position: Cartesian2 }) => {
      const picked = viewer.scene.pick(e.position)
      if (defined(picked) && picked.id && typeof picked.id.id === 'string') {
        navigate(`/propiedades/${picked.id.id}`)
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    return () => { if (!handler.isDestroyed()) handler.destroy() }
  }, [viewerReady, navigate])

  // Heatmap canvas — reruns when props or toggle changes
  useEffect(() => {
    const viewer = viewerRef.current?.cesiumElement
    const canvas = heatmapCanvasRef.current
    if (!viewerReady || !viewer || viewer.isDestroyed() || !canvas) return

    if (!showHeatmap) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    function draw() {
      const v = viewerRef.current?.cesiumElement
      if (!v || v.isDestroyed() || !canvas) return
      const scene = v.scene
      const w = scene.canvas.clientWidth
      const h = scene.canvas.clientHeight
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)

      for (const p of geoPropsRef.current) {
        const sp = scene.cartesianToCanvasCoordinates(Cartesian3.fromDegrees(p.lng, p.lat))
        if (!sp || sp.x < 0 || sp.x > w || sp.y < 0 || sp.y > h) continue
        const r = 90
        const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, r)
        grd.addColorStop(0,   'rgba(239, 68,  68,  0.50)')
        grd.addColorStop(0.4, 'rgba(251, 146, 60,  0.28)')
        grd.addColorStop(1,   'rgba(251, 146, 60,  0)')
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, r, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }
    }

    draw()
    viewer.scene.postRender.addEventListener(draw)
    return () => {
      const v = viewerRef.current?.cesiumElement
      if (v && !v.isDestroyed()) v.scene.postRender.removeEventListener(draw)
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [geoProps, showHeatmap, viewerReady])

  return (
    <div className="p-6">
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-lg relative" style={{ height: '80vh' }}>

        {/* Filter panel */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-2 md:p-3 flex flex-col gap-1.5 md:gap-2 min-w-[110px] md:min-w-[160px]">
          <p className="text-[9px] md:text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-0.5 md:px-1">Estado</p>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                backgroundColor: FILTER_COLORS[f],
                opacity: filter === f ? 1 : 0.42,
              }}
              className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-white text-[11px] md:text-xs font-semibold transition-all hover:opacity-75 ${filter === f ? 'shadow-md' : ''}`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
          <div className="border-t border-zinc-200 pt-1.5 md:pt-2 mt-0.5">
            <button
              onClick={() => setShowHeatmap(h => !h)}
              className={`w-full px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[11px] md:text-xs font-semibold transition-all ${
                showHeatmap
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {showHeatmap ? 'Ocultar heatmap' : 'Ver heatmap'}
            </button>
          </div>
        </div>

        {/* Heatmap overlay */}
        <canvas
          ref={heatmapCanvasRef}
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Hover minicard */}
        {hoveredCard && (() => {
          const cw = containerRef.current?.clientWidth  ?? 800
          const ch = containerRef.current?.clientHeight ?? 600
          const x  = Math.min(hoveredCard.x + 16, cw - 224)
          const y  = Math.max(8, Math.min(hoveredCard.y - 130, ch - 160))
          return (
            <div
              className="absolute z-20 pointer-events-none"
              style={{ left: x, top: y }}
            >
              <div className="bg-white rounded-xl shadow-xl p-3 w-52 border border-zinc-100 animate-in fade-in slide-in-from-bottom-1 duration-150">
                <p className="font-semibold text-zinc-800 text-sm leading-tight mb-0.5 truncate">
                  {hoveredCard.prop.name}
                </p>
                <p className="text-xs text-zinc-400 mb-1.5 truncate capitalize">
                  {hoveredCard.prop.category}
                </p>
                <p className="text-xs text-zinc-500 mb-2 truncate">
                  {hoveredCard.prop.address}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: AVAILABILITY_COLOR[hoveredCard.prop.availability] ?? '#6366f1' }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: AVAILABILITY_COLOR[hoveredCard.prop.availability] ?? '#6366f1' }}
                  >
                    {AVAILABILITY_LABEL[hoveredCard.prop.availability] ?? hoveredCard.prop.availability}
                  </span>
                </div>
                {hoveredCard.prop.financials && (
                  <div className="mt-2 pt-2 border-t border-zinc-100 text-xs font-bold text-emerald-600">
                    ${hoveredCard.prop.financials.monthlyRentCLP.toLocaleString('es-CL')} CLP/mes
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        <Viewer
          ref={viewerRef}
          style={{ width: '100%', height: '100%' }}
          timeline={false}
          animation={false}
          fullscreenButton={false}
          infoBox={false}
          selectionIndicator={false}
        >
          {geoProps.map(p => {
            const color    = AVAILABILITY_COLOR[p.availability] ?? '#6366f1'
            const isActive = filter === 'todas' || filter === p.availability
            return (
              <Entity
                key={p.id}
                id={String(p.id)}
                name={p.name}
                position={Cartesian3.fromDegrees(p.lng, p.lat)}
                billboard={{
                  image:  createHousePin(color),
                  verticalOrigin: VerticalOrigin.BOTTOM,
                  width:  isActive ? 40 : 28,
                  height: isActive ? 52 : 36,
                  pixelOffset: new Cartesian2(0, 0),
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
                  color: isActive ? ACTIVE_TINT : INACTIVE_TINT,
                }}
              />
            )
          })}
        </Viewer>
      </div>
    </div>
  )
}
