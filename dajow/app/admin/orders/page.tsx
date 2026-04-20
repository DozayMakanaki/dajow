"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllOrders, updateOrderStatus, type Order } from "@/lib/firestore-orders"
import { Package, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | Order['status']>("all")

  useEffect(() => {
    console.log("🔍 Fetching orders...")
    
    getAllOrders()
      .then((data) => {
        console.log("✅ Orders received:", data)
        console.log("📊 Number of orders:", data.length)
        
        if (data.length > 0) {
          console.log("📝 First order sample:", data[0])
        }
        
        setOrders(data)
        setError(null)
      })
      .catch((err) => {
        console.error("❌ Error fetching orders:", err)
        setError(err.message || "Failed to load orders")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(o => o.status === filter)

  async function handleStatusChange(orderId: string, newStatus: Order['status']) {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
      console.log("✅ Order status updated:", orderId, newStatus)
    } catch (error) {
      console.error("❌ Error updating status:", error)
      alert("Failed to update order status")
    }
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
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
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

      {/* Debug Info - Remove after testing */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2">🔍 Debug Info:</p>
        <p className="text-xs text-blue-800">Total orders in database: {orders.length}</p>
        <p className="text-xs text-blue-800">Filtered orders shown: {filteredOrders.length}</p>
        {orders.length === 0 && (
          <p className="text-xs text-blue-800 mt-2">
            ⚠️ No orders found. This means either:
            <br />1. No orders have been created yet
            <br />2. Firestore permissions are blocking reads
            <br />3. Collection name doesn't match (check if it's "orders")
          </p>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">
            {orders.length === 0 ? "No orders yet" : "No orders match filter"}
          </h3>
          <p className="text-gray-500 mb-6">
            {orders.length === 0 
              ? "Orders will appear here once customers make purchases"
              : "Try selecting a different filter"}
          </p>
          
          {/* Test Order Button */}
          {orders.length === 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">
                Want to test? Make a purchase from the store to see orders here.
              </p>
              <Link href="/products">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Go to Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
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
                        {order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium">{order.userName || "Guest"}</p>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {order.createdAt?.toDate ? 
                        order.createdAt.toDate().toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                        : 'Recent'}
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                      £{order.total?.toFixed(2) || '0.00'}
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
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
