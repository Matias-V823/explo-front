import {
  Tag, AlignLeft, LayoutGrid, Users, Zap, Banknote, FolderOpen,
} from 'lucide-react'
import type { PropertyCategory, UtilityStatus, ImportantDate, PropertyDocument } from '../types/properties'

export const PROPERTY_CATEGORIES: PropertyCategory[] = [
  'bodega', 'cabaña', 'casa', 'casa comercial', 'comercial e industrial',
  'departamento', 'estacionamiento', 'galpon', 'local comercial', 'loft',
  'oficina', 'parcela', 'penthouse', 'sitio', 'terreno comercial', 'terreno urbano',
]

export const UTILITY_OPTIONS: { value: UtilityStatus; label: string }[] = [
  { value: 'al-dia', label: 'Al día' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'cortado', label: 'Cortado' },
  { value: 'no-aplica', label: 'N/A' },
]

export const DATE_TYPES: { value: ImportantDate['type']; label: string }[] = [
  { value: 'vencimiento', label: 'Vencimiento' },
  { value: 'revision', label: 'Revisión' },
  { value: 'pago', label: 'Pago' },
  { value: 'inicio', label: 'Inicio' },
]

export const NAV_SECTIONS = [
  { id: 'identidad',       label: 'Identidad',       icon: Tag },
  { id: 'descripcion',     label: 'Descripción',      icon: AlignLeft },
  { id: 'caracteristicas', label: 'Características',  icon: LayoutGrid },
  { id: 'personas',        label: 'Personas',         icon: Users },
  { id: 'servicios',       label: 'Servicios',        icon: Zap },
  { id: 'financiero',      label: 'Financiero',       icon: Banknote },
  { id: 'documentacion',   label: 'Documentación',    icon: FolderOpen },
]

export const DOCUMENT_TYPES: { value: PropertyDocument['type']; label: string }[] = [
  { value: 'contrato',    label: 'Contrato de arriendo' },
  { value: 'escritura',   label: 'Escritura de dominio' },
  { value: 'boleta',      label: 'Boleta de garantía' },
  { value: 'certificado', label: 'Certificado' },
  { value: 'otro',        label: 'Otro' },
]

export const inputCls = 'w-full h-8 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors cursor-pointer'
export const selectCls = 'w-full h-8 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors appearance-none cursor-pointer'
export const labelCls = 'block text-[9.5px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1'
