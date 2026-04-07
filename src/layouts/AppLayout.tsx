import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-zinc-300 via-zinc-100 via-50% to-sky-300">
      <Topbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
