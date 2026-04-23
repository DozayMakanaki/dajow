"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { getUserOrders, type Order } from "@/lib/firestore-orders"
import Link from "next/link"
import { Package, Loader2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    console.log("🔍 Fetching orders for user:", user.uid)
    
    getUserOrders(user.uid)
      .then((data) => {
        console.log("✅ Orders received:", data)
        setOrders(data)
      })
      .catch((err) => {
        console.error("❌ Error fetching orders:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [user, router])

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/30 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push('/profile')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">No orders yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start shopping to see your orders here. Browse our collection and find something you love!
            </p>
            <Link href="/products">
              <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block bg-white rounded-2xl border p-6 hover:shadow-xl hover:border-orange-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-xl text-gray-900">
                      Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.createdAt?.toDate ? 
                        order.createdAt.toDate().toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'Recent'}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Product Images */}
                <div className="flex items-center gap-3 mb-5">
                  {order.items.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-gray-200">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.productName || "Product"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 5 && (
                    <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 border-2 border-gray-200">
                      <span className="text-sm font-bold text-gray-600">
                        +{order.items.length - 5}
                      </span>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="mb-5 space-y-1">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-700">
                      <span className="font-semibold">{item.quantity}x</span> {item.productName}
                      <span className="text-gray-500 ml-2">£{item.price.toFixed(2)} each</span>
                    </p>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500 font-medium">
                      and {order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}...
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-5 border-t">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Total</p>
                    <p className="text-2xl font-bold text-orange-600">
                      £{order.total.toFixed(2)}
                    </p>
                  </div>
                  <Button variant="outline" className="font-semibold">
                    View Receipt →
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
