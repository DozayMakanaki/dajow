import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore"
import { db } from "./firebase"

function startOfWeek(date: Date) {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export async function getSalesAnalytics() {
  const ordersSnap = await getDocs(
    query(
      collection(db, "orders"),
      where("status", "in", ["paid", "shipped"])
    )
  )

  const now = new Date()
  const weekStart = startOfWeek(now)
  const monthStart = startOfMonth(now)

  let weeklyRevenue = 0
  let monthlyRevenue = 0
  let weeklyOrders = 0
  let monthlyOrders = 0

  const chartMap: Record<string, number> = {}

  ordersSnap.forEach(doc => {
    const order = doc.data()
    if (!order.createdAt) return

    const date = order.createdAt.toDate()
    const day = date.toLocaleDateString()

    chartMap[day] = (chartMap[day] || 0) + order.total

    if (date >= weekStart) {
      weeklyRevenue += order.total
      weeklyOrders++
    }

    if (date >= monthStart) {
      monthlyRevenue += order.total
      monthlyOrders++
    }
  })

  const chartData = Object.entries(chartMap).map(([date, total]) => ({
    date,
    total
  }))

  return {
    weeklyRevenue,
    monthlyRevenue,
    weeklyOrders,
    monthlyOrders,
    chartData
  }
}
