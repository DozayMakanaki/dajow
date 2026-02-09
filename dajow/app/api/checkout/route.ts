import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
})

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "usd", // US Dollars
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=true`,
      customer_email: customerEmail,
      metadata: {
        orderId: orderId,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
