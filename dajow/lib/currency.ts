export function resolveCurrency(country: string) {
  switch (country) {
    case "GB":
      return "gbp"
    case "US":
      return "usd"
    case "NG":
      return "ngn"
    case "CA":
      return "cad"
    case "AU":
      return "aud"
    case "DE":
    case "FR":
      return "eur"
    default:
      return "gbp"
  }
}
