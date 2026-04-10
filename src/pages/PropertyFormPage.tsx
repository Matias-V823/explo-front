import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ImagePlus, X, Loader2, Check, UserPlus } from 'lucide-react'
import { MOCK_PERSONS } from '../data/mockPersons'
import { MOCK_PROPERTIES } from '../data/mockProperties'
import { apiFetch } from '../api/client'
import type { Availability, PropertyCategory } from '../types/properties'
import type { FormState } from '../types/propertyForm'
import type { PersonOption } from '../types/persons'
import {
  PROPERTY_CATEGORIES, DATE_TYPES, NAV_SECTIONS,
  inputCls, selectCls, labelCls,
} from '../constants/propertyForm'
import SectionCard from '../components/properties/SectionCard'
import UtilityRow from '../components/properties/UtilityRow'
import NewPersonModal from '../components/properties/NewPersonModal'


function buildInitial(id?: string): FormState {
  if (!id) return {
    name: '', category: 'departamento', availability: 'arrendar',
    location: '', valueUF: '', contact: '', description: '',
    bedrooms: '', bathrooms: '', parkings: '', construction: '', terrain: '',
    ownerId: '', tenantId: '',
    electricity: 'al-dia', electricityBill: '',
    water: 'al-dia', waterBill: '',
    gas: 'al-dia', gasBill: '',
    hasFinancials: false, monthlyRentCLP: '', administrationPct: '10', paymentDueDay: '5',
    importantDates: [], images: [],
  }
  const p = MOCK_PROPERTIES.find(x => x.id === Number(id))
  if (!p) return buildInitial(undefined)
  return {
    name: p.name, category: p.category, availability: p.availability,
    location: p.location, valueUF: String(p.valueUF), contact: p.contact,
    description: p.description,
    bedrooms: p.program.bedrooms != null ? String(p.program.bedrooms) : '',
    bathrooms: p.program.bathrooms != null ? String(p.program.bathrooms) : '',
    parkings: p.program.parkings != null ? String(p.program.parkings) : '',
    construction: p.program.construction != null ? String(p.program.construction) : '',
    terrain: p.program.terrain != null ? String(p.program.terrain) : '',
    ownerId: String(p.ownerId), tenantId: p.tenantId ? String(p.tenantId) : '',
    electricity: p.utilities.electricity, electricityBill: p.utilities.electricityBill ?? '',
    water: p.utilities.water, waterBill: p.utilities.waterBill ?? '',
    gas: p.utilities.gas, gasBill: p.utilities.gasBill ?? '',
    hasFinancials: !!p.financials,
    monthlyRentCLP: p.financials ? String(p.financials.monthlyRentCLP) : '',
    administrationPct: p.financials ? String(p.financials.administrationPct) : '10',
    paymentDueDay: p.financials ? String(p.financials.paymentDueDay) : '5',
    importantDates: p.importantDates.map(d => ({ label: d.label, date: d.date, type: d.type })),
    images: [...p.images],
  }
}


export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = id !== undefined

  const [form, setForm] = useState<FormState>(() => buildInitial(id))
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeSection, setActiveSection] = useState('identidad')
  const [showPersonModal, setShowPersonModal] = useState(false)
  const [persons, setPersons] = useState<PersonOption[]>(
    MOCK_PERSONS.map(p => ({ id: p.id, name: p.name, paternalLastName: '' }))
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function setDate(i: number, field: keyof FormState['importantDates'][0], value: string) {
    setForm(prev => {
      const dates = [...prev.importantDates]
      dates[i] = { ...dates[i], [field]: value }
      return { ...prev, importantDates: dates }
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await apiFetch('/upload/image?folder=properties', { method: 'POST', headers: {}, body })
      if (!res.ok) throw new Error()
      const { url } = await res.json() as { url: string }
      setForm(prev => ({ ...prev, images: [...prev.images, url] }))
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const done = {
    identidad:       !!(form.name && form.location && form.valueUF),
    descripcion:     !!(form.description),
    caracteristicas: !!(form.bedrooms || form.bathrooms || form.construction),
    personas:        !!(form.ownerId),
    servicios:       true,
    financiero:      !form.hasFinancials || !!(form.monthlyRentCLP),
    documentacion:   form.images.length > 0,
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(sectionId)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('submit:', form)
    navigate('/propiedades')
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full">

      {/* ── Sidebar nav ── */}
      <aside className="w-52 shrink-0 self-start sticky top-6 flex flex-col gap-1 px-4 py-2">

        <button type="button" onClick={() => navigate('/propiedades')}
          className="flex items-center gap-2 text-[12px] text-zinc-400 hover:text-ink transition-colors mb-4 mt-2">
          <ArrowLeft size={13} strokeWidth={2} />
          Volver
        </button>

        <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-zinc-400 px-2 mb-1">
          {isEditing ? `Propiedad #${id}` : 'Nueva propiedad'}
        </p>

        {NAV_SECTIONS.map(s => {
          const isActive = activeSection === s.id
          const isDone = done[s.id as keyof typeof done]
          const Icon = s.icon
          return (
            <button key={s.id} type="button" onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-ink text-white'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-ink'
              }`}>
              <Icon size={13} strokeWidth={2} className="shrink-0" />
              <span className="text-[12.5px] font-medium flex-1">{s.label}</span>
              {isDone && !isActive && (
                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check size={9} strokeWidth={3} className="text-emerald-600" />
                </span>
              )}
            </button>
          )
        })}
      </aside>

      <main className="flex-1 px-6 py-6 pb-16 flex flex-col gap-4 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-[26px] font-extrabold text-ink tracking-[-0.8px]">
              {isEditing ? 'Editar propiedad' : 'Agregar propiedad'}
            </h1>
            <p className="text-[13px] text-zinc-400 mt-0.5">
              Completa la información de la ficha técnica
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate('/propiedades')}
              className="h-9 px-4 rounded-xl border border-zinc-200 text-[12.5px] font-medium text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit"
              className="h-9 px-4 rounded-xl bg-ink text-white text-[12.5px] font-semibold hover:bg-zinc-800 transition-colors cursor-pointer">
              {isEditing ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </div>

        <SectionCard id="identidad" number={1} title="Identidad">
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Nombre de la propiedad</label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Ej: Departamento Providencia Centro"
                required className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Categoría</label>
                <select value={form.category}
                  onChange={e => set('category', e.target.value as PropertyCategory)}
                  className={selectCls}>
                  {PROPERTY_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Disponibilidad</label>
                <select value={form.availability}
                  onChange={e => set('availability', e.target.value as Availability)}
                  className={selectCls}>
                  <option value="arrendar">Arrendar</option>
                  <option value="venta">Venta</option>
                  <option value="no-disponible">No disponible</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ubicación</label>
                <input value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="Ej: Providencia, RM" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Valor (UF)</label>
                <input type="number" value={form.valueUF}
                  onChange={e => set('valueUF', e.target.value)}
                  placeholder="7200" min={0} required className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Contacto</label>
              <input value={form.contact} onChange={e => set('contact', e.target.value)}
                placeholder="+56 9 1234 5678" className={inputCls} />
            </div>
          </div>
        </SectionCard>

        <SectionCard id="descripcion" number={2} title="Descripción">
          <label className={labelCls}>Descripción de la propiedad</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Describe las características generales, entorno, condiciones de la propiedad..."
            rows={5}
            className="w-full px-3.5 py-3 rounded-[10px] bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[13.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors resize-none" />
        </SectionCard>

        <SectionCard id="caracteristicas" number={3} title="Características">
          <div className="grid grid-cols-5 gap-3">
            {([
              { key: 'bedrooms',     label: 'Dormitorios' },
              { key: 'bathrooms',    label: 'Baños' },
              { key: 'parkings',     label: 'Estac.' },
              { key: 'construction', label: 'Const. m²' },
              { key: 'terrain',      label: 'Terreno m²' },
            ] as { key: keyof FormState; label: string }[]).map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center gap-1.5">
                <label className="text-[10px] font-semibold text-zinc-400 tracking-[0.4px] uppercase text-center">
                  {label}
                </label>
                <input type="number" value={form[key] as string}
                  onChange={e => set(key, e.target.value)}
                  placeholder="—" min={0}
                  className="w-full h-12 px-2 rounded-xl bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[18px] font-bold text-ink text-center focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard id="personas" number={4} title="Personas involucradas">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Propietario <span className="text-red-400">*</span></label>
                <select value={form.ownerId} onChange={e => set('ownerId', e.target.value)}
                  required className={selectCls}>
                  <option value="">Seleccionar</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>
                      {[p.name, p.paternalLastName].filter(Boolean).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Arrendatario <span className="text-zinc-300 font-normal normal-case">opcional</span></label>
                <select value={form.tenantId} onChange={e => set('tenantId', e.target.value)}
                  className={selectCls}>
                  <option value="">Sin arrendatario</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>
                      {[p.name, p.paternalLastName].filter(Boolean).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" onClick={() => setShowPersonModal(true)}
              className="flex items-center gap-2 self-start h-9 px-4 rounded-xl border border-dashed border-zinc-300 text-[12.5px] font-medium text-zinc-500 hover:border-zinc-400 hover:text-ink hover:bg-zinc-50 transition-colors">
              <UserPlus size={13} strokeWidth={2} />
              Nueva persona
            </button>
          </div>
        </SectionCard>

        <SectionCard id="servicios" number={5} title="Servicios básicos">
          <div className="flex flex-col gap-4">
            <UtilityRow label="Electricidad" status={form.electricity} bill={form.electricityBill}
              onStatus={v => set('electricity', v)} onBill={v => set('electricityBill', v)} />
            <div className="border-t border-zinc-100" />
            <UtilityRow label="Agua" status={form.water} bill={form.waterBill}
              onStatus={v => set('water', v)} onBill={v => set('waterBill', v)} />
            <div className="border-t border-zinc-100" />
            <UtilityRow label="Gas" status={form.gas} bill={form.gasBill}
              onStatus={v => set('gas', v)} onBill={v => set('gasBill', v)} />
          </div>
        </SectionCard>

        <SectionCard id="financiero" number={6} title="Gestión financiera">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[13px] font-medium text-ink">Gestión de arriendo activa</p>
              <p className="text-[11.5px] text-zinc-400 mt-0.5">Habilita si la propiedad está en arriendo</p>
            </div>
            <button type="button" onClick={() => set('hasFinancials', !form.hasFinancials)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                form.hasFinancials ? 'bg-ink justify-end' : 'bg-zinc-200 justify-start'
              }`}>
              <span className="w-5 h-5 rounded-full bg-white shadow-sm transition-all" />
            </button>
          </div>
          {form.hasFinancials && (
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
              <div>
                <label className={labelCls}>Arriendo mensual (CLP)</label>
                <input type="number" value={form.monthlyRentCLP}
                  onChange={e => set('monthlyRentCLP', e.target.value)}
                  placeholder="650000" min={0} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Comisión admin. (%)</label>
                <input type="number" value={form.administrationPct}
                  onChange={e => set('administrationPct', e.target.value)}
                  placeholder="10" min={0} max={100} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Día de vencimiento</label>
                <input type="number" value={form.paymentDueDay}
                  onChange={e => set('paymentDueDay', e.target.value)}
                  placeholder="5" min={1} max={31} className={inputCls} />
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard id="documentacion" number={7} title="Documentación y multimedia">

          <p className={labelCls}>Imágenes</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {form.images.map((url, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-zinc-100 group">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={11} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
              className="rounded-xl border-2 border-dashed border-zinc-200 aspect-video flex flex-col items-center justify-center gap-1.5 hover:border-zinc-300 hover:bg-zinc-50 transition-colors disabled:opacity-50">
              {uploadingImage
                ? <Loader2 size={16} strokeWidth={1.5} className="text-zinc-400 animate-spin" />
                : <ImagePlus size={16} strokeWidth={1.5} className="text-zinc-400" />}
              <span className="text-[10.5px] text-zinc-400">{uploadingImage ? 'Subiendo…' : 'Agregar'}</span>
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
            className="hidden" onChange={handleImageUpload} />

          <div className="border-t border-zinc-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className={`${labelCls} mb-0`}>Fechas importantes</p>
              <button type="button" onClick={() => setForm(p => ({
                  ...p, importantDates: [...p.importantDates, { label: '', date: '', type: 'vencimiento' }]
                }))}
                className="flex items-center gap-1 text-[11.5px] font-medium text-zinc-400 hover:text-ink transition-colors">
                <Plus size={12} /> Agregar
              </button>
            </div>
            {form.importantDates.length === 0 && (
              <p className="text-[12.5px] text-zinc-400 text-center py-4">Sin fechas registradas</p>
            )}
            <div className="flex flex-col gap-2">
              {form.importantDates.map((d, i) => (
                <div key={i} className="grid grid-cols-[120px_1fr_140px_32px] gap-2 items-center">
                  <select value={d.type} onChange={e => setDate(i, 'type', e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none appearance-none">
                    {DATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input value={d.label} onChange={e => setDate(i, 'label', e.target.value)}
                    placeholder="Descripción"
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <input type="date" value={d.date} onChange={e => setDate(i, 'date', e.target.value)}
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <button type="button" onClick={() => setForm(p => ({ ...p, importantDates: p.importantDates.filter((_, j) => j !== i) }))}
                    className="w-8 h-9 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

      </main>

      {showPersonModal && (
        <NewPersonModal
          onClose={() => setShowPersonModal(false)}
          onCreated={(person) => {
            setPersons(prev => [...prev, {
              id: person.id,
              name: person.name,
              paternalLastName: person.paternalLastName,
            }])
            set('ownerId', String(person.id))
            setShowPersonModal(false)
          }}
        />
      )}
    </form>
  )
}
