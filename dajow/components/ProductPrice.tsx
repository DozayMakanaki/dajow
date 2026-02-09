"use client"

import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/formatPrice"

export default function ProductPrice({ usdPrice }: { usdPrice: number }) {
  const [price, setPrice] = useState<string>("Loading...")

  useEffect(() => {
    const loadPrice = async () => {
      try {
        const geoRes = await fetch("https://ipapi.co/json/")
        const geo = await geoRes.json()

        const currency = geo.currency || "USD"

        if (currency === "USD") {
          setPrice(formatPrice(usdPrice, "USD"))
          return
        }

        const fxRes = await fetch(
          `https://api.exchangerate.host/convert?from=USD&to=${currency}&amount=${usdPrice}`
        )
        const fx = await fxRes.json()

        setPrice(formatPrice(fx.result, currency))
      } catch {
        setPrice(formatPrice(usdPrice, "USD"))
      }
    }

    loadPrice()
  }, [usdPrice])

  return (
    <p className="text-xl font-semibold mt-2">
      {price}
    </p>
  )
}
