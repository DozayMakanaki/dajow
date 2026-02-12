import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
})

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Build Stripe line items from cart items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; image?: string; quantity: number }) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects amount in pence
        },
        quantity: item.quantity,
      })
    )

    // Calculate totals for tax and shipping line items
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )
    const tax = Math.round(subtotal * 0.075)
    const shipping = subtotal > 50000 ? 0 : 2000

    // Add VAT as a line item
    if (tax > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "VAT (7.5%)",
          },
          unit_amount: Math.round(tax * 100),
        },
        quantity: 1,
      })
    }

    // Add shipping fee as a line item (if applicable)
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Shipping Fee",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        orderId, // Store our Firestore order ID so the webhook can update it
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      // Optional: collect shipping address on Stripe side too (redundant but good for records)
      // shipping_address_collection: { allowed_countries: ["NG"] },
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
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
