import { apiFetch } from './client'
import type { ListingProperty, PropertyUtility } from '../types/properties'

export interface PropertyPerson {
  id: number
  name: string
  email: string
  phone: string
}

export interface PropertyDetail extends ListingProperty {
  owner: PropertyPerson
  tenant?: PropertyPerson
}

type RawProperty = {
  id: number
  name: string
  description: string
  category: string
  availability: string
  address: string
  country: { id: number; name: string; code: string }
  region: { id: number; name: string }
  city: { id: number; name: string }
  commune: { id: number; name: string } | null
  contact: string
  valueUF: number
  images: string[]
  bedrooms: number | null
  bathrooms: number | null
  parkings: number | null
  terrainM2: number | null
  constructionM2: number | null
  owner: { id: number; name: string; paternalLastName: string; email: string; phone: string }
  tenant: { id: number; name: string; paternalLastName: string; email: string; phone: string } | null
  utilities: PropertyUtility[]
  financials: {
    monthlyRentCLP: number
    administrationPct: number
    administrationAmount: number
    paymentDueDay: number
    nextPaymentDate: string
    lastPaymentDate?: string
    transferStatus: string
  } | null
  documents: { id: number; name: string; documentType: { id: number; name: string }; date: string }[]
  importantDates: { label: string; date: string; type: string }[]
}

function mapProperty(raw: RawProperty): ListingProperty {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? '',
    category: raw.category as ListingProperty['category'],
    availability: raw.availability as ListingProperty['availability'],
    address: raw.address,
    country: raw.country,
    region: raw.region,
    city: raw.city,
    commune: raw.commune,
    contact: raw.contact ?? '',
    valueUF: Number(raw.valueUF) || 0,
    images: raw.images ?? [],
    ownerId: raw.owner.id,
    ownerName: [raw.owner.name, raw.owner.paternalLastName].filter(Boolean).join(' '),
    tenantId: raw.tenant?.id,
    program: {
      bedrooms: raw.bedrooms ?? undefined,
      bathrooms: raw.bathrooms ?? undefined,
      parkings: raw.parkings ?? undefined,
      terrain: raw.terrainM2 ?? undefined,
      construction: raw.constructionM2 ?? undefined,
    },
    utilities: raw.utilities ?? [],
    financials: raw.financials ? {
      monthlyRentCLP: raw.financials.monthlyRentCLP,
      administrationPct: raw.financials.administrationPct,
      administrationAmount: raw.financials.administrationAmount,
      paymentDueDay: raw.financials.paymentDueDay,
      nextPaymentDate: raw.financials.nextPaymentDate,
      lastPaymentDate: raw.financials.lastPaymentDate,
      transferStatus: raw.financials.transferStatus as NonNullable<PropertyDetail['financials']>['transferStatus'],
    } : undefined,
    documents: (raw.documents ?? []).map(d => ({
      id: d.id,
      name: d.name,
      documentType: d.documentType,
      date: d.date,
    })),
    importantDates: (raw.importantDates ?? []).map(d => ({
      label: d.label,
      date: d.date,
      type: d.type as ListingProperty['importantDates'][0]['type'],
    })),
  }
}

export async function fetchProperties(): Promise<ListingProperty[]> {
  const res = await apiFetch('/properties')
  if (!res.ok) throw new Error('Error al cargar las propiedades')
  const data: RawProperty[] = await res.json()
  return data.map(mapProperty)
}

export async function fetchProperty(id: number): Promise<PropertyDetail> {
  const res = await apiFetch(`/properties/${id}`)
  if (!res.ok) throw new Error('Propiedad no encontrada')
  const raw: RawProperty = await res.json()
  return {
    ...mapProperty(raw),
    owner: {
      id: raw.owner.id,
      name: [raw.owner.name, raw.owner.paternalLastName].filter(Boolean).join(' '),
      email: raw.owner.email,
      phone: raw.owner.phone,
    },
    tenant: raw.tenant ? {
      id: raw.tenant.id,
      name: [raw.tenant.name, raw.tenant.paternalLastName].filter(Boolean).join(' '),
      email: raw.tenant.email,
      phone: raw.tenant.phone,
    } : undefined,
  }
}

export interface CreatePropertyPayload {
  name: string
  description?: string
  category: string
  availability: string
  address: string
  countryId: number
  regionId: number
  cityId: number
  communeId?: number
  contact?: string
  valueUF?: number
  images?: string[]
  bedrooms?: number
  bathrooms?: number
  parkings?: number
  terrainM2?: number
  constructionM2?: number
  ownerId: number
  tenantId?: number
  utilities?: {
    utilityTypeId: number
    serviceProviderId?: number
    status: string
    customerNumber?: string
    billDueDay?: number
  }[]
  financials?: {
    monthlyRentCLP: number
    administrationPct: number
    paymentDueDay: number
  }
  documents?: {
    name: string
    documentTypeId: number
    date: string
    fileUrl?: string
  }[]
  importantDates?: {
    label: string
    date: string
    type: string
  }[]
}

export async function fetchCountries(): Promise<{ id: number; name: string; code: string }[]> {
  const res = await apiFetch('/properties/countries')
  if (!res.ok) throw new Error('Error al cargar los países')
  return res.json()
}

export async function fetchRegions(countryId: number): Promise<{ id: number; name: string }[]> {
  const res = await apiFetch(`/properties/regions?countryId=${countryId}`)
  if (!res.ok) throw new Error('Error al cargar las regiones')
  return res.json()
}

export async function fetchCities(regionId: number): Promise<{ id: number; name: string }[]> {
  const res = await apiFetch(`/properties/cities?regionId=${regionId}`)
  if (!res.ok) throw new Error('Error al cargar las ciudades')
  return res.json()
}

export async function fetchCommunes(cityId: number): Promise<{ id: number; name: string }[]> {
  const res = await apiFetch(`/properties/communes?cityId=${cityId}`)
  if (!res.ok) throw new Error('Error al cargar las comunas')
  return res.json()
}

export async function fetchUtilityTypes(): Promise<{ id: number; name: string }[]> {
  const res = await apiFetch('/properties/utility-types')
  if (!res.ok) throw new Error('Error al cargar los tipos de servicio')
  return res.json()
}

export async function fetchServiceProviders(utilityTypeId?: number): Promise<{ id: number; name: string; utilityType: { id: number } }[]> {
  const url = utilityTypeId
    ? `/properties/service-providers?utilityTypeId=${utilityTypeId}`
    : '/properties/service-providers'
  const res = await apiFetch(url)
  if (!res.ok) throw new Error('Error al cargar los proveedores')
  return res.json()
}

export async function fetchDocumentTypes(): Promise<{ id: number; name: string }[]> {
  const res = await apiFetch('/properties/document-types')
  if (!res.ok) throw new Error('Error al cargar los tipos de documento')
  return res.json()
}

export async function createProperty(payload: CreatePropertyPayload): Promise<{ id: number }> {
  const res = await apiFetch('/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al crear la propiedad')
  return res.json()
}

export async function updateProperty(id: number, payload: CreatePropertyPayload): Promise<{ id: number }> {
  const res = await apiFetch(`/properties/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Error al actualizar la propiedad')
  return res.json()
}

export async function fetchPropertyUtilities(propertyId: number): Promise<PropertyUtility[]> {
  const res = await apiFetch(`/properties/${propertyId}/utilities`)
  if (!res.ok) throw new Error('Error al cargar los servicios básicos')
  return res.json()
}

export async function fetchBillStatus(utilityId: number): Promise<Record<string, unknown>> {
  const res = await apiFetch(`/properties/utilities/${utilityId}/bill-status`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { message?: string }).message ?? `Error ${res.status}`)
  }
  return res.json()
}
