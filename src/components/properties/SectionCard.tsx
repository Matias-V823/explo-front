export default function SectionCard({ id, number, title, children }: {
  id: string
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100">
        <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-400 text-[10px] font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <h2 className="text-[13px] font-bold text-ink tracking-[-0.2px]">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  )
}
