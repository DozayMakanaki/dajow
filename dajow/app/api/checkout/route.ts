import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Check if key exists
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is missing!")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

export async function POST(req: NextRequest) {
  try {
    // Check for Stripe key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not configured")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    console.log("📦 Checkout request:", {
      itemsCount: body.items?.length,
      hasEmail: !!body.customerEmail
    })

    const { items, orderId, customerEmail } = body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!customerEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })
    )

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dajow.vercel.app"
    console.log("🌐 Using base URL:", baseUrl)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: { orderId: orderId || "" },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${baseUrl}/cart?cancelled=true`,
    })

    console.log("✅ Session created:", session.id)
    console.log("🔗 Checkout URL:", session.url)

    if (!session.url) {
      console.error("❌ No URL returned from Stripe")
      return NextResponse.json(
        { error: "Failed to generate checkout URL" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    })
  } catch (error: any) {
    console.error("❌ Checkout error:", {
      message: error.message,
      type: error.type,
      code: error.code
    })
    
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}