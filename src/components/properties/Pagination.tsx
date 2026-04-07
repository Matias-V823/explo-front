import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  pageSize: number
  onPage: (page: number) => void
}

export default function Pagination({ page, totalPages, total, pageSize, onPage }: PaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-[12px] text-ink-3">
        Mostrando <span className="font-medium text-ink">{from}–{to}</span> de{' '}
        <span className="font-medium text-ink">{total}</span> propiedades
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white/70 text-ink-3 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-white hover:not-disabled:text-ink transition-colors"
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </button>

        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
              p === page
                ? 'bg-ink text-white border border-ink'
                : 'border border-zinc-200 bg-white/70 text-ink-3 hover:bg-white hover:text-ink'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 bg-white/70 text-ink-3 disabled:opacity-30 disabled:cursor-not-allowed hover:not-disabled:bg-white hover:not-disabled:text-ink transition-colors"
        >
          <ChevronRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
