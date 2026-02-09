"use client"

export default function OrderModal({ order, onClose }: any) {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">
        <h3 className="text-lg font-bold mb-4">Order Details</h3>

        <p><b>Email:</b> {order.email}</p>
        <p><b>Status:</b> {order.status}</p>

        <div className="mt-4">
          <h4 className="font-semibold">Items</h4>
          {order.items.map((i: any) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.name} × {i.quantity}</span>
              <span>₦{i.price}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h4 className="font-semibold">Shipping</h4>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}</p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-black text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}
