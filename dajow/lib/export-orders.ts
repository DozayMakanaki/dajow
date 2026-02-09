export function exportOrdersCSV(orders: any[]) {
  const headers = [
    "Order ID",
    "Email",
    "Total",
    "Status",
    "Tracking",
    "Date",
  ]

  const rows = orders.map(o => [
    o.id,
    o.email,
    o.total,
    o.status,
    o.trackingCode || "",
    new Date(o.createdAt.seconds * 1000).toLocaleDateString(),
  ])

  const csv =
    [headers, ...rows].map(r => r.join(",")).join("\n")

  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "orders.csv"
  a.click()
}
