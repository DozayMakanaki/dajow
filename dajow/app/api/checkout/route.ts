import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json()

    console.log("Checkout request:", { items, orderId, customerEmail })

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email is required" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; image?: string; quantity: number }) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    )

    // Calculate subtotal for shipping
    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )
    const shipping = subtotal > 50000 ? 0 : 2000

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
        orderId: orderId || "no-order-id",
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
      payment_intent_data: {
        metadata: {
          orderId: orderId || "no-order-id",
        },
      },
    })

    console.log("✅ Stripe session created:", session.id)

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    console.error("❌ Stripe checkout error:", {
      message: error?.message,
      type: error?.type,
      code: error?.code,
    })
    
    return NextResponse.json(
      { 
        error: "Failed to create checkout session",
        message: error?.message || "Unknown error"
      },
      { status: 500 }
    )
  }
}