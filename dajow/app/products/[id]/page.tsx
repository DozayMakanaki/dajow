"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductById, trackProductView, type Product } from "@/lib/products"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, Heart, Star, Package, TruckIcon, ShieldCheck, Check } from "lucide-react"
import { motion } from "framer-motion"

interface ProductVariant {
  size: string
  price: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!id) return

    getProductById(id)
      .then((data) => {
        setProduct(data)
        
        // Auto-select first variant if product has variants
        if (data && data.hasVariants && data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
        
        if (data) {
          trackProductView(id)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    // Determine the price based on whether variants exist
    const finalPrice = product.hasVariants && selectedVariant
      ? selectedVariant.price
      : product.price

    const itemName = product.hasVariants && selectedVariant
      ? `${product.name} - ${selectedVariant.size}`
      : product.name

    // Add items based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: itemName,
        price: finalPrice,
        image: product.image,
        quantity: 1
      })
    }

    alert(`Added ${quantity} × ${itemName} to cart!`)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  // Get current display price
  const displayPrice = product?.hasVariants && selectedVariant
    ? selectedVariant.price
    : product?.price || 0

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
          <Button onClick={() => window.history.back()}>Go Back</Button>
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
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png"
                }}
              />
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
              <motion.p
                key={displayPrice}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-4xl md:text-5xl font-black text-orange-600"
              >
                £{displayPrice.toLocaleString()}
              </motion.p>
              <p className="text-sm text-gray-500">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Size/Variant Selector */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Size
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant, index) => {
                    const isSelected = selectedVariant?.size === variant.size
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative p-4 rounded-xl border-2 transition-all font-medium ${
                          isSelected
                            ? "border-orange-600 bg-orange-50 text-orange-900"
                            : "border-gray-200 hover:border-orange-300 text-gray-700"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div className="text-center">
                          <p className="font-bold">{variant.size}</p>
                          <p className="text-xs mt-1">£{variant.price}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
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
                disabled={product.hasVariants && !selectedVariant}
                size="lg"
                className="flex-1 bg-orange-600 hover:bg-orange-700 h-14 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Variant selection reminder */}
            {product.hasVariants && !selectedVariant && (
              <p className="text-sm text-red-500 font-medium">
                ⚠️ Please select a size to continue
              </p>
            )}

            {/* Features */}
            <div className="space-y-3 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <TruckIcon className="h-5 w-5 text-orange-600" />
                <span className="text-gray-700">Free shipping on orders over £50</span>
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
              {product.description || `${product.name} is a premium quality product carefully selected to meet your needs. Perfect for everyday use and specially crafted to deliver exceptional value.`}
            </p>

            {/* Show all available sizes */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Available Sizes:</h3>
                <ul className="space-y-2">
                  {product.variants.map((variant, i) => (
                    <li key={i} className="text-gray-600">
                      <span className="font-medium text-gray-900">{variant.size}</span> - £{variant.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
