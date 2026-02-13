import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
})

export async function POST(req: NextRequest) {
  try {
    // ✅ Use request origin — works on localhost, Vercel previews & production automatically
    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "http://localhost:3000"

    const { items, orderId, customerEmail } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; image?: string; quantity: number }) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    )

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )
    const tax = Math.round(subtotal * 0.075 * 100) / 100
    const shipping = subtotal > 50 ? 0 : 2.99

    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "VAT (7.5%)" },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      })
    }

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Shipping Fee" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: { orderId },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/cart?cancelled=true`,
      payment_intent_data: { metadata: { orderId } },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
