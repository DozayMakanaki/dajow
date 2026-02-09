"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProductById } from "@/lib/firestore-products"
import { useCartStore } from "@/store/cart-store"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    getProductById(params.id)
      .then(setProduct)
      .finally(() => setLoading(false))
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    // Add to Zustand store (multiple times for quantity)
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      })
    }
    
    // Navigate to cart
    router.push('/cart')
  }

  const handleBuyNow = () => {
    handleAddToCart()
  }

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!product) return <div className="p-6 text-center">Product not found</div>

  // Fix empty or invalid image URLs
  const imageUrl = product.image && product.image.trim() !== "" 
    ? product.image 
    : "/placeholder.png"

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/products" className="text-orange-600 hover:underline mb-6 inline-block font-medium">
        ← Back to products
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name || "Product"}
            fill
            className="object-cover"
            unoptimized={!imageUrl.startsWith('http')}
          />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-orange-600 uppercase mb-2 font-semibold">
              {product.category?.replace(/-/g, " ") || "Uncategorized"}
            </p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-orange-600">
              ₦{product.price?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description || "No description available."}</p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border-2 border-orange-600 text-orange-600 rounded hover:bg-orange-50 font-semibold"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border-2 border-orange-600 text-orange-600 rounded hover:bg-orange-50 font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Add to Cart
          </button>

          <button 
            onClick={handleBuyNow}
            className="w-full border-2 border-orange-600 text-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-50 transition"
          >
            Buy Now
          </button>

          {/* Details */}
          <div className="bg-orange-50 rounded-lg p-4 space-y-2 border border-orange-100">
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{product.category?.replace(/-/g, " ") || "N/A"}</span>
            </div>
            {product.section && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Section</span>
                <span className="font-medium">{product.section?.replace(/-/g, " ")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
