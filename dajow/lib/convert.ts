export async function convertFromGBP(
  amountGBP: number,
  toCurrency: string
): Promise<number> {
  if (toCurrency === "gbp") return amountGBP

  try {
    const res = await fetch(
      `https://api.exchangerate.host/convert?from=GBP&to=${toCurrency}&amount=${amountGBP}`,
      { cache: "no-store" }
    )

    const data = await res.json()

    if (!data?.result) {
      throw new Error("Invalid exchange response")
    }

    return data.result
  } catch {
    // Safety fallback (never crash)
    const fallback: Record<string, number> = {
      usd: amountGBP * 1.27,
      eur: amountGBP * 1.16,
      ngn: amountGBP * 1900,
    }

    return fallback[toCurrency] ?? amountGBP
  }
}
