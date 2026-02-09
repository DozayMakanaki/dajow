"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { Package, Clock, CheckCircle, XCircle, TruckIcon, Eye } from "lucide-react"
import { motion } from "framer-motion"

interface Order {
  id: string
  items: any[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: any
  shippingAddress: string
}

const statusConfig = {
  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", label: "Pending" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", label: "Processing" },
  shipped: { icon: TruckIcon, color: "text-purple-600", bg: "bg-purple-50", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
}

export default function ProfileOrders({ userId, onStatsUpdate }: { userId: string; onStatsUpdate?: (stats: any) => void }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    loadOrders()
  }, [userId])

  async function loadOrders() {
    try {
      const ordersRef = collection(db, "orders")
      const q = query(
        ordersRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      )
      
      const snapshot = await getDocs(q)
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]

      setOrders(ordersList)

      // Update stats
      if (onStatsUpdate) {
        const totalSpent = ordersList
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.total, 0)
        
        onStatsUpdate({
          totalOrders: ordersList.length,
          totalSpent
        })
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter)

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order History</h2>
        <p className="text-sm text-gray-500">Track and manage your orders</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <FilterButton
          label="All Orders"
          count={orders.length}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterButton
          label="Pending"
          count={orders.filter(o => o.status === "pending").length}
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        />
        <FilterButton
          label="Processing"
          count={orders.filter(o => o.status === "processing").length}
          active={filter === "processing"}
          onClick={() => setFilter("processing")}
        />
        <FilterButton
          label="Delivered"
          count={orders.filter(o => o.status === "delivered").length}
          active={filter === "delivered"}
          onClick={() => setFilter("delivered")}
        />
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {filter === "all" 
              ? "You haven't placed any orders yet" 
              : `No ${filter} orders`}
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const StatusIcon = statusConfig[order.status].icon
            const date = order.createdAt?.toDate 
              ? order.createdAt.toDate().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              : 'Recent'

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono font-semibold text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-sm">{date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-orange-600">₦{order.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig[order.status].bg}`}>
                      <StatusIcon className={`h-4 w-4 ${statusConfig[order.status].color}`} />
                      <span className={`text-sm font-semibold ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 space-y-3">
                  {order.items.slice(0, 2).map((item, idx) => {
                    const imageUrl = item.image && item.image.trim() !== "" 
                      ? item.image 
                      : "/placeholder.png"

                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    )
                  })}

                  {order.items.length > 2 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Ship to: {order.shippingAddress || "Default address"}
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FilterButton({ label, count, active, onClick }: { 
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
        active
          ? "bg-orange-600 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label} {count > 0 && `(${count})`}
    </button>
  )
}
