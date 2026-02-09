import Stripe from "stripe"
import { NextResponse } from "next/server"
import { products } from "@/data/products"
import { convertFromGBP } from "@/lib/convert"
import { resolveCurrency } from "@/lib/currency"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const { items, country } = await req.json()

  const currency = resolveCurrency(country)

  const line_items = await Promise.all(
    items.map(async (item: any) => {
      const product = products.find(p => p.id === item.id)
      if (!product) throw new Error("Product not found")

      const price = await convertFromGBP(product.price, currency)

      return {
        price_data: {
          currency,
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      }
    })
  )

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    payment_method_types: ["card"],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
