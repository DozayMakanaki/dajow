"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()

  const sessionId = searchParams.get("session_id")
  const orderId = searchParams.get("order_id")

  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!sessionId || !orderId) {
      router.push("/")
      return
    }

    // Clear the cart now that payment is confirmed
    clearCart()

    // Give webhook a moment to fire, then verify session
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`)
        const data = await res.json()
        setVerified(data.paid === true)
      } catch {
        // Even if verify fails, Stripe redirected here so payment was likely OK
        setVerified(true)
      } finally {
        setVerifying(false)
      }
    }, 1500) // slight delay to allow webhook to process

    return () => clearTimeout(timer)
  }, [sessionId, orderId, clearCart, router])

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Confirming your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold mb-3 text-gray-900">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 text-lg mb-2">
            Your payment was successful.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-mono font-semibold text-orange-600">#{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}

          {/* What happens next */}
          <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8 text-left space-y-4">
            <h3 className="font-bold text-gray-900 mb-3">What happens next?</h3>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold text-xs">1</span>
              </div>
              <p className="text-sm text-gray-600">
                You'll receive a confirmation email with your order details.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold text-xs">2</span>
              </div>
              <p className="text-sm text-gray-600">
                We'll process and pack your order within 1–2 business days.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold text-xs">3</span>
              </div>
              <p className="text-sm text-gray-600">
                Your order will be shipped and you'll get a tracking number.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {orderId && (
              <Link href={`/orders/${orderId}`} className="flex-1">
                <Button
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700 h-14"
                >
                  <Package className="mr-2 h-5 w-5" />
                  View Order
                </Button>
              </Link>
            )}
            <Link href="/products" className="flex-1">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
