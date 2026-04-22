import { useState, useRef, useEffect, type SubmitEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, ImagePlus, X, Loader2, Check, UserPlus, Paperclip, FileText } from 'lucide-react'
import { fetchPersons } from '../api/persons'
import { uploadImage, uploadDocument } from '../api/storage'
import { createProperty, updateProperty, fetchProperty, fetchDocumentTypes, fetchUtilityTypes, fetchServiceProviders, fetchCountries, fetchRegions, fetchCities, fetchCommunes } from '../api/properties'
import type { Availability, PropertyCategory, UtilityStatus } from '../types/properties'
import type { FormState, FormDocument, FormUtility } from '../types/propertyForm'
import type { PersonOption } from '../types/persons'
import {
  PROPERTY_CATEGORIES, DATE_TYPES, NAV_SECTIONS, UTILITY_STATUS_OPTIONS,
  inputCls, selectCls, labelCls,
} from '../constants/propertyForm'
import SectionCard from '../components/properties/SectionCard'
import NewPersonModal from '../components/properties/NewPersonModal'


const EMPTY_FORM: FormState = {
  name: '', category: 'departamento', availability: 'disponible-arriendo',
  address: '', countryId: '', regionId: '', cityId: '', communeId: '',
  valueUF: '', contact: '', description: '',
  bedrooms: '', bathrooms: '', parkings: '', construction: '', terrain: '',
  ownerId: '', tenantId: '',
  utilities: [],
  hasFinancials: false, monthlyRentCLP: '', administrationPct: '10', paymentDueDay: '5',
  importantDates: [], images: [], documents: [],
}


type FormErrors = Record<string, string>

export default function PropertyFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = id !== undefined

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formLoading, setFormLoading] = useState(isEditing)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingDocIndex, setUploadingDocIndex] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('identidad')
  const [showPersonModal, setShowPersonModal] = useState(false)
  const [persons, setPersons] = useState<PersonOption[]>([])
  const [personsLoading, setPersonsLoading] = useState(true)
  const [documentTypes, setDocumentTypes] = useState<{ id: number; name: string }[]>([])
  const [utilityTypes, setUtilityTypes] = useState<{ id: number; name: string }[]>([])
  const [serviceProviders, setServiceProviders] = useState<{ id: number; name: string; utilityType: { id: number } }[]>([])
  const [countries, setCountries] = useState<{ id: number; name: string; code: string }[]>([])
  const [regions, setRegions] = useState<{ id: number; name: string }[]>([])
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const [communes, setCommunes] = useState<{ id: number; name: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docFileInputRef = useRef<HTMLInputElement>(null)
  const uploadingDocIndexRef = useRef<number | null>(null)

  useEffect(() => {
    fetchPersons()
      .then(setPersons)
      .finally(() => setPersonsLoading(false))
    fetchDocumentTypes().then(setDocumentTypes).catch(() => {})
    fetchUtilityTypes().then(setUtilityTypes).catch(() => {})
    fetchServiceProviders().then(setServiceProviders).catch(() => {})
    fetchCountries().then(setCountries).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEditing || !id) return
    fetchProperty(Number(id))
      .then(p => {
        setForm({
          name: p.name,
          category: p.category,
          availability: p.availability,
          address: p.address,
          countryId: String(p.country.id),
          regionId: String(p.region.id),
          cityId: String(p.city.id),
          communeId: p.commune ? String(p.commune.id) : '',
          valueUF: String(p.valueUF),
          contact: p.contact ?? '',
          description: p.description ?? '',
          bedrooms: p.program.bedrooms != null ? String(p.program.bedrooms) : '',
          bathrooms: p.program.bathrooms != null ? String(p.program.bathrooms) : '',
          parkings: p.program.parkings != null ? String(p.program.parkings) : '',
          construction: p.program.construction != null ? String(p.program.construction) : '',
          terrain: p.program.terrain != null ? String(p.program.terrain) : '',
          ownerId: String(p.ownerId),
          tenantId: p.tenantId ? String(p.tenantId) : '',
          utilities: p.utilities.map(u => ({
            utilityTypeId: u.utilityType.id,
            serviceProviderId: u.serviceProvider?.id ?? 0,
            status: u.status,
            customerNumber: u.customerNumber ?? '',
            billDueDay: u.billDueDay != null ? String(u.billDueDay) : '',
          })),
          hasFinancials: !!p.financials,
          monthlyRentCLP: p.financials ? String(p.financials.monthlyRentCLP) : '',
          administrationPct: p.financials ? String(p.financials.administrationPct) : '10',
          paymentDueDay: p.financials ? String(p.financials.paymentDueDay) : '5',
          importantDates: p.importantDates.map(d => ({ label: d.label, date: d.date, type: d.type })),
          images: [...p.images],
          documents: p.documents.map(d => ({ name: d.name, documentTypeId: d.documentType.id, date: d.date, url: '' })),
        })
        fetchRegions(p.country.id).then(setRegions).catch(() => {})
        fetchCities(p.region.id).then(setCities).catch(() => {})
        fetchCommunes(p.city.id).then(setCommunes).catch(() => {})
      })
      .catch(() => navigate('/propiedades'))
      .finally(() => setFormLoading(false))
  }, [id, isEditing])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key as string]) setErrors(prev => { const n = { ...prev }; delete n[key as string]; return n })
  }

  function setDate(i: number, field: keyof FormState['importantDates'][0], value: string) {
    setForm(prev => {
      const dates = [...prev.importantDates]
      dates[i] = { ...dates[i], [field]: value }
      return { ...prev, importantDates: dates }
    })
  }

  function handleCountryChange(countryId: string) {
    setForm(prev => ({ ...prev, countryId, regionId: '', cityId: '', communeId: '' }))
    setErrors(prev => { const n = { ...prev }; delete n.countryId; delete n.regionId; delete n.cityId; return n })
    setRegions([])
    setCities([])
    setCommunes([])
    if (countryId) fetchRegions(Number(countryId)).then(setRegions).catch(() => {})
  }

  function handleRegionChange(regionId: string) {
    setForm(prev => ({ ...prev, regionId, cityId: '', communeId: '' }))
    setErrors(prev => { const n = { ...prev }; delete n.regionId; delete n.cityId; return n })
    setCities([])
    setCommunes([])
    if (regionId) fetchCities(Number(regionId)).then(setCities).catch(() => {})
  }

  function handleCityChange(cityId: string) {
    setForm(prev => ({ ...prev, cityId, communeId: '' }))
    setErrors(prev => { const n = { ...prev }; delete n.cityId; return n })
    setCommunes([])
    if (cityId) fetchCommunes(Number(cityId)).then(setCommunes).catch(() => {})
  }

  function setUtility(i: number, field: keyof FormUtility, value: string) {
    setForm(prev => {
      const utils = [...prev.utilities]
      const parsed = (field === 'utilityTypeId' || field === 'serviceProviderId') ? Number(value) : value
      utils[i] = { ...utils[i], [field]: parsed }
      return { ...prev, utilities: utils }
    })
  }

  function setDoc(i: number, field: keyof FormDocument, value: string) {
    setForm(prev => {
      const docs = [...prev.documents]
      const parsed = field === 'documentTypeId' ? Number(value) : value
      docs[i] = { ...docs[i], [field]: parsed }
      return { ...prev, documents: docs }
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const url = await uploadImage(file, 'properties')
      setForm(prev => ({ ...prev, images: [...prev.images, url] }))
    } catch {
      alert('Error al subir la imagen')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    const idx = uploadingDocIndexRef.current
    if (!file || idx === null) return
    setUploadingDocIndex(idx)
    try {
      const url = await uploadDocument(file, 'properties')
      setForm(prev => {
        const docs = [...prev.documents]
        docs[idx] = { ...docs[idx], url, name: docs[idx].name || file.name }
        return { ...prev, documents: docs }
      })
    } catch {
      alert('Error al subir el documento')
    } finally {
      setUploadingDocIndex(null)
      uploadingDocIndexRef.current = null
      if (docFileInputRef.current) docFileInputRef.current.value = ''
    }
  }

  const done = {
    identidad:       !!(form.name && form.address && form.cityId && form.valueUF),
    descripcion:     !!(form.description),
    caracteristicas: !!(form.bedrooms || form.bathrooms || form.construction),
    personas:        !!(form.ownerId),
    servicios:       form.utilities.length > 0,
    financiero:      !form.hasFinancials || !!(form.monthlyRentCLP),
    documentacion:   form.images.length > 0,
  }

  function errCls(field: string, base = inputCls) {
    return errors[field]
      ? base.replace('border-[rgba(0,0,0,0.08)]', 'border-red-300').replace('bg-zinc-50', 'bg-red-50/30')
      : base
  }

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.name.trim())                         e.name = 'El nombre es requerido'
    else if (form.name.trim().length < 3)          e.name = 'Mínimo 3 caracteres'
    if (!form.address.trim())                      e.address = 'La dirección es requerida'
    if (!form.countryId)                           e.countryId = 'Selecciona un país'
    if (!form.regionId)                            e.regionId = 'Selecciona una región'
    if (!form.cityId)                              e.cityId = 'Selecciona una ciudad'
    if (!form.valueUF || Number(form.valueUF) <= 0) e.valueUF = 'Ingresa un valor mayor a 0'
    if (!form.ownerId)                             e.ownerId = 'El propietario es requerido'
    if (form.hasFinancials) {
      if (!form.monthlyRentCLP || Number(form.monthlyRentCLP) <= 0)
        e.monthlyRentCLP = 'Ingresa el monto de arriendo'
      const pct = Number(form.administrationPct)
      if (isNaN(pct) || pct < 0 || pct > 100)
        e.administrationPct = 'Debe ser entre 0 y 100'
      const day = Number(form.paymentDueDay)
      if (!form.paymentDueDay || day < 1 || day > 31)
        e.paymentDueDay = 'Día inválido (1–31)'
    }
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const firstSection = ['name', 'address', 'countryId', 'regionId', 'cityId', 'valueUF'].some(f => e[f])
        ? 'identidad'
        : e.ownerId ? 'personas'
        : 'financiero'
      document.getElementById(firstSection)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    return Object.keys(e).length === 0
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveSection(sectionId)
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (uploadingImage || uploadingDocIndex !== null) return
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      availability: form.availability,
      address: form.address.trim(),
      countryId: Number(form.countryId),
      regionId: Number(form.regionId),
      cityId: Number(form.cityId),
      communeId: form.communeId ? Number(form.communeId) : undefined,
      contact: form.contact || undefined,
      valueUF: form.valueUF ? Number(form.valueUF) : undefined,
      images: form.images,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
      parkings: form.parkings ? Number(form.parkings) : undefined,
      terrainM2: form.terrain ? Number(form.terrain) : undefined,
      constructionM2: form.construction ? Number(form.construction) : undefined,
      ownerId: Number(form.ownerId),
      tenantId: form.tenantId ? Number(form.tenantId) : undefined,
      utilities: form.utilities.filter(u => u.utilityTypeId).map(u => ({
        utilityTypeId: u.utilityTypeId,
        serviceProviderId: u.serviceProviderId || undefined,
        status: u.status,
        customerNumber: u.customerNumber || undefined,
        billDueDay: u.billDueDay ? Number(u.billDueDay) : undefined,
      })),
      financials: form.hasFinancials && form.monthlyRentCLP ? {
        monthlyRentCLP: Number(form.monthlyRentCLP),
        administrationPct: Number(form.administrationPct),
        paymentDueDay: Number(form.paymentDueDay),
      } : undefined,
      documents: form.documents.filter(d => d.name.trim() && d.date && d.documentTypeId).map(d => ({
        name: d.name.trim(),
        documentTypeId: d.documentTypeId,
        date: d.date,
        fileUrl: d.url || undefined,
      })),
      importantDates: form.importantDates.filter(d => d.label && d.date).map(d => ({
        label: d.label,
        date: d.date,
        type: d.type,
      })),
    }

    try {
      if (isEditing && id) {
        await updateProperty(Number(id), payload)
        navigate(`/propiedades/${id}`)
      } else {
        const { id: newId } = await createProperty(payload)
        navigate(`/propiedades/${newId}`)
      }
    } catch {
      alert(isEditing ? 'Error al actualizar la propiedad' : 'Error al crear la propiedad')
    } finally {
      setSubmitting(false)
    }
  }

  if (formLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={24} strokeWidth={1.5} className="text-zinc-300 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex min-h-full">

      {/* ── Sidebar nav ── */}
      <aside className="w-52 shrink-0 self-start sticky top-6 flex flex-col gap-1 px-4 py-2">

        <button type="button" onClick={() => navigate('/propiedades')}
          className="flex items-center gap-2 text-[12px] text-zinc-400 hover:text-ink transition-colors mb-4 mt-2 cursor-pointer">
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
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left cursor-pointer transition-all group ${
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
              disabled={submitting || uploadingImage || uploadingDocIndex !== null}
              className="h-9 px-4 rounded-xl bg-ink text-white text-[12.5px] font-semibold hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {submitting && <Loader2 size={13} strokeWidth={2} className="animate-spin" />}
              {isEditing ? 'Guardar cambios' : 'Crear propiedad'}
            </button>
          </div>
        </div>

        <SectionCard id="identidad" number={1} title="Identidad">
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Nombre de la propiedad <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Ej: Departamento Providencia Centro"
                className={errCls('name')} />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
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
                  <option value="disponible-arriendo">Disponible arriendo</option>
                  <option value="arrendada">Arrendada</option>
                  <option value="disponible-venta">Disponible venta</option>
                  <option value="no-disponible">No disponible</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Dirección <span className="text-red-400">*</span></label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="Ej: Av. Providencia 1234" className={errCls('address')} />
              {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className={labelCls}>País <span className="text-red-400">*</span></label>
                <select value={form.countryId} onChange={e => handleCountryChange(e.target.value)}
                  className={errCls('countryId', selectCls)}>
                  <option value="">Seleccionar</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.countryId && <p className="text-[11px] text-red-500 mt-1">{errors.countryId}</p>}
              </div>
              <div>
                <label className={labelCls}>Región <span className="text-red-400">*</span></label>
                <select value={form.regionId} onChange={e => handleRegionChange(e.target.value)}
                  disabled={!form.countryId} className={errCls('regionId', selectCls)}>
                  <option value="">Seleccionar</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                {errors.regionId && <p className="text-[11px] text-red-500 mt-1">{errors.regionId}</p>}
              </div>
              <div>
                <label className={labelCls}>Ciudad <span className="text-red-400">*</span></label>
                <select value={form.cityId} onChange={e => handleCityChange(e.target.value)}
                  disabled={!form.regionId} className={errCls('cityId', selectCls)}>
                  <option value="">Seleccionar</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.cityId && <p className="text-[11px] text-red-500 mt-1">{errors.cityId}</p>}
              </div>
              <div>
                <label className={labelCls}>Comuna <span className="text-zinc-300 font-normal normal-case">opcional</span></label>
                <select value={form.communeId} onChange={e => set('communeId', e.target.value)}
                  disabled={!form.cityId} className={selectCls}>
                  <option value="">Sin comuna</option>
                  {communes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Valor (UF) <span className="text-red-400">*</span></label>
              <input type="number" value={form.valueUF}
                onChange={e => set('valueUF', e.target.value)}
                placeholder="7200" min={0} className={errCls('valueUF')} />
              {errors.valueUF && <p className="text-[11px] text-red-500 mt-1">{errors.valueUF}</p>}
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
                  disabled={personsLoading} className={errCls('ownerId', selectCls)}>
                  <option value="">{personsLoading ? 'Cargando…' : 'Seleccionar'}</option>
                  {persons.filter(p => p.roleId === 4).map(p => (
                    <option key={p.id} value={p.id}>
                      {[p.name, p.paternalLastName].filter(Boolean).join(' ')}
                    </option>
                  ))}
                </select>
                {errors.ownerId && <p className="text-[11px] text-red-500 mt-1">{errors.ownerId}</p>}
              </div>
              <div>
                <label className={labelCls}>Inquilino <span className="text-zinc-300 font-normal normal-case">opcional</span></label>
                <select value={form.tenantId} onChange={e => set('tenantId', e.target.value)}
                  disabled={personsLoading} className={selectCls}>
                  <option value="">{personsLoading ? 'Cargando…' : 'Sin inquilino'}</option>
                  {persons.filter(p => p.roleId === 3).map(p => (
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
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] text-zinc-400">Registra los servicios asociados a la propiedad</p>
            <button type="button" onClick={() => setForm(p => ({
                ...p,
                utilities: [...p.utilities, {
                  utilityTypeId: utilityTypes[0]?.id ?? 0,
                  serviceProviderId: 0,
                  status: 'no-aplica',
                  customerNumber: '',
                  billDueDay: '',
                }],
              }))}
              className="flex items-center gap-1 text-[11.5px] font-medium text-zinc-400 hover:text-ink transition-colors">
              <Plus size={12} /> Agregar
            </button>
          </div>
          {form.utilities.length === 0 && (
            <p className="text-[12.5px] text-zinc-400 text-center py-4">Sin servicios registrados</p>
          )}
          <div className="flex flex-col gap-2">
            {form.utilities.map((u, i) => {
              const providersForType = serviceProviders.filter(p => p.utilityType.id === u.utilityTypeId)
              return (
                <div key={i} className="grid grid-cols-[150px_160px_120px_1fr_72px_32px] gap-2 items-center">
                  <select value={u.utilityTypeId}
                    onChange={e => {
                      setUtility(i, 'utilityTypeId', e.target.value)
                      setUtility(i, 'serviceProviderId', '0')
                    }}
                    className="h-9 px-2.5 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none appearance-none">
                    {utilityTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <select value={u.serviceProviderId}
                    onChange={e => setUtility(i, 'serviceProviderId', e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none appearance-none">
                    <option value={0}>Sin proveedor</option>
                    {providersForType.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <select value={u.status}
                    onChange={e => setUtility(i, 'status', e.target.value as UtilityStatus)}
                    className="h-9 px-2.5 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none appearance-none">
                    {UTILITY_STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <input value={u.customerNumber}
                    onChange={e => setUtility(i, 'customerNumber', e.target.value)}
                    placeholder="N° cliente / cuenta"
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <input type="number" value={u.billDueDay}
                    onChange={e => setUtility(i, 'billDueDay', e.target.value)}
                    placeholder="Día cobro"
                    min={1} max={31}
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <button type="button"
                    onClick={() => setForm(p => ({ ...p, utilities: p.utilities.filter((_, j) => j !== i) }))}
                    className="w-8 h-9 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
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
                <label className={labelCls}>Arriendo mensual (CLP) <span className="text-red-400">*</span></label>
                <input type="number" value={form.monthlyRentCLP}
                  onChange={e => set('monthlyRentCLP', e.target.value)}
                  placeholder="650000" min={0} className={errCls('monthlyRentCLP')} />
                {errors.monthlyRentCLP && <p className="text-[11px] text-red-500 mt-1">{errors.monthlyRentCLP}</p>}
              </div>
              <div>
                <label className={labelCls}>Comisión admin. (%)</label>
                <input type="number" value={form.administrationPct}
                  onChange={e => set('administrationPct', e.target.value)}
                  placeholder="10" min={0} max={100} className={errCls('administrationPct')} />
                {errors.administrationPct && <p className="text-[11px] text-red-500 mt-1">{errors.administrationPct}</p>}
              </div>
              <div>
                <label className={labelCls}>Día de vencimiento</label>
                <input type="number" value={form.paymentDueDay}
                  onChange={e => set('paymentDueDay', e.target.value)}
                  placeholder="5" min={1} max={31} className={errCls('paymentDueDay')} />
                {errors.paymentDueDay && <p className="text-[11px] text-red-500 mt-1">{errors.paymentDueDay}</p>}
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
          <div className="border-t border-zinc-100 pt-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className={`${labelCls} mb-0`}>Documentos</p>
              <button type="button" onClick={() => setForm(p => ({
                  ...p, documents: [...p.documents, { name: '', documentTypeId: documentTypes[0]?.id ?? 0, date: '', url: '' }]
                }))}
                className="flex items-center gap-1 text-[11.5px] font-medium text-zinc-400 hover:text-ink transition-colors">
                <Plus size={12} /> Agregar
              </button>
            </div>
            {form.documents.length === 0 && (
              <p className="text-[12.5px] text-zinc-400 text-center py-4">Sin documentos adjuntos</p>
            )}
            <div className="flex flex-col gap-2">
              {form.documents.map((doc, i) => (
                <div key={i} className="grid grid-cols-[160px_1fr_140px_auto_32px] gap-2 items-center">
                  <select value={doc.documentTypeId} onChange={e => setDoc(i, 'documentTypeId', e.target.value)}
                    className="h-9 px-2.5 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none appearance-none">
                    {documentTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                  <input value={doc.name} onChange={e => setDoc(i, 'name', e.target.value)}
                    placeholder="Nombre del documento"
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <input type="date" value={doc.date} onChange={e => setDoc(i, 'date', e.target.value)}
                    className="h-9 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12.5px] text-ink focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors" />
                  <button type="button" disabled={uploadingDocIndex === i}
                    onClick={() => {
                      uploadingDocIndexRef.current = i
                      docFileInputRef.current?.click()
                    }}
                    className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[11.5px] font-medium transition-colors whitespace-nowrap ${
                      doc.url
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-ink'
                    } disabled:opacity-50`}>
                    {uploadingDocIndex === i
                      ? <Loader2 size={12} strokeWidth={2} className="animate-spin" />
                      : doc.url
                        ? <FileText size={12} strokeWidth={2} />
                        : <Paperclip size={12} strokeWidth={2} />
                    }
                    {uploadingDocIndex === i ? 'Subiendo…' : doc.url ? 'Adjunto' : 'Adjuntar'}
                  </button>
                  <button type="button" onClick={() => setForm(p => ({ ...p, documents: p.documents.filter((_, j) => j !== i) }))}
                    className="w-8 h-9 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <input ref={docFileInputRef} type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              className="hidden" onChange={handleDocumentUpload} />
          </div>

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
              roleId: person.role.id,
            }])
            const isOwner = person.role.id === 4
            if (isOwner) set('ownerId', String(person.id))
            else set('tenantId', String(person.id))
            setShowPersonModal(false)
          }}
        />
      )}
    </form>
  )
}
