"use client"

import { useCartStore } from "@/store/cart-store"

export default function AddToCartButton({
  product,
  label = "Add item",
}: {
  product: any
  label?: string
}) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <button
      onClick={() => addItem(product)}
      className="
        w-full rounded-xl bg-orange-600 py-2.5
        text-sm font-semibold text-white
        transition hover:bg-orange-700 active:scale-[0.97]
      "
    >
      {label}
    </button>
  )
}
