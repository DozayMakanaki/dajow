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
  const tax = subtotal * 0.075 // 7.5% VAT
  const shipping = subtotal > 50 ? 0 : 2.99 // Free shipping over £50
  const total = subtotal + tax + shipping

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

        // Redirect to Stripe-hosted checkout page
        // Cart is NOT cleared here — it will be cleared on the success page
        // after Stripe confirms the payment
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
            `\n\n💰 *Order Summary:*\n` +
            `Subtotal: £${subtotal.toLocaleString()}\n` +
            `VAT (7.5%): £${tax.toLocaleString()}\n` +
            `Shipping: ${shipping === 0 ? "FREE" : "£" + shipping.toLocaleString()}\n` +
            `*Total: £${total.toLocaleString()}*\n\n` +
            `Payment: Cash on Delivery`
        )

        const phone = "2348146714124" // ← YOUR WHATSAPP NUMBER
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
          <div className="flex items-center justify-center gap-4">
            <StepIndicator number={1} label="Cart" active={step === "cart"} completed={step !== "cart"} />
            <div className={`h-1 w-12 md:w-24 rounded-full transition-colors ${step !== "cart" ? "bg-orange-600" : "bg-gray-200"}`} />
            <StepIndicator number={2} label="Details" active={step === "details"} completed={step === "payment"} />
            <div className={`h-1 w-12 md:w-24 rounded-full transition-colors ${step === "payment" ? "bg-orange-600" : "bg-gray-200"}`} />
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
                <h1 className="text-3xl md:text-4xl font-bold mb-6">Shopping Cart</h1>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border bg-white shadow-sm p-4 md:p-6"
                  >
                    <div className="flex gap-4 md:gap-6">
                      <div className="relative h-20 w-20 md:h-28 md:w-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h2 className="text-base md:text-lg font-semibold mb-1 line-clamp-2">
                          {item.name}
                        </h2>
                        <p className="text-lg md:text-xl font-bold text-orange-600 mb-4">
                          £{item.price.toLocaleString()}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border-2 border-orange-200 px-3 py-1.5">
                            <button
                              onClick={() => decreaseItem(item.id)}
                              className="text-orange-600 hover:text-orange-700 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addItem(item)}
                              className="text-orange-600 hover:text-orange-700 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition"
                          >
                            <Trash2 size={16} />
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
                  className="w-full bg-orange-600 hover:bg-orange-700 h-14 text-lg mt-6"
                >
                  Proceed to Shipping Details
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: SHIPPING DETAILS */}
            {step === "details" && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border shadow-sm p-6 md:p-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Shipping Details</h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1 text-orange-600" />
                        Full Name *
                      </label>
                      <Input
                        value={shippingDetails.fullName}
                        onChange={(e) => handleUpdateField("fullName", e.target.value)}
                        placeholder="John Doe"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1 text-orange-600" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={shippingDetails.email}
                        onChange={(e) => handleUpdateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1 text-orange-600" />
                      Phone Number *
                    </label>
                    <Input
                      value={shippingDetails.phone}
                      onChange={(e) => handleUpdateField("phone", e.target.value)}
                      placeholder="+234 XXX XXX XXXX"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline h-4 w-4 mr-1 text-orange-600" />
                      Street Address *
                    </label>
                    <Input
                      value={shippingDetails.address}
                      onChange={(e) => handleUpdateField("address", e.target.value)}
                      placeholder="123 Main Street"
                      className="h-12"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <Input
                        value={shippingDetails.city}
                        onChange={(e) => handleUpdateField("city", e.target.value)}
                        placeholder="Lagos"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <Input
                        value={shippingDetails.state}
                        onChange={(e) => handleUpdateField("state", e.target.value)}
                        placeholder="Lagos State"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <Input
                        value={shippingDetails.postalCode}
                        onChange={(e) => handleUpdateField("postalCode", e.target.value)}
                        placeholder="100001"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep("cart")}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14"
                  >
                    Back to Cart
                  </Button>
                  <Button
                    onClick={handleProceedToPayment}
                    size="lg"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 h-14"
                    disabled={!isDetailsValid()}
                  >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
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
                <div className="bg-white rounded-2xl border shadow-sm p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Payment Method</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Choose how you'd like to pay for your order
                  </p>

                  <div className="space-y-4">
                    {/* Stripe Option */}
                    <label
                      className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === "stripe"
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="mt-1 w-5 h-5 accent-orange-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-5 w-5 text-orange-600" />
                          <p className="font-semibold">Pay with Card (Stripe)</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          Visa, Mastercard, American Express. Powered by Stripe.
                        </p>
                        {/* Card brand icons */}
                        <div className="flex items-center gap-2">
                          {["VISA", "MC", "AMEX"].map((brand) => (
                            <span
                              key={brand}
                              className="text-xs font-bold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600"
                            >
                              {brand}
                            </span>
                          ))}
                          <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
                            <Lock className="h-3 w-3" />
                            Secure
                          </span>
                        </div>
                      </div>
                    </label>

                    {/* WhatsApp Option */}
                    <label
                      className={`flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === "whatsapp"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                        className="mt-1 w-5 h-5 accent-green-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageCircle className="h-5 w-5 text-green-600" />
                          <p className="font-semibold">Order via WhatsApp</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Send your order via WhatsApp and pay on delivery.
                        </p>
                        <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Cash on Delivery
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Context-sensitive info banner */}
                  {paymentMethod === "stripe" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
                    >
                      <ShieldCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-0.5">Secure Card Payment</p>
                        <p className="text-blue-700">
                          You'll be redirected to Stripe's secure checkout. Your card details are
                          never stored on our servers.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "whatsapp" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                    >
                      <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <p className="font-semibold mb-0.5">WhatsApp Order</p>
                        <p className="text-green-700">
                          After clicking "Place Order", WhatsApp will open with your order
                          details pre-filled. Pay cash when your order is delivered.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={() => setStep("details")}
                      variant="outline"
                      size="lg"
                      className="flex-1 h-14"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCheckout}
                      disabled={loading}
                      size="lg"
                      className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 text-base font-semibold"
                    >
                      {loading
                        ? "Processing..."
                        : paymentMethod === "stripe"
                        ? `Pay £${total.toLocaleString()} with Card`
                        : `Place Order - £${total.toLocaleString()}`}
                    </Button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500 py-2">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-4 w-4 text-gray-400" />
                    SSL Encrypted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gray-400" />
                    Secure Checkout
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="h-4 w-4 text-gray-400" />
                    7-Day Returns
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* ─── RIGHT COLUMN — Order Summary ─── */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border bg-white shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>

              {/* Mini item list */}
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">
                      £{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">£{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VAT (7.5%)</span>
                  <span className="font-semibold">£{Math.round(tax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `£${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-orange-600">
                    £{Math.round(total).toLocaleString()}
                  </span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 mb-4">
                  🎉 You've unlocked free shipping!
                </div>
              )}

              {shipping > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-800 mb-4">
                  Add £{(50 - subtotal).toLocaleString()} more to get <strong>free shipping</strong>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-gray-400" />
                  Secure checkout guaranteed
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-gray-400" />
                  Easy returns within 7 days
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
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
          completed || active ? "bg-orange-600 text-white shadow-md shadow-orange-200" : "bg-gray-200 text-gray-500"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-xs md:text-sm font-medium ${
          active || completed ? "text-orange-600" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
