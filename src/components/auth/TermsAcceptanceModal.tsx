import { useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, ShieldCheck } from 'lucide-react'

interface Props {
  onAccept: () => void
}

export default function TermsAcceptanceModal({ onAccept }: Props) {
  const [accepted, setAccepted] = useState(false)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 pt-6 pb-5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
            <ShieldCheck size={18} strokeWidth={1.8} className="text-sky-500" />
          </div>

          <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px] mb-1">
            Términos y protección de datos
          </h2>
          <p className="text-[12.5px] text-zinc-500 leading-[1.55]">
            Antes de continuar, revisa y acepta nuestras políticas. Puedes leer cada
            documento antes de dar tu consentimiento.
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between h-9 px-3.5 rounded-[10px] border border-zinc-200 hover:bg-zinc-50 transition-colors group"
            >
              <span className="text-[12.5px] font-medium text-ink">
                Políticas de privacidad
              </span>
              <ExternalLink size={13} className="text-zinc-400 group-hover:text-ink transition-colors" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between h-9 px-3.5 rounded-[10px] border border-zinc-200 hover:bg-zinc-50 transition-colors group"
            >
              <span className="text-[12.5px] font-medium text-ink">
                Términos y condiciones de uso
              </span>
              <ExternalLink size={13} className="text-zinc-400 group-hover:text-ink transition-colors" />
            </a>
          </div>

          <label className="mt-5 flex items-start gap-3 cursor-pointer select-none">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-4 h-4 rounded-[5px] border-2 border-zinc-300 peer-checked:bg-ink peer-checked:border-ink transition-colors flex items-center justify-center">
                {accepted && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-[12.5px] text-zinc-600 leading-[1.55]">
              Autorizo el uso de mis datos personales según las políticas de privacidad y
              acepto los términos y condiciones de la aplicación. Comprendo cómo se
              almacena y protege mi información.
            </span>
          </label>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={onAccept}
            disabled={!accepted}
            className="w-full h-10 rounded-[10px] bg-ink text-white text-[13.5px] font-medium hover:bg-zinc-800 active:bg-zinc-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Continuar al inicio
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
