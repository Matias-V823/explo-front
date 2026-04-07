import { useState, useEffect } from 'react'
import { fetchDashboardData } from '../api/dashboard'
import type { DashboardData } from '../types'

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData().then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [])

  return { data, loading }
}
