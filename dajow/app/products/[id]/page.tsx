"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductById, trackProductView, type Product } from "@/lib/products"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, Heart, Star, Package, TruckIcon, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  // ✅ Fix: Correct state type
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!id) return

    // Fetch product and track view
    getProductById(id)
      .then((data) => {
        setProduct(data)
        
        // Track view after product is loaded
        if (data) {
          trackProductView(id)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    // Add items based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }

    // Optional: Show success message or redirect
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-14">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border-2 border-gray-100 shadow-xl">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Thumbnails - Optional */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 opacity-50 cursor-not-allowed">
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={`Thumbnail ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold capitalize">
                {product.category?.replace(/-/g, " ")}
              </span>
              {product.section && (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                  {product.section.replace(/-/g, " ")}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-orange-500 text-orange-500" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.9)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-orange-600">
                £{product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Stats */}
            {(product.views || product.orders) && (
              <div className="flex items-center gap-6 py-4 border-y">
                {product.views !== undefined && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{product.views}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                )}
                {product.orders !== undefined && (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{product.orders}</p>
                    <p className="text-xs text-gray-500">Sold</p>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 rounded-full border-2 border-orange-200 px-5 py-3 bg-white">
                  <button
                    onClick={decreaseQuantity}
                    className="text-orange-600 hover:text-orange-700 transition"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="font-bold text-xl min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="text-orange-600 hover:text-orange-700 transition"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 text-lg font-bold"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-6 border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <TruckIcon className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">Free shipping on orders over ₦50,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">Fast delivery within 3-5 business days</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">100% authentic products guaranteed</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-white rounded-3xl border p-8 md:p-12"
        >
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {product.name} is a premium quality product carefully selected to meet your needs. 
              Perfect for everyday use and specially crafted to deliver exceptional value.
            </p>
            {/* Add more product details here */}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
