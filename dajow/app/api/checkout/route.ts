import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createOrder } from "@/lib/firestore-orders"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {})

export async function POST(req: NextRequest) {
  try {
    // ✅ Use request origin — works on localhost, Vercel previews & production automatically
    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      "http://localhost:3000"

    const { 
      items, 
      orderId, 
      customerEmail, 
      shippingCost,
      // NEW: User and shipping info
      userId,
      userName,
      shippingAddress
    } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; price: number; image?: string; quantity: number }) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    )

    // Use shipping cost passed from cart (location-based)
    const shipping = shippingCost || 0

    // Add shipping line item
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

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )
    const tax = subtotal * 0.2 // 20% VAT

    // Create order in Firestore BEFORE payment
    // Status will be "pending" until payment succeeds
    const firestoreOrderId = await createOrder({
      userId: userId || "guest",
      userEmail: customerEmail,
      userName: userName || "",
      items: items.map((item: any) => ({
        productId: item.id || "",
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
      status: "pending",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      shippingAddress: shippingAddress || {
        fullName: userName || "Guest",
        phone: "",
        address: "",
        city: "",
        postcode: "",
        country: "UK"
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: { 
        orderId: firestoreOrderId, // Use Firestore order ID
        userId: userId || "guest",
        items: JSON.stringify(items)
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${firestoreOrderId}`,
      cancel_url: `${origin}/cart?cancelled=true`,
      payment_intent_data: { 
        metadata: { 
          orderId: firestoreOrderId,
          userId: userId || "guest"
        } 
      },
    })

    return NextResponse.json({ 
      url: session.url, 
      sessionId: session.id,
      orderId: firestoreOrderId 
    })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
