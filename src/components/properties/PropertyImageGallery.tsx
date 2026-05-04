import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Props {
  images: string[]
  name: string
  valueUF: number
  badgeLabel: string
  badgeClass: string
  onBack: () => void
}

export default function PropertyImageGallery({ images, name, valueUF, badgeLabel, badgeClass, onBack }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className="relative rounded-3xl overflow-hidden h-[50vh] md:h-[60vh] xl:h-[78vh] shadow-xl">

      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${i === activeIdx ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

      <button
        onClick={onBack}
        className="absolute top-5 left-5 w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/20 hover:bg-white/30 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={2} />
      </button>

      <div className="absolute top-5 right-5">
        <span className={`text-[11.5px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm ${badgeClass}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="absolute bottom-7 left-7">
        <p className="text-[11px] font-medium text-white/60 mb-1 uppercase tracking-[0.6px]">Valor</p>
        <p className="text-[32px] md:text-[44px] font-extrabold text-white tracking-[-2px] leading-none">
          {valueUF.toLocaleString('es-CL')}
          <span className="text-[16px] md:text-[20px] font-medium ml-2 tracking-[-0.5px] text-white/75">UF</span>
        </p>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 items-end">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative w-14 h-10 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${i === activeIdx
                  ? 'ring-2 ring-white ring-offset-1 ring-offset-black/30 scale-105'
                  : 'opacity-50 hover:opacity-80 hover:scale-105'
                }`}
            >
              <img src={src} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
              {i === activeIdx && (
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
