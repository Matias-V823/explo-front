
export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export function toDateISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * Returns an array of `count` consecutive dates starting from the Monday
 * of the week containing `date`.
 *
 * @param date  Any date within the desired week.
 * @param count Number of days to return (default 7 = Mon–Sun, use 6 for Mon–Sat).
 */
export function getWeekDays(date: Date, count = 7): Date[] {
  const monday = getMonday(date)
  return Array.from({ length: count }, (_, i) => addDays(monday, i))
}

export function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6)
  const start = monday.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  const end = sunday.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${start} – ${end}`
}
