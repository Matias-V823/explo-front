import { FileText } from 'lucide-react'
import type { PropertyDocument } from '../../types/properties'
import { formatDateFull } from '../../utils/formatters'

const DOC_LABEL: Record<string, string> = {
  contrato: 'Contrato', escritura: 'Escritura',
  boleta: 'Boleta', certificado: 'Certificado', otro: 'Otro',
}

export default function PropertyDocumentList({ documents }: { documents: PropertyDocument[] }) {
  if (documents.length === 0) return null

  return (
    <>
      <div className="border-t border-zinc-100 my-5" />
      <h2 className="text-[15px] font-bold text-ink tracking-[-0.3px] mb-3">Documentos</h2>
      <div>
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                <FileText size={12} strokeWidth={1.8} className="text-ink-3" />
              </div>
              <span className="text-[12.5px] font-medium text-ink">{doc.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                {DOC_LABEL[doc.type]}
              </span>
              <span className="text-[11px] text-zinc-400">{formatDateFull(doc.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
