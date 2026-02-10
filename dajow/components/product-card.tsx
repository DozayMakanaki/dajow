"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"

type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  searchKeywords?: string[]
}

type Props = {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({ ...product, quantity: 1 })
    console.log("Add to cart:", product.id)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-4 p-3">

        {/* PRODUCT IMAGE */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* PRODUCT INFO */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </p>
          <p className="text-sm font-bold text-orange-600">
            £{product.price.toLocaleString()}
          </p>
        </div>

        {/* ADD BUTTON */}
        <Button
          onClick={handleAdd}
          className="rounded-full bg-orange-600 px-4 text-white hover:bg-orange-700 shadow hover:shadow-md transition"
        >
          Add
        </Button>
      </div>
    </motion.div>
  )
}