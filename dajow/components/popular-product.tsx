"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { products } from "@/data/products"
import AddToCartButton from "@/components/add-to-cart-button"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { useRef } from "react"

export default function PopularProducts() {
  const sliderRef = useRef<HTMLDivElement>(null)

  const popularProducts = products.slice(0, 8) // mark as popular later if needed

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return

    sliderRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    })
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 space-y-10">

      {/* HEADER */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
            <Flame className="h-7 w-7 text-orange-600" />
            Popular Products
          </h2>
          <p className="mt-2 max-w-lg text-sm text-gray-600">
            Best-selling products our customers love — updated weekly.
          </p>
        </div>

        {/* DESKTOP ARROWS */}
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full border p-3 hover:bg-orange-50 transition"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full border p-3 hover:bg-orange-50 transition"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <motion.div
        ref={sliderRef}
        className="
          flex gap-5 overflow-x-auto scroll-smooth
          pb-4
          [&::-webkit-scrollbar]:hidden
        "
      >
        {popularProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="
              min-w-[260px] sm:min-w-[280px]
              rounded-2xl border border-white/30
              bg-white/70 backdrop-blur-xl
              shadow-md hover:shadow-xl
              transition-all
            "
          >
            {/* IMAGE */}
            <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* BADGE */}
              <span className="
                absolute left-3 top-3 rounded-full
                bg-orange-600 px-3 py-1 text-xs font-semibold text-white
              ">
                Popular
              </span>
            </div>

            {/* CONTENT */}
            <div className="space-y-3 p-4">
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {product.category}
                </p>
              </div>

              <p className="text-lg font-bold text-orange-600">
                ₦{product.price.toLocaleString()}
              </p>

              <AddToCartButton product={product} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
