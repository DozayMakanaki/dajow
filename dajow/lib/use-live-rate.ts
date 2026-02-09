"use client"

import { useEffect, useState } from "react"

type Rates = Record<string, number>

let cachedRates: Rates | null = null
let lastFetched = 0

const CACHE_TIME = 1000 * 60 * 60 // 1 hour

export function useLiveRates() {
  const [rates, setRates] = useState<Rates | null>(cachedRates)

  useEffect(() => {
    const now = Date.now()

    if (cachedRates && now - lastFetched < CACHE_TIME) {
      return
    }

    fetch("https://api.exchangerate.host/latest?base=NGN")
      .then(res => res.json())
      .then(data => {
        cachedRates = data.rates
        lastFetched = Date.now()
        setRates(data.rates)
      })
      .catch(() => {
        console.warn("Failed to fetch exchange rates")
      })
  }, [])

  return rates
}
