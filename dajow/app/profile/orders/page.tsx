// /app/profile/orders/page.tsx

"use client"

import { Key, useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getUserOrders, type Order } from "@/lib/firestore-orders"
import Link from "next/link"
import { Package, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    
    getUserOrders(user.uid)
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
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

  const formatDate = (createdAt: any) => {
    if (createdAt && typeof createdAt.toDate === "function") {
      return createdAt.toDate().toLocaleDateString()
    }
    return "Recent"
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Number(amount || 0))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {order.items.slice(0, 3).map((item: { image?: string; productName?: string }, idx: Key) => (
                    <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName || "Product"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{order.items.length - 3} more
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}