export const getCurrencyFromLocale = () => {
  if (typeof window === "undefined") return "NGN"

  const locale = navigator.language
  const country = locale.split("-")[1]

  switch (country) {
    case "US":
      return "USD"
    case "GB":
      return "GBP"
    case "FR":
    case "DE":
    case "ES":
      return "EUR"
    default:
      return "NGN"
  }
}
