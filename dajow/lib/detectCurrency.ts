export function detectCurrency(): string {
  if (typeof window === "undefined") return "USD"

  const locale = navigator.language

  if (locale.includes("GB")) return "GBP"
  if (locale.includes("DE") || locale.includes("FR")) return "EUR"
  if (locale.includes("CA")) return "CAD"
  if (locale.includes("AU")) return "AUD"

  return "USD"
}
