import { getCurrencyFromLocale } from "./get-currency"

export function formatLivePrice(
  priceNGN: number,
  rates: Record<string, number> | null
) {
  const currency = getCurrencyFromLocale()

  const rate = currency === "NGN"
    ? 1
    : rates?.[currency] ?? 1

  const converted = priceNGN * rate

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(converted)
}
