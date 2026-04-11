import { Phone, Mail } from 'lucide-react'

interface Props {
  person: { name: string; email: string; phone: string }
  role: 'owner' | 'tenant'
  roleLabel: string
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function PropertyPersonCard({ person, role, roleLabel }: Props) {
  const isOwner = role === 'owner'

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className={`h-1 w-full ${isOwner ? 'bg-ink' : 'bg-sky'}`} />
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold tracking-tight
            ${isOwner ? 'bg-ink text-white' : 'bg-sky/15 text-sky'}`}
          >
            {initials(person.name)}
          </div>
          <div className="min-w-0">
            <span className={`text-[10px] font-bold uppercase tracking-[0.7px] ${isOwner ? 'text-zinc-400' : 'text-sky'}`}>
              {roleLabel}
            </span>
            <p className="text-[13.5px] font-semibold text-ink tracking-[-0.2px] leading-tight truncate">
              {person.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col text-[10px] mb-3 gap-0.5">
          <p className="text-zinc-400 truncate pl-0.5">{person.email}</p>
          <p className="text-zinc-400 truncate pl-0.5">{person.phone}</p>
        </div>

        <div className="flex gap-2">
          <a
            href={`tel:${person.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-[11px] font-medium text-ink-3 hover:text-ink"
          >
            <Phone size={11} strokeWidth={1.8} />
            Llamar
          </a>
          <a
            href={`mailto:${person.email}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-[11px] font-medium text-ink-3 hover:text-ink"
          >
            <Mail size={11} strokeWidth={1.8} />
            Correo
          </a>
        </div>
      </div>
    </div>
  )
}
