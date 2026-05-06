import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpInputProps {
  value: string[]
  onChange: (value: string[]) => void
  length?: number
  hasError?: boolean
  disabled?: boolean
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
  hasError = false,
  disabled = false,
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const next = [...value]
    next[index] = digit
    onChange(next)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const next = [...value]
        next[index] = ''
        onChange(next)
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    const next = Array(length).fill('')
    pasted.split('').forEach((char, i) => { next[i] = char })
    onChange(next)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 justify-between">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          autoComplete="one-time-code"
          className={[
            'flex-1 h-12 rounded-[10px] border text-center text-[20px] font-semibold text-ink',
            'focus:outline-none transition-all duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            hasError
              ? 'bg-red-50 border-red-300 text-red-600'
              : value[i]
                ? 'bg-zinc-100 border-[rgba(0,0,0,0.14)] focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10'
                : 'bg-zinc-50 border-[rgba(0,0,0,0.1)] focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
