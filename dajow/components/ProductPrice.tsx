"use client"

import { useEffect, useState } from "react"
import { formatLivePrice } from "@/lib/format-live-price"

export default function ProductPrice({ usdPrice }: { usdPrice: number }) {
  const [price, setPrice] = useState<string>("Loading...")

  useEffect(() => {
    const loadPrice = async () => {
      try {
        const geoRes = await fetch("https://ipapi.co/json/")
        const geo = await geoRes.json()

        const currency = geo.currency || "USD"

        if (currency === "USD") {
          setPrice(formatLivePrice(usdPrice, { USD: 1 }))
          return
        }

        const fxRes = await fetch(
          `https://api.exchangerate.host/convert?from=USD&to=${currency}&amount=${usdPrice}`
        )
        const fx = await fxRes.json()

        setPrice(formatLivePrice(fx.result, { [currency]: 1 }))
      } catch {
        setPrice(formatLivePrice(usdPrice, { USD: 1 }))
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