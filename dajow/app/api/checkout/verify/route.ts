import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 apiVersion: "2025-12-15.clover",
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "No session_id provided" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      paid: session.payment_status === "paid",
      status: session.payment_status,
      orderId: session.metadata?.orderId,
      customerEmail: session.customer_email,
      amountTotal: session.amount_total, // in kobo
    })
  } catch (error) {
    console.error("Error verifying session:", error)
    return NextResponse.json({ error: "Could not verify session" }, { status: 500 })
  }
}
