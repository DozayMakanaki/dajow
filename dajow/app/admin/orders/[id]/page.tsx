"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getOrderById, updateOrderStatus, type Order } from "@/lib/firestore-orders"
import { ArrowLeft, Package, User, Mail, Phone, MapPin, Calendar, CreditCard, Truck, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!orderId) return

    console.log("🔍 Fetching order:", orderId)
    
    getOrderById(orderId)
      .then((data) => {
        console.log("✅ Order received:", data)
        // Ensure all numeric fields have safe defaults
        if (data) {
          data.subtotal = data.subtotal ?? 0
          data.shipping = data.shipping ?? 0
          data.tax = data.tax ?? 0
          data.total = data.total ?? 0
        }
        setOrder(data)
        setError(null)
      })
      .catch((err) => {
        console.error("❌ Error fetching order:", err)
        setError(err.message || "Failed to load order")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId])

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order?.id) return
    
    setUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      setOrder({ ...order, status: newStatus })
      console.log("✅ Order status updated:", newStatus)
    } catch (error) {
      console.error("❌ Error updating status:", error)
      alert("Failed to update order status")
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200"
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200"
      case "processing": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled": return "bg-red-100 text-red-700 border-red-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Order Not Found</h3>
          <p className="text-red-700 mb-4">{error || "The order you're looking for doesn't exist"}</p>
          <Button onClick={() => router.push('/admin/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <Button
          onClick={() => router.push("/admin/orders")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {order.createdAt?.toDate ? 
                  order.createdAt.toDate().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  : 'Recent'}
              </span>
            </div>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-3">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              disabled={updating}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize border-2 ${getStatusColor(order.status)} cursor-pointer disabled:opacity-50`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Order Items ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  {item.image && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity ?? 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: £{(item.price ?? 0).toFixed(2)} each
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      £{((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">£{(order.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {(order.shipping ?? 0) === 0 ? 'FREE' : `£${(order.shipping ?? 0).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (VAT 20%)</span>
                <span className="font-semibold">£{(order.tax ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">£{(order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Customer & Shipping Info */}
        <div className="space-y-6">
          
          {/* Customer Information */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Customer Details
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{order.userName || "Guest"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{order.userEmail}</p>
                </div>
              </div>

              {order.shippingAddress?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              Shipping Address
            </h2>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
              {order.shippingAddress?.address && (
                <p>{order.shippingAddress.address}</p>
              )}
              {order.shippingAddress?.city && (
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.postcode && `, ${order.shippingAddress.postcode}`}
                </p>
              )}
              {order.shippingAddress?.country && (
                <p>{order.shippingAddress.country}</p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Payment Details
            </h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium text-gray-900 capitalize">
                  {order.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-600" />
              Order Status
            </h2>

            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                order.status === 'pending' ? 'bg-gray-100' : 'bg-green-50'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  order.status === 'pending' ? 'bg-gray-400' : 'bg-green-600'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Order Placed</p>
                  <p className="text-xs text-gray-500">
                    {order.createdAt?.toDate?.()?.toLocaleString() || 'Recently'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                ['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-50' : 'bg-gray-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  ['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Processing</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                ['shipped', 'delivered'].includes(order.status) ? 'bg-green-50' : 'bg-gray-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  ['shipped', 'delivered'].includes(order.status) ? 'bg-green-600' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Shipped</p>
                </div>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                order.status === 'delivered' ? 'bg-green-50' : 'bg-gray-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">Delivered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs font-semibold text-blue-900 mb-2">🔍 Debug Info (Remove in production):</p>
        <div className="text-xs text-blue-800 space-y-1">
          <p>Order ID: {order.id}</p>
          <p>User ID: {order.userId}</p>
          <p>Order Number: {order.orderNumber}</p>
          <p>Created: {order.createdAt?.toDate?.()?.toISOString() || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
