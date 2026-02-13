import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe without apiVersion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("📦 Checkout request received:", {
      itemsCount: body.items?.length,
      hasEmail: !!body.customerEmail,
      hasOrderId: !!body.orderId
    })

    const { items, orderId, customerEmail } = body

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Invalid items:", items)
      return NextResponse.json(
        { error: "Cart is empty or invalid" },
        { status: 400 }
      )
    }

    if (!customerEmail || !customerEmail.includes("@")) {
      console.error("❌ Invalid email:", customerEmail)
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    // Validate STRIPE_SECRET_KEY exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY not found in environment variables")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: any) => {
        console.log(`📝 Item: ${item.name}, Price: £${item.price}, Qty: ${item.quantity}`)
        
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name || "Product",
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(Number(item.price) * 100), // Convert to pence
          },
          quantity: Number(item.quantity) || 1,
        }
      }
    )

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.NEXT_PUBLIC_APP_URL || 
                    process.env.NEXT_PUBLIC_SITE_URL || 
                    "http://localhost:3000"

    console.log("🌐 Base URL:", baseUrl)
    console.log("💳 Creating Stripe session with", lineItems.length, "line items")

    // Create Stripe checkout session
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
    })

    console.log("✅ Stripe session created successfully:", session.id)
    console.log("🔗 Checkout URL:", session.url)

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    })

  } catch (error: any) {
    console.error("❌ Stripe checkout error:", {
      name: error?.name,
      message: error?.message,
      type: error?.type,
      code: error?.code,
      statusCode: error?.statusCode,
      raw: error
    })
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to create checkout session",
        message: error?.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? {
          type: error?.type,
          code: error?.code,
          statusCode: error?.statusCode
        } : undefined
      },
      { status: 500 }
    )
  }
}
