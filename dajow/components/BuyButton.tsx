"use client"

import { detectCurrency } from "@/lib/detectCurrency"

export default function BuyButton({ product }: { product: any }) {
  const handleCheckout = async () => {
    const currency = detectCurrency()

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, currency }),
    })

    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <button
      onClick={handleCheckout}
      className="w-full rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
    >
      Buy Now
    </button>
  )
}
