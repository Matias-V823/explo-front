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
    <div className="px-4 md:px-6 lg:px-10 pt-5 md:pt-9 pb-6 md:pb-10 max-w-360 mx-auto w-full">

      <div className="flex justify-between items-end mb-5 md:mb-7 flex-wrap gap-4 md:gap-6">
        <div>
          <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-extrabold text-ink tracking-[-1.5px] leading-[1.1] mb-4 md:mb-5">
            {getGreeting()}, {data.user.name.split(' ')[0]}
          </h1>
          <ProgressStrip items={data.progressItems} />
        </div>
        <KpiStats {...data.kpiStats} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[360px_1fr_1fr_260px] lg:grid-rows-[auto_auto] gap-4">
        <div className="lg:col-start-1 lg:row-start-1 min-h-64 md:min-h-70">
          <UserProfile user={data.user}/>
        </div>

        <div className="lg:col-start-2 lg:row-start-1 min-h-64 md:min-h-70">
          <RevenueChart revenueStats={data.revenueStats} />
        </div>

        <div className="lg:col-start-3 lg:row-start-1 min-h-64 md:min-h-70">
          <PropertyStatusChart propertyStats={data.propertyStats} revenueStats={data.revenueStats} />
        </div>

        <div className="md:col-span-1 lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:row-span-2 min-h-64 md:min-h-80 lg:min-h-0">
          <TaskList alerts={data.alerts} />
        </div>

        <div className="md:col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-2 min-h-64 md:min-h-70">
          <ActivityFeed />
        </div>

        <div className="md:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-2 min-h-64 md:min-h-70">
          <WeekCalendar />
        </div>
      </div>
    </div>
  )
}
