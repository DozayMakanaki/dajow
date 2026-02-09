import jsPDF from "jspdf"

export function generateInvoice(order: any) {
  const pdf = new jsPDF()

  pdf.setFontSize(18)
  pdf.text("INVOICE", 20, 20)

  pdf.setFontSize(12)
  pdf.text(`Order ID: ${order.id}`, 20, 35)
  pdf.text(`Status: ${order.status}`, 20, 45)
  pdf.text(`Tracking: ${order.trackingCode || "N/A"}`, 20, 55)

  pdf.text("Items:", 20, 75)

  let y = 85
  order.items?.forEach((item: any) => {
    pdf.text(
      `${item.name} x${item.qty} — ₦${item.price}`,
      20,
      y
    )
    y += 10
  })

  pdf.text(`Total: ₦${order.total}`, 20, y + 10)

  pdf.save(`invoice-${order.id}.pdf`)
}
