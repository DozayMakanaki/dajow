import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { email, total, orderId } = await request.json()

    await transporter.sendMail({
      to: email,
      subject: "Your Invoice - Order Confirmation",
      html: `
        <h3>Thank you for your purchase!</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
        <p>Your payment has been confirmed.</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email send error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    )
  }
}