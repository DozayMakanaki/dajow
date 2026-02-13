import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getProductById } from "@/lib/firestore-products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { items, orderId, customerEmail, country } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      )
    }

    // Determine currency (default to GBP based on your preference)
    const currency = country ? resolveCurrency(country) : "gbp"

    // Create line items for Stripe
    // Fetch product data from Firestore to ensure we have correct prices
    const lineItems = await Promise.all(
      items.map(async (item: any) => {
        // If product data is already in cart, use it
        // Otherwise, fetch from Firestore for security
        let productData = item
        
        if (item.id && !item.price) {
          const product = await getProductById(item.id)
          if (!product) {
            throw new Error(`Product ${item.id} not found`)
          }
          productData = product
        }

        return {
          price_data: {
            currency,
            product_data: {
              name: productData.name,
              images: productData.image ? [productData.image] : [],
              description: productData.category || undefined,
            },
            unit_amount: Math.round(productData.price * 100), // Convert to cents/pence
          },
          quantity: item.quantity || 1,
        }
      })
    )

    // Determine success and cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    
    const successUrl = orderId 
      ? `${baseUrl}/orders/${orderId}?success=true`
      : `${baseUrl}/success`
    
    const cancelUrl = `${baseUrl}/cart?canceled=true`

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: orderId ? { orderId } : {},
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "GB", "CA", "AU", "NG"], // Add countries you ship to
      },
    })

    // Return both sessionId (for redirectToCheckout) and url (for direct redirect)
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

// Helper function to resolve currency based on country
function resolveCurrency(country: string): string {
  const currencyMap: { [key: string]: string } = {
    US: "usd",
    GB: "gbp",
    EU: "eur",
    CA: "cad",
    AU: "aud",
    NG: "gbp", // Nigeria - use GBP (changed from USD to match your preference)
    // Add more countries as needed
  }

  return currencyMap[country?.toUpperCase()] || "gbp"
}