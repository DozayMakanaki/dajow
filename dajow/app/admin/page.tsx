"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getOrders } from "@/lib/firestore-admin"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    getDashboardStats().then(setStats)
    getOrders().then(setOrders)
  }, [])

  if (!stats) return null

  const chartData = orders.map(o => ({
    date: new Date(o.createdAt.seconds * 1000).toLocaleDateString(),
    total: o.total
  }))

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Stat title="Orders" value={stats.totalOrders} />
        <Stat title="Revenue" value={`₦${stats.totalRevenue.toLocaleString()}`} />
        <Stat title="Products" value={stats.totalProducts} />
        <Stat title="Pending" value={stats.pendingOrders} />
        <Stat title="Stock Left" value={stats.totalStock} />
<Stat title="Sold Items" value={stats.sold} />

        
      </div>

      {/* GRAPH */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">Orders Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
