"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { getOrderById, type Order } from "@/lib/firestore-orders"
import { ArrowLeft, Printer, Download, Loader2, AlertCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function OrderReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!orderId) return

    console.log("🔍 Fetching order:", orderId)
    
    getOrderById(orderId)
      .then((data) => {
        console.log("✅ Order received:", data)
        
        // Verify this order belongs to the user
        if (data && data.userId !== user.uid) {
          setError("You don't have permission to view this order")
          return
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
  }, [orderId, user, router])

  const handlePrint = () => {
    window.print()
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/30 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/30 to-white">
        <div className="text-center bg-white p-12 rounded-2xl border shadow-lg max-w-md">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-900 mb-3">Order Not Found</h3>
          <p className="text-red-700 mb-6">{error || "The order you're looking for doesn't exist"}</p>
          <Button onClick={() => router.push('/profile/orders')} className="bg-orange-600 hover:bg-orange-700">
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header - Hidden when printing */}
        <div className="mb-8 print:hidden">
          <Button
            onClick={() => router.push('/profile/orders')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Receipt</h1>
              <p className="text-gray-600 mt-2">
                Order #{order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice/Receipt Card */}
        <div className="bg-white rounded-2xl border shadow-lg p-8 md:p-12 print:shadow-none print:border-none">
          
          {/* Header */}
          <div className="border-b-2 border-gray-200 pb-8 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">DAJOW STORE</h2>
                <p className="text-sm text-gray-600">Invoice / Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700 mb-1">Order Number</p>
                <p className="text-2xl font-bold text-orange-600">
                  {order.orderNumber || order.id?.substring(0, 8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {order.createdAt?.toDate ? 
                    order.createdAt.toDate().toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })
                    : 'Recent'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-gray-900">{order.userName || "Guest"}</p>
                <p className="text-gray-600">{order.userEmail}</p>
                {order.shippingAddress?.phone && (
                  <p className="text-gray-600">Tel: {order.shippingAddress.phone}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">Shipping Address</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
                {order.shippingAddress?.address && <p>{order.shippingAddress.address}</p>}
                {order.shippingAddress?.city && (
                  <p>
                    {order.shippingAddress.city}
                    {order.shippingAddress.postcode && `, ${order.shippingAddress.postcode}`}
                  </p>
                )}
                {order.shippingAddress?.country && <p>{order.shippingAddress.country}</p>}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Order Items</h3>
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-center py-4 px-3 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-4 px-3 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 print:hidden">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-3 text-right text-sm text-gray-600">
                        £{item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-200 pt-6 mb-8">
            <div className="flex justify-end">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-900">£{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {order.shipping === 0 ? 'FREE' : `£${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-200 pt-3 mt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">£{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Payment Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Order Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
                <p className="text-sm text-gray-900 capitalize font-medium">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Payment Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                  order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t-2 border-gray-200 text-center">
            <p className="text-gray-900 font-semibold mb-2">Thank you for your purchase!</p>
            <p className="text-sm text-gray-600">
              For questions or support, contact us at <a href="mailto:aloziemaureen89@gmail.com" className="text-orange-600 hover:underline">aloziemaureen89@gmail.com</a>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Or call us at <a href="tel:+447704335223" className="text-orange-600 hover:underline">+44 7704 335223</a>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true' && (
          <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center print:hidden">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-2">Order Placed Successfully! 🎉</h3>
            <p className="text-green-700">
              We've received your order and will process it shortly. You'll receive updates via email.
            </p>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  )
}
