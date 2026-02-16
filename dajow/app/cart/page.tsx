"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/store/cart-store"
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, MapPin,
  Phone, User, Mail, CreditCard, MessageCircle, ShieldCheck, RotateCcw, Lock,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { createOrder } from "@/lib/create-order"

type PaymentMethod = "stripe" | "whatsapp"
type CheckoutStep = "cart" | "details" | "payment"

interface ShippingDetails {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, addItem, decreaseItem, removeItem, clearCart } = useCartStore()

  const [step, setStep] = useState<CheckoutStep>("cart")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("whatsapp")
  const [loading, setLoading] = useState(false)
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const handleUpdateField = (field: keyof ShippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }))
  }

  const isDetailsValid = () =>
    !!(
      shippingDetails.fullName.trim() &&
      shippingDetails.email.trim() &&
      shippingDetails.phone.trim() &&
      shippingDetails.address.trim() &&
      shippingDetails.city.trim() &&
      shippingDetails.state.trim()
    )

  const handleProceedToDetails = () => {
    if (items.length === 0) return
    setStep("details")
  }

  const handleProceedToPayment = () => {
    if (!isDetailsValid()) {
      alert("Please fill in all required fields")
      return
    }
    setStep("payment")
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!isDetailsValid()) {
      alert("Please fill in all shipping details")
      return
    }

    setLoading(true)

    try {
      const shippingAddressString = `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.postalCode}`

      // Create the order in Firestore first (status: "pending")
      const orderId = await createOrder({
        userId: user.uid,
        email: shippingDetails.email,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        total,
        shippingAddress: {
          name: shippingDetails.fullName,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
        },
      })

      // ─────────────────────────────────────
      // 💳 STRIPE PAYMENT
      // ─────────────────────────────────────
      if (paymentMethod === "stripe") {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            orderId,
            customerEmail: shippingDetails.email,
          }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to create Stripe session")
        }

        const { url } = await res.json()

        if (!url) {
          throw new Error("No Stripe checkout URL returned")
        }

        window.location.href = url
        return
      }

      // ─────────────────────────────────────
      // 💬 WHATSAPP ORDER (Cash on Delivery)
      // ─────────────────────────────────────
      if (paymentMethod === "whatsapp") {
        const message = encodeURIComponent(
          `🛒 *New Order - #${orderId.slice(0, 8).toUpperCase()}*\n\n` +
            `👤 *Customer Details:*\n` +
            `Name: ${shippingDetails.fullName}\n` +
            `Phone: ${shippingDetails.phone}\n` +
            `Email: ${shippingDetails.email}\n\n` +
            `📦 *Shipping Address:*\n${shippingAddressString}\n\n` +
            `🛍️ *Order Items:*\n` +
            items
              .map(
                (item) =>
                  `• ${item.name}\n  Qty: ${item.quantity} × £${item.price.toLocaleString()} = £${(item.price * item.quantity).toLocaleString()}`
              )
              .join("\n\n") +
            `\n\n💰 *Total: £${total.toLocaleString()}*\n\n` +
            `Payment: Cash on Delivery`
        )

        const phone = "+447704335223"
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

        clearCart()
        router.push(`/orders/${orderId}?success=true`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      const message =
        error instanceof Error ? error.message : "Failed to process order. Please try again."
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────────
  // EMPTY CART STATE
  // ─────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition"
          >
            Start Shopping
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-14">

        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <StepIndicator number={1} label="Cart" active={step === "cart"} completed={step !== "cart"} />
            <div className={`h-1 w-8 md:w-24 rounded-full transition-colors ${step !== "cart" ? "bg-orange-600" : "bg-gray-200"}`} />
            <StepIndicator number={2} label="Details" active={step === "details"} completed={step === "payment"} />
            <div className={`h-1 w-8 md:w-24 rounded-full transition-colors ${step === "payment" ? "bg-orange-600" : "bg-gray-200"}`} />
            <StepIndicator number={3} label="Payment" active={step === "payment"} completed={false} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ─── LEFT COLUMN ─── */}
          <div className="lg:col-span-2">

            {/* STEP 1: CART ITEMS */}
            {step === "cart" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h1 className="text-2xl md:text-4xl font-bold mb-6">Shopping Cart</h1>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border bg-white shadow-sm p-4 md:p-6"
                  >
                    <div className="flex gap-3 md:gap-6">
                      <div className="relative h-16 w-16 md:h-28 md:w-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm md:text-lg font-semibold mb-1 line-clamp-2">
                          {item.name}
                        </h2>
                        <p className="text-base md:text-xl font-bold text-orange-600 mb-3 md:mb-4">
                          £{item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 md:gap-3 rounded-full border-2 border-orange-200 px-2 md:px-3 py-1 md:py-1.5">
                            <button
                              onClick={() => decreaseItem(item.id)}
                              className="text-orange-600 hover:text-orange-700 transition"
                            >
                              <Minus size={14} className="md:w-4 md:h-4" />
                            </button>
                            <span className="font-semibold min-w-[16px] md:min-w-[20px] text-center text-sm md:text-base">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(item)}
                              className="text-orange-600 hover:text-orange-700 transition"
                            >
                              <Plus size={14} className="md:w-4 md:h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 text-xs md:text-sm text-red-600 hover:text-red-700 font-medium transition"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button
                  onClick={handleProceedToDetails}
                  size="lg"
                  className="w-full bg-orange-600 hover:bg-orange-700 h-12 md:h-14 text-base md:text-lg mt-6"
                >
                  <span className="hidden sm:inline">Proceed to Shipping Details</span>
                  <span className="sm:hidden">Continue</span>
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: SHIPPING DETAILS */}
            {step === "details" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border shadow-sm p-4 md:p-8"
              >
                <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">Shipping Details</h2>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-600" />
                        Full Name *
                      </label>
                      <Input
                        value={shippingDetails.fullName}
                        onChange={(e) => handleUpdateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-600" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={shippingDetails.email}
                        onChange={(e) => handleUpdateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-600" />
                      Phone Number *
                    </label>
                    <Input
                      value={shippingDetails.phone}
                      onChange={(e) => handleUpdateField("phone", e.target.value)}
                      placeholder="+234 XXX XXX XXXX"
                      className="h-10 md:h-12 text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-3 w-3 md:h-4 md:w-4 mr-1 text-orange-600" />
                      Street Address *
                    </label>
                    <Input
                      value={shippingDetails.address}
                      onChange={(e) => handleUpdateField("address", e.target.value)}
                      placeholder="123 Main Street"
                      className="h-10 md:h-12 text-sm md:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">City *</label>
                      <Input
                        value={shippingDetails.city}
                        onChange={(e) => handleUpdateField("city", e.target.value)}
                        placeholder="Lagos"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">State *</label>
                      <Input
                        value={shippingDetails.state}
                        onChange={(e) => handleUpdateField("state", e.target.value)}
                        placeholder="Lagos State"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <Input
                        value={shippingDetails.postalCode}
                        onChange={(e) => handleUpdateField("postalCode", e.target.value)}
                        placeholder="100001"
                        className="h-10 md:h-12 text-sm md:text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                  <Button
                    onClick={() => setStep("cart")}
                    variant="outline"
                    size="lg"
                    className="w-full sm:flex-1 h-12 md:h-14 text-sm md:text-base"
                  >
                    Back to Cart
                  </Button>
                  <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 h-12 md:h-14 text-sm md:text-base"
                    disabled={!isDetailsValid()}
                  >
                    <span className="hidden sm:inline">Continue to Payment</span>
                    <span className="sm:hidden">Continue</span>
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PAYMENT METHOD */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-8">
                  <h2 className="text-xl md:text-3xl font-bold mb-2">Payment Method</h2>
                  <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">
                    Choose how you'd like to pay for your order
                  </p>

                  <div className="space-y-3 md:space-y-4">
                    {/* Stripe Option */}
                    <label
                      className={`flex items-start gap-3 md:gap-4 p-4 md:p-5 border-2 rounded-xl md:rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === "stripe"
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5 accent-orange-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                          <p className="font-semibold text-sm md:text-base">Pay with Card (Stripe)</p>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                          Visa, Mastercard, American Express
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {["VISA", "MC", "AMEX"].map((brand) => (
                            <span
                              key={brand}
                              className="text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 bg-white border border-gray-200 rounded text-gray-600"
                            >
                              {brand}
                            </span>
                          ))}
                          <span className="flex items-center gap-1 text-[10px] md:text-xs text-green-700 font-medium">
                            <Lock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            Secure
                          </span>
                        </div>
                      </div>
                    </label>

                    {/* WhatsApp Option */}
                    <label
                      className={`flex items-start gap-3 md:gap-4 p-4 md:p-5 border-2 rounded-xl md:rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === "whatsapp"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                        className="mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5 accent-green-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                          <p className="font-semibold text-sm md:text-base">Order via WhatsApp</p>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 mb-2">
                          Send order via WhatsApp and pay on delivery
                        </p>
                        <span className="inline-block text-[10px] md:text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Cash
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Info banners */}
                  {paymentMethod === "stripe" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl flex items-start gap-2 md:gap-3"
                    >
                      <ShieldCheck className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-blue-800">
                        <p className="font-semibold mb-0.5">Secure Card Payment</p>
                        <p className="text-blue-700">
                          You'll be redirected to Stripe's secure checkout
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "whatsapp" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 md:mt-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg md:rounded-xl flex items-start gap-2 md:gap-3"
                    >
                      <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs md:text-sm text-green-800">
                        <p className="font-semibold mb-0.5">WhatsApp Order</p>
                        <p className="text-green-700">
                          WhatsApp will open with your order details pre-filled
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8">
                    <Button
                      onClick={() => setStep("details")}
                      variant="outline"
                      size="lg"
                      className="w-full sm:flex-1 h-12 md:h-14 text-sm md:text-base"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      size="lg"
                      className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 h-12 md:h-14 text-sm md:text-base font-semibold"
                    >
                      {loading
                        ? "Processing..."
                        : paymentMethod === "stripe"
                        ? `Pay £${total.toLocaleString()}`
                        : `Place Order - £${total.toLocaleString()}`}
                    </Button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500 py-2">
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <Lock className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    <span className="hidden sm:inline">SSL Encrypted</span>
                    <span className="sm:hidden">Secure</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    <span className="hidden sm:inline">Secure Checkout</span>
                    <span className="sm:hidden">Protected</span>
                  </span>
                  <span className="flex items-center gap-1 md:gap-1.5">
                    <RotateCcw className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ─── RIGHT COLUMN — Order Summary ─── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border bg-white shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h3>

              {/* Mini item list */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 md:gap-3">
                    <div className="relative h-8 w-8 md:h-10 md:w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[10px] md:text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs md:text-sm font-semibold">
                      £{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 md:pt-4 space-y-2 md:space-y-3 text-xs md:text-sm">
                <div className="flex justify-between text-base md:text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-orange-600">
                    £{Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-6 space-y-1.5 md:space-y-2">
                <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 md:gap-1.5">
                  <ShieldCheck className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-400" />
                  Secure checkout guaranteed
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIndicator({
  number, label, active, completed,
}: {
  number: number; label: string; active: boolean; completed: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 md:gap-2">
      <div
        className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs md:text-base transition-all ${
          completed || active ? "bg-orange-600 text-white shadow-md shadow-orange-200" : "bg-gray-200 text-gray-500"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-[10px] md:text-sm font-medium ${
          active || completed ? "text-orange-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
