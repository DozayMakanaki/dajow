"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { generateInvoice } from "@/lib/invoice"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const snap = await getDocs(collection(db, "orders"))
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    fetchOrders()
  }, [])

  async function updateStatus(id: string, status: string) {
    await updateDoc(doc(db, "orders", id), { status })

    // update UI instantly
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    )
  }

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-bold mb-6">Orders</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-gray-500">
            <th className="py-3">Order</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tracking</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b hover:bg-gray-50">
              <td className="py-3 font-medium">
                #{o.id.slice(0, 6)}
              </td>

              <td>£{Number(o.total).toLocaleString()}</td>

              <td>
                <select
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                </select>
              </td>

              <td>{o.trackingCode || "—"}</td>

              <td>
                <button
                  onClick={() => generateInvoice(o)}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
