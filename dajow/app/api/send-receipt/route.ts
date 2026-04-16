import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { order } = await req.json();

  const {
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    address,
    deliveryLocation,
    items,
    subtotal,
    shippingAmount,
    total,
    paymentMethod,
  } = order;

  const locationLabel =
    deliveryLocation === "bangor"
      ? "Bangor"
      : deliveryLocation === "northern-ireland"
      ? "Northern Ireland (Outside Bangor)"
      : "Outside Northern Ireland";

  const itemRows = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:14px;">${item.name}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;text-align:center;font-size:14px;">${item.quantity}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;text-align:right;font-size:14px;">£${item.price.toLocaleString()}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;font-size:14px;">£${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#ea580c,#f97316);padding:28px 24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;letter-spacing:-0.5px;">🛒 New Order Received!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
      </div>

      <div style="padding:28px 24px;">

        <!-- Payment Badge -->
        <div style="margin-bottom:20px;">
          <span style="display:inline-block;padding:5px 14px;border-radius:999px;font-size:12px;font-weight:700;${
            paymentMethod === "stripe"
              ? "background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;"
              : "background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;"
          }">
            ${paymentMethod === "stripe" ? "💳 Card Payment (Stripe)" : "💬 WhatsApp / Cash on Delivery"}
          </span>
        </div>

        <!-- Customer Details -->
        <div style="background:#f9fafb;border-radius:10px;padding:18px;margin-bottom:20px;">
          <h3 style="margin:0 0 14px;font-size:15px;color:#111827;">👤 Customer Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;width:110px;">Name</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Email</td>
              <td style="padding:4px 0;font-size:13px;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#6b7280;font-size:13px;">Phone</td>
              <td style="padding:4px 0;font-size:13px;">${customerPhone}</td>
            </tr>
          </table>
        </div>

        <!-- Shipping Address -->
        <div style="background:#f9fafb;border-radius:10px;padding:18px;margin-bottom:20px;">
          <h3 style="margin:0 0 14px;font-size:15px;color:#111827;">📦 Shipping Address</h3>
          <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;">
            ${address.address}<br/>
            ${address.city}, ${address.state} ${address.postalCode}<br/>
            <span style="display:inline-block;margin-top:6px;background:#fff7ed;color:#ea580c;border:1px solid #fed7aa;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;">
              📍 ${locationLabel}
            </span>
          </p>
        </div>

        <!-- Order Items -->
        <h3 style="margin:0 0 12px;font-size:15px;color:#111827;">🛍️ Order Items</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #f3f4f6;border-radius:10px;overflow:hidden;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:10px 14px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;">ITEM</th>
              <th style="padding:10px 14px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;">QTY</th>
              <th style="padding:10px 14px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">UNIT</th>
              <th style="padding:10px 14px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;">TOTAL</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <!-- Totals -->
        <div style="margin-top:16px;background:#f9fafb;border-radius:10px;padding:16px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
            <span style="font-size:13px;color:#6b7280;">Subtotal</span>
            <span style="font-size:13px;font-weight:600;">£${subtotal.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:13px;color:#6b7280;">🚚 Shipping (${locationLabel})</span>
            <span style="font-size:13px;font-weight:600;">£${shippingAmount.toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:2px solid #e5e7eb;padding-top:12px;">
            <span style="font-size:16px;font-weight:700;">Total</span>
            <span style="font-size:20px;font-weight:700;color:#ea580c;">£${total.toLocaleString()}</span>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;">Supermarker Admin Receipt • ${new Date().toLocaleString("en-GB")}</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Supermarker <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `🛒 New Order #${orderId.slice(0, 8).toUpperCase()} — £${total.toLocaleString()} from ${customerName}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Receipt email error:", error);
    return NextResponse.json({ error: "Failed to send receipt" }, { status: 500 });
  }
}