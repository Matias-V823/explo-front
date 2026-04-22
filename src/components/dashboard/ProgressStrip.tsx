interface ProgressItem {
  label: string
  value: number
  variant?: 'dark' | 'yellow' | 'striped'
}

interface ProgressStripProps {
  items: ProgressItem[]
}

export default function ProgressStrip({ items }: ProgressStripProps) {
  return (
    <div className="flex items-end gap-2.5 md:gap-6">
      {items.map(({ label, value, variant = 'dark' }) => (
        <div key={label} className="flex flex-col gap-1 md:gap-1.5 w-20 md:w-auto md:min-w-30">
          <span className="text-[10px] md:text-xs text-ink-3 truncate">{label}</span>
          <div className="h-5 md:h-8 rounded-full bg-[rgba(0,0,0,0.07)] overflow-hidden relative">
            <div
              className={`absolute inset-y-0 left-0 rounded-full flex items-center justify-end pr-2 md:pr-2.5 transition-[width] duration-500 ease-out ${
                variant === 'yellow'
                  ? 'bg-gold'
                  : variant === 'striped'
                    ? 'bg-[repeating-linear-gradient(90deg,rgba(0,0,0,0.15)_0px,rgba(0,0,0,0.15)_4px,transparent_4px,transparent_8px)]'
                    : 'bg-ink'
              }`}
              style={{ width: `${Math.min(value, 100)}%` }}
            >
              <span className={`text-[10px] md:text-xs font-semibold whitespace-nowrap ${variant === 'dark' ? 'text-white' : 'text-ink'}`}>
                {value}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
