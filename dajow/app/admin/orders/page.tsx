// /app/admin/orders/page.tsx

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllOrders, updateOrderStatus, type Order } from "@/lib/firestore-orders"
import { Package, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | Order['status']>("all")

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter)

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    await updateOrderStatus(orderId, newStatus)
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ))
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700"
      case "shipped": return "bg-blue-100 text-blue-700"
      case "processing": return "bg-yellow-100 text-yellow-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Order</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-orange-600 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {order.userName || order.userEmail}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                    £{order.total.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id!, e.target.value as Order['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)} border-0 cursor-pointer`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}