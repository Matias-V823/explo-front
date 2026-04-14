import { useDashboardData } from '../store/dashboardStore'
import { getGreeting } from '../utils/formatters'
import UserProfile from '../components/dashboard/UserProfile'
import RevenueChart from '../components/dashboard/RevenueChart'
import PropertyStatusChart from '../components/dashboard/PropertyStatusChart'
import TaskList from '../components/dashboard/TaskList'
import WeekCalendar from '../components/dashboard/WeekCalendar'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import ProgressStrip from '../components/dashboard/ProgressStrip'
import KpiStats from '../components/dashboard/KpiStats'

const progressItems = [
  { label: 'Ocupación', value: 86, variant: 'dark' as const },
  { label: 'Boletas al día', value: 90, variant: 'yellow' as const },
  { label: 'Meta mensual', value: 115, variant: 'yellow' as const },
  { label: 'Cobros recibidos', value: 72, variant: 'striped' as const },
]

export default function HomePage() {
  const { data, loading } = useDashboardData()

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-ink-4">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="px-10 pt-9 pb-10 max-w-360 mx-auto w-full">

      <div className="flex justify-between items-end mb-7 flex-wrap gap-6">
        <div>
          <h1 className="text-[42px] font-extrabold text-ink tracking-[-1.5px] leading-[1.1] mb-5">
            {getGreeting()}, {data.user.name.split(' ')[0]}
          </h1>
          <ProgressStrip items={progressItems} />
        </div>
        <KpiStats />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[360px_1fr_1fr_260px] grid-rows-[auto_auto] gap-4">
        <div className="col-start-1 row-start-1 min-h-70">
          <UserProfile user={data.user} monthlyIncome={18_450_000} />
        </div>

        <div className="col-start-2 row-start-1 min-h-70">
          <RevenueChart weeklyActivity={data.weeklyActivity} />
        </div>

        <div className="col-start-3 row-start-1 min-h-70">
          <PropertyStatusChart properties={data.properties} />
        </div>

        <div className="col-start-4 row-start-1 row-span-2">
          <TaskList alerts={data.alerts} />
        </div>

        <div className="col-start-1 row-start-2 min-h-70">
          <ActivityFeed />
        </div>

        <div className="col-start-2 col-span-2 row-start-2 min-h-70">
          <WeekCalendar events={data.calendarEvents} />
        </div>
      </div>
    </div>
  )
}
