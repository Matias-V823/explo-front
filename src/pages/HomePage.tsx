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
    <div className="px-4 md:px-6 xl:px-10 pt-5 md:pt-7 xl:pt-9 pb-6 xl:pb-10 max-w-360 mx-auto w-full">

      <div className="flex justify-between items-end mb-5 xl:mb-7 flex-wrap gap-4 xl:gap-6">
        <div>
          <h1 className="text-[28px] md:text-[36px] xl:text-[42px] font-extrabold text-ink tracking-[-1.5px] leading-[1.1] mb-4 xl:mb-5">
            {getGreeting()}, {data.user.name.split(' ')[0]}
          </h1>
          <ProgressStrip items={data.progressItems} />
        </div>
        <KpiStats {...data.kpiStats} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[360px_1fr_1fr_260px] xl:grid-rows-[auto_auto] gap-4">
        <div className="min-h-64 md:min-h-72 xl:col-start-1 xl:row-start-1">
          <UserProfile user={data.user}/>
        </div>

        <div className="min-h-64 md:min-h-72 xl:col-start-2 xl:row-start-1">
          <RevenueChart revenueStats={data.revenueStats} />
        </div>

        <div className="min-h-64 md:min-h-72 xl:col-start-3 xl:row-start-1">
          <PropertyStatusChart propertyStats={data.propertyStats} revenueStats={data.revenueStats} />
        </div>

        <div className="min-h-64 md:min-h-80 xl:min-h-0 xl:col-start-4 xl:row-start-1 xl:row-span-2">
          <TaskList />
        </div>

        <div className="min-h-64 md:col-span-2 lg:col-span-1 md:min-h-72 xl:col-start-1 xl:row-start-2">
          <ActivityFeed />
        </div>

        <div className="min-h-64 md:col-span-2 lg:col-span-1 md:min-h-72 xl:col-span-2 xl:col-start-2 xl:row-start-2">
          <WeekCalendar />
        </div>
      </div>
    </div>
  )
}
