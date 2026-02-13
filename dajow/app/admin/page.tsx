"use client"

import { useEffect, useState } from "react"
import { getDashboardStats, getOrders, getRevenueByDate } from "@/lib/firestore-admin"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { ShoppingCart, DollarSign, Package, Clock, TrendingUp, Archive, TrendingDown, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  pendingOrders: number
  deliveredOrders: number
  processingOrders: number
  totalStock: number
  sold: number
}

interface RevenueData {
  date: string
  revenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getOrders(50),
      getRevenueByDate(30)
    ]).then(([statsData, ordersData, revenueChartData]) => {
      setStats(statsData)
      setOrders(ordersData)
      setRevenueData(revenueChartData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-4 md:p-5 rounded-xl shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    )
  }

  if (!stats) return null

  const last7Days = revenueData.slice(-7)
  const previous7Days = revenueData.slice(-14, -7)
  const last7DaysRevenue = last7Days.reduce((sum, item) => sum + item.revenue, 0)
  const previous7DaysRevenue = previous7Days.reduce((sum, item) => sum + item.revenue, 0)
  const revenueChange = previous7DaysRevenue > 0
    ? ((last7DaysRevenue - previous7DaysRevenue) / previous7DaysRevenue * 100).toFixed(1)
    : 0
  const isRevenueUp = Number(revenueChange) >= 0

  const statItems = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: null
    },
    {
      title: "Total Revenue",
      value: `£${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: revenueChange,
      changePositive: isRevenueUp
    },
    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      change: null
    },
    {
      title: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      change: null
    },
    {
      title: "Stock Items",
      value: stats.totalStock,
      icon: Archive,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      change: null
    },
    {
      title: "Items Sold",
      value: stats.sold,
      icon: TrendingUp,
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      change: null
    },
  ]

  const chartData = revenueData.slice(-14)

  return (
    <div className="space-y-6 md:space-y-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">
          Welcome back! Here's your store overview for the last 30 days.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
        {statItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Stat
                title={item.title}
                value={item.value}
                icon={Icon}
                bgColor={item.bgColor}
                textColor={item.textColor}
                change={item.change}
                changePositive={item.changePositive}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">Revenue Overview</h3>
            <p className="text-sm text-gray-500 mt-1">Last 14 days performance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-orange-600 rounded-full" />
              <span className="text-gray-600">Daily Revenue</span>
            </div>
            {isRevenueUp ? (
              <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4" />
                +{revenueChange}%
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 text-sm font-semibold bg-red-50 px-3 py-1 rounded-full">
                <TrendingDown className="h-4 w-4" />
                {revenueChange}%
              </div>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} minWidth={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    value >= 1000 ? `£${(value / 1000).toFixed(0)}k` : `£${value}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    fontSize: "14px",
                    padding: "12px",
                  }}
                  formatter={(value: any) => [`£${value.toLocaleString()}`, "Revenue"]}
                  labelStyle={{ fontWeight: "bold", marginBottom: "8px" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#ea580c"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No revenue data yet</p>
                <p className="text-sm mt-1">Orders will appear here once placed</p>
              </div>
            </div>
          )}
        </div>

        {/* Summary Stats Below Chart */}
        {chartData.length > 0 && (
          <div className="mt-6 pt-4 border-t grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">
                £{revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Average Daily</p>
              <p className="text-lg font-bold text-gray-900">
                £{Math.round(revenueData.reduce((sum, item) => sum + item.revenue, 0) / revenueData.length).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Highest Day</p>
              <p className="text-lg font-bold text-gray-900">
                £{Math.max(...revenueData.map((item) => item.revenue)).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Order Status Breakdown */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Order Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <ShoppingCart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl md:text-3xl font-bold text-orange-600">{orders.length}</p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.deliveredOrders}</p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Delivered</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{stats.processingOrders}</p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Processing</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-medium">Pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  title,
  value,
  icon: Icon,
  bgColor,
  textColor,
  change,
  changePositive,
}: {
  title: string
  value: string | number
  icon: any
  bgColor: string
  textColor: string
  change?: string | number | null
  changePositive?: boolean
}) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className={`${bgColor} p-2 md:p-2.5 rounded-lg`}>
          <Icon className={`h-4 w-4 md:h-5 md:w-5 ${textColor}`} />
        </div>
        {change !== null && change !== undefined && (
          <div className={`text-xs font-semibold ${changePositive ? "text-green-600" : "text-red-600"}`}>
            {changePositive ? "+" : ""}{change}%
          </div>
        )}
      </div>
      <p className="text-xs md:text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">{value}</p>
    </div>
  )
}
