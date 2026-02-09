"use client"

import { useEffect, useState } from "react"
import { getSalesAnalytics } from "@/lib/analytics"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getSalesAnalytics().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-8">
      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Stat title="Weekly Revenue" value={`₦${data.weeklyRevenue.toLocaleString()}`} />
        <Stat title="Monthly Revenue" value={`₦${data.monthlyRevenue.toLocaleString()}`} />
        <Stat title="Weekly Orders" value={data.weeklyOrders} />
        <Stat title="Monthly Orders" value={data.monthlyOrders} />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data.chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line dataKey="total" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
