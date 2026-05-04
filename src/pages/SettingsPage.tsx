import { useState } from 'react'
import { User, Bell, Sliders, Lock, ChevronRight, HelpCircle, CheckCircle2, Send } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

type Section = 'perfil' | 'notificaciones' | 'preferencias' | 'seguridad' | 'ayuda'

const sections: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'perfil', label: 'Perfil', icon: User, description: 'Tu información personal y rol' },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell, description: 'Alertas y avisos automáticos' },
  { id: 'preferencias', label: 'Preferencias', icon: Sliders, description: 'Moneda, idioma y formato' },
  { id: 'seguridad', label: 'Seguridad', icon: Lock, description: 'Contraseña y sesión activa' },
  { id: 'ayuda', label: 'Ayuda', icon: HelpCircle, description: 'Envía una solicitud al equipo' },
]

function PerfilSection() {
  const { user } = useAuthStore()
  const initials =
    user?.name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('') ?? 'U'

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[15px] font-semibold text-ink tracking-[-0.2px]">Perfil</h2>
        <p className="text-[13px] text-ink-3 mt-0.5">Tu información personal y de cuenta.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center text-white text-lg font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-ink">{user?.name ?? '—'}</p>
          <p className="text-[13px] text-ink-3">{user?.email ?? '—'}</p>
        </div>
      </div>

      <div className="h-px bg-[rgba(0,0,0,0.06)]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre" value={user?.name ?? ''} readOnly />
        <Field label="Correo electrónico" value={user?.email ?? ''} readOnly />
        <Field label="Rol" value={user?.role ?? ''} readOnly />
        <Field label="ID de cuenta" value={user?.id ?? ''} readOnly />
      </div>

      <p className="text-[12px] text-ink-3 bg-zinc-50 border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-3">
        Los datos de perfil son gestionados por tu organización. Contacta a tu administrador para realizar cambios.
      </p>
    </div>
  )
}

function NotificacionesSection() {
  const [toggles, setToggles] = useState({
    vencimientos: true,
    pagos: true,
    mantencion: false,
    resumen: true,
  })

  const toggle = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  const items = [
    { key: 'vencimientos' as const, label: 'Vencimientos de contrato', desc: 'Aviso 30 días antes del término' },
    { key: 'pagos' as const, label: 'Pagos pendientes', desc: 'Recordatorio de arriendos sin registrar' },
    { key: 'mantencion' as const, label: 'Solicitudes de mantención', desc: 'Nueva solicitud de propietario o arrendatario' },
    { key: 'resumen' as const, label: 'Resumen semanal', desc: 'Informe por correo cada lunes' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[15px] font-semibold text-ink tracking-[-0.2px]">Notificaciones</h2>
        <p className="text-[13px] text-ink-3 mt-0.5">Configura qué alertas quieres recibir.</p>
      </div>

      <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.05)]">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <div>
              <p className="text-[13.5px] font-medium text-ink">{label}</p>
              <p className="text-[12.5px] text-ink-3 mt-0.5">{desc}</p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 cursor-pointer ${
                toggles[key] ? 'bg-ink' : 'bg-zinc-200'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  toggles[key] ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <button className="self-start bg-ink text-white rounded-full px-4 py-1.5 text-[13.5px] font-medium hover:bg-ink/90 transition-colors cursor-pointer">
        Guardar preferencias
      </button>
    </div>
  )
}

function PreferenciasSection() {
  const [moneda, setMoneda] = useState('CLP')
  const [formato, setFormato] = useState('DD/MM/YYYY')
  const [idioma, setIdioma] = useState('es-CL')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[15px] font-semibold text-ink tracking-[-0.2px]">Preferencias</h2>
        <p className="text-[13px] text-ink-3 mt-0.5">Ajusta cómo se presentan los datos en la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Moneda"
          value={moneda}
          onChange={setMoneda}
          options={[
            { value: 'CLP', label: 'CLP — Peso chileno' },
            { value: 'USD', label: 'USD — Dólar estadounidense' },
            { value: 'UF', label: 'UF — Unidad de Fomento' },
          ]}
        />
        <SelectField
          label="Formato de fecha"
          value={formato}
          onChange={setFormato}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
          ]}
        />
        <SelectField
          label="Idioma"
          value={idioma}
          onChange={setIdioma}
          options={[
            { value: 'es-CL', label: 'Español (Chile)' },
            { value: 'es-ES', label: 'Español (España)' },
            { value: 'en-US', label: 'English (US)' },
          ]}
        />
        <SelectField
          label="Zona horaria"
          value="America/Santiago"
          onChange={() => {}}
          options={[{ value: 'America/Santiago', label: 'America/Santiago (UTC−3)' }]}
        />
      </div>

      <button className="self-start bg-ink text-white rounded-full px-4 py-1.5 text-[13.5px] font-medium hover:bg-ink/90 transition-colors cursor-pointer">
        Guardar preferencias
      </button>
    </div>
  )
}

function SeguridadSection() {
  const [form, setForm] = useState({ actual: '', nueva: '', confirmar: '' })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[15px] font-semibold text-ink tracking-[-0.2px]">Seguridad</h2>
        <p className="text-[13px] text-ink-3 mt-0.5">Gestiona tu contraseña y sesión activa.</p>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[13px] font-medium text-ink">Cambiar contraseña</p>
        <div className="grid grid-cols-1 gap-3 max-w-sm">
          <Field
            label="Contraseña actual"
            value={form.actual}
            type="password"
            onChange={(v) => setForm((p) => ({ ...p, actual: v }))}
          />
          <Field
            label="Nueva contraseña"
            value={form.nueva}
            type="password"
            onChange={(v) => setForm((p) => ({ ...p, nueva: v }))}
          />
          <Field
            label="Confirmar nueva contraseña"
            value={form.confirmar}
            type="password"
            onChange={(v) => setForm((p) => ({ ...p, confirmar: v }))}
          />
        </div>
        <button className="self-start bg-ink text-white rounded-full px-4 py-1.5 text-[13.5px] font-medium hover:bg-ink/90 transition-colors cursor-pointer">
          Actualizar contraseña
        </button>
      </div>

      <div className="h-px bg-[rgba(0,0,0,0.06)]" />

      <div>
        <p className="text-[13px] font-medium text-ink mb-3">Sesión activa</p>
        <div className="flex items-center justify-between bg-zinc-50 border border-[rgba(0,0,0,0.06)] rounded-xl px-4 py-3">
          <div>
            <p className="text-[13px] font-medium text-ink">Este dispositivo</p>
            <p className="text-[12px] text-ink-3 mt-0.5">Navegador web · Activo ahora</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        </div>
      </div>
    </div>
  )
}

type HelpCategory = 'duda' | 'bug' | 'sugerencia' | 'otro'

const helpCategories: { id: HelpCategory; label: string }[] = [
  { id: 'duda', label: 'Duda' },
  { id: 'bug', label: 'Reportar error' },
  { id: 'sugerencia', label: 'Sugerencia' },
  { id: 'otro', label: 'Otro' },
]

const MAX_CHARS = 1000

function AyudaSection() {
  const [category, setCategory] = useState<HelpCategory>('duda')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const canSend = asunto.trim().length > 0 && mensaje.trim().length >= 10

  const handleSend = () => {
    if (!canSend) return
    setStatus('sent')
  }

  const handleReset = () => {
    setAsunto('')
    setMensaje('')
    setCategory('duda')
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={22} className="text-emerald-500" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-ink">Solicitud enviada</p>
          <p className="text-[13px] text-ink-3 mt-1 max-w-xs">
            Recibimos tu mensaje. El equipo de soporte te responderá por correo en las próximas 24 horas.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="mt-2 text-[13px] font-medium text-ink-3 hover:text-ink transition-colors cursor-pointer underline underline-offset-2"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[15px] font-semibold text-ink tracking-[-0.2px]">Ayuda</h2>
        <p className="text-[13px] text-ink-3 mt-0.5">Cuéntanos en qué podemos ayudarte.</p>
      </div>

      <div className="flex flex-col">
        <p className="text-[9.5px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1.5">Tipo de solicitud</p>
        <div className="flex flex-wrap gap-1.5">
          {helpCategories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`px-3 py-1 rounded-lg text-[11.5px] border transition-colors duration-150 cursor-pointer ${
                category === id
                  ? 'bg-ink text-white border-ink font-medium'
                  : 'bg-zinc-50 text-zinc-500 border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.15)] font-normal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label="Asunto"
        value={asunto}
        onChange={setAsunto}
      />

      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[9.5px] font-semibold text-zinc-400 tracking-[0.5px] uppercase">Descripción</label>
          <span className={`text-[10px] tabular-nums transition-colors ${mensaje.length > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-zinc-400'}`}>
            {mensaje.length}/{MAX_CHARS}
          </span>
        </div>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value.slice(0, MAX_CHARS))}
          placeholder="Describe tu solicitud con el mayor detalle posible…"
          rows={6}
          className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors resize-none"
        />
        {mensaje.trim().length > 0 && mensaje.trim().length < 10 && (
          <p className="text-[11px] text-zinc-400 mt-1">Agrega un poco más de detalle para poder ayudarte mejor.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-ink-3">
          Te responderemos al correo de tu cuenta.
        </p>
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-all cursor-pointer ${
            canSend
              ? 'bg-ink text-white hover:bg-ink/90'
              : 'bg-zinc-100 text-ink-3 cursor-not-allowed'
          }`}
        >
          <Send size={13} strokeWidth={2} />
          Enviar solicitud
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  readOnly = false,
  type = 'text',
  onChange,
}: {
  label: string
  value: string
  readOnly?: boolean
  type?: string
  onChange?: (v: string) => void
}) {
  return (
    <div className="flex flex-col">
      <label className="text-[9.5px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`h-8 px-3 rounded-lg bg-zinc-50 border border-[rgba(0,0,0,0.08)] text-[12px] text-ink placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors ${
          readOnly ? 'cursor-default text-zinc-400' : ''
        }`}
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex flex-col">
      <label className="text-[9.5px] font-semibold text-zinc-400 tracking-[0.5px] uppercase mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 appearance-none bg-zinc-50 border border-[rgba(0,0,0,0.08)] rounded-lg px-3 text-[12px] text-ink focus:outline-none focus:border-zinc-400 focus:bg-white transition-colors cursor-pointer pr-7"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronRight size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  )
}

const sectionComponents: Record<Section, React.ComponentType> = {
  perfil: PerfilSection,
  notificaciones: NotificacionesSection,
  preferencias: PreferenciasSection,
  seguridad: SeguridadSection,
  ayuda: AyudaSection,
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>('perfil')
  const ActiveSection = sectionComponents[active]

  return (
    <div className="px-4 md:px-8 xl:px-10 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-ink tracking-[-0.4px]">Configuración</h1>
        <p className="text-[13.5px] text-ink-3 mt-0.5">Gestiona tu cuenta y preferencias de la plataforma.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Nav lateral (desktop) / horizontal (mobile) */}
        <nav className="flex flex-row md:flex-col gap-1 md:w-48 shrink-0 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-colors duration-150 cursor-pointer whitespace-nowrap md:w-full text-left shrink-0 ${
                active === id
                  ? 'bg-ink text-white font-medium'
                  : 'text-ink-2 hover:bg-zinc-100 font-normal'
              }`}
            >
              <Icon size={14} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </nav>

        {/* Contenido */}
        <div className="flex-1 bg-white/80 rounded-2xl border border-[rgba(0,0,0,0.07)] shadow-sm p-5 md:p-6">
          <ActiveSection />
        </div>
      </div>
    </div>
  )
}
