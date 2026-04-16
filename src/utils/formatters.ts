export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

// "YYYY-MM-DD" strings are interpreted as UTC midnight by the Date constructor.
// Appending T00:00:00 forces local-time parsing, avoiding the off-by-one-day
// bug that appears in timezones behind UTC (e.g. Chile UTC-3/UTC-4).
function parseDateLocal(dateStr: string): Date {
  return new Date(dateStr.length === 10 ? `${dateStr}T00:00:00` : dateStr)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
  }).format(parseDateLocal(dateStr))
}

export function getDaysUntil(dateStr: string): number {
  const target = parseDateLocal(dateStr)
  const today = new Date()
  const diff = target.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function formatMonthLabel(month: string): string {
  return month.slice(0, 3)
}

export function formatDateFull(dateStr: string): string {
  return parseDateLocal(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
}
