import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

export async function POST(req: NextRequest) {
  try {
    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "http://localhost:3000"

    const {
      items,
      customerEmail,
      shippingCost,
      userId,
      userName,
      shippingAddress,
    } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set")
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }

    // Build line items from cart
   // Build line items from cart
const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
  (item: { name: string; price: number; image?: string; quantity: number }) => {
    // Only include image if it's a valid short HTTPS URL (Stripe limit is 2048 chars)
    const imageUrl =
      item.image &&
      item.image.startsWith("https://") &&
      item.image.length <= 2000
        ? [item.image]
        : undefined

    return {
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          ...(imageUrl ? { images: imageUrl } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }
  }
)

    // Add shipping as a separate line item if applicable
    const shipping = typeof shippingCost === "number" ? shippingCost : 0
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
      metadata: {
        userId: userId || "guest",
        userName: userName || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?cancelled=true`,
      payment_intent_data: {
        metadata: {
          userId: userId || "guest",
        },
      },
    })

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    // Log the actual error message to help debug
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: message },
      { status: 500 }
    )
  }
}
