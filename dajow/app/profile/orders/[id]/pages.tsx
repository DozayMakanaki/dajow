// /app/profile/orders/[id]/page.tsx

"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getOrderById, type Order } from "@/lib/firestore-orders"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => router.push('/profile/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header - Hidden when printing */}
        <div className="mb-8 print:hidden">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Receipt</h1>
              <p className="text-gray-600 mt-2">Order #{order.orderNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>

        {/* Invoice/Receipt - Prints nicely */}
        <div className="bg-white rounded-xl border shadow-sm p-8 print:shadow-none print:border-none">
          
          {/* Header */}
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">DAJOW STORE</h2>
                <p className="text-sm text-gray-600 mt-1">Invoice / Receipt</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">Order Number</p>
                <p className="text-lg font-bold text-orange-600">{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                </p>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
              <p className="text-sm text-gray-600">{order.userName || order.userEmail}</p>
              <p className="text-sm text-gray-600">{order.userEmail}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.postcode}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
              <p className="text-sm text-gray-600 mt-1">Tel: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0 print:hidden">
                              <img
                                src={item.image}
                                alt={String(item.productName)}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {item.productName}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-sm text-gray-600">
                        £{item.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-right text-sm font-semibold text-gray-900">
                        £{(item.price * (typeof item.quantity === 'number' ? item.quantity : 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">£{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shipping === 0 ? 'FREE' : `£${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (VAT 20%)</span>
                  <span className="font-medium">£{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-orange-600">£{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Payment Info */}
          <div className="mt-8 pt-6 border-t">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Order Status</p>
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium capitalize">
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Payment Method</p>
                <p className="text-sm text-gray-600 capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Payment Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
            <p>Thank you for your purchase!</p>
            <p className="mt-1">For questions, contact us at support@dajow.com</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}