import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getOrderById, updateOrderStatus } from "@/lib/firestore-orders"
import { trackProductOrder } from "@/lib/firestore-products"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    console.log("🔔 Webhook received:", event.type)

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        
        if (!orderId) {
          console.error("❌ No orderId in metadata")
          break
        }

        console.log("✅ Payment successful for order:", orderId)
        
        try {
          // 1. Update order status to "processing" and payment status to "paid"
          const orderRef = doc(db, "orders", orderId)
          await updateDoc(orderRef, {
            status: "processing",
            paymentStatus: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            updatedAt: new Date()
          })

          // 2. Get order details to track product popularity
          const order = await getOrderById(orderId)
          
          if (order && order.items) {
            // 3. Track each product order for popularity scoring
            for (const item of order.items) {
              if (item.productId) {
                await trackProductOrder(item.productId, item.quantity)
                console.log(`📊 Tracked ${item.quantity}x ${item.productName}`)
              }
            }
          }

          console.log("✅ Order updated successfully:", orderId)
        } catch (error) {
          console.error("❌ Error updating order:", error)
        }
        
        break

      case "payment_intent.succeeded":
        console.log("💰 Payment intent succeeded")
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const paymentOrderId = paymentIntent.metadata?.orderId
        
        if (paymentOrderId) {
          console.log("💳 Payment confirmed for order:", paymentOrderId)
        }
        break

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed")
        const failedIntent = event.data.object as Stripe.PaymentIntent
        const failedOrderId = failedIntent.metadata?.orderId
        
        if (failedOrderId) {
          try {
            const orderRef = doc(db, "orders", failedOrderId)
            await updateDoc(orderRef, {
              paymentStatus: "failed",
              status: "cancelled",
              updatedAt: new Date()
            })
            console.log("❌ Order marked as failed:", failedOrderId)
          } catch (error) {
            console.error("Error updating failed order:", error)
          }
        }
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
