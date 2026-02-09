"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import Image from "next/image"
import { Heart, Trash2, ShoppingCart, ExternalLink, CheckCircle, X as XIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCartStore } from "@/store/cart-store"
import { useRouter } from "next/navigation"

interface SavedProduct {
  id: string
  productId: string
  name: string
  price: number
  image: string
  category: string
  savedAt: any
}

export default function SavedProducts({ userId, onStatsUpdate }: { userId: string; onStatsUpdate?: (stats: any) => void }) {
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const { addItem } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    loadSavedProducts()
  }, [userId])

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  async function loadSavedProducts() {
    try {
      const savedRef = collection(db, "savedProducts")
      const q = query(savedRef, where("userId", "==", userId))
      
      const snapshot = await getDocs(q)
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedProduct[]

      setSavedProducts(products)

      // Update stats
      if (onStatsUpdate) {
        onStatsUpdate({ savedItems: products.length })
      }
    } catch (error) {
      console.error("Error loading saved products:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(savedId: string) {
    try {
      await deleteDoc(doc(db, "savedProducts", savedId))
      setSavedProducts(prev => prev.filter(p => p.id !== savedId))
      setToast({ message: "Removed from saved products", type: 'success' })
      
      if (onStatsUpdate) {
        onStatsUpdate({ savedItems: savedProducts.length - 1 })
      }
    } catch (error) {
      console.error("Error removing product:", error)
      setToast({ message: "Failed to remove product", type: 'error' })
    }
  }

  function handleAddToCart(product: SavedProduct) {
    addItem({
      id: product.productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    setToast({ message: "Added to cart!", type: 'success' })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 rounded-lg p-4 flex items-center justify-between ${
              toast.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckCircle className={`h-5 w-5 ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
              <p className={`font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {toast.message}
              </p>
            </div>
            <button onClick={() => setToast(null)}>
              <XIcon className="h-4 w-4 text-gray-500" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Saved Products</h2>
        <p className="text-sm text-gray-500">
          {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      {/* Products Grid */}
      {savedProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved products</h3>
          <p className="text-gray-500 mb-6">
            Start saving products to your wishlist for easy access later
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product, index) => {
            const imageUrl = product.image && product.image.trim() !== "" 
              ? product.image 
              : "/placeholder.png"

            const savedDate = product.savedAt?.toDate 
              ? product.savedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Recently'

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>

                  {/* Saved Badge */}
                  <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Saved {savedDate}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 capitalize mb-2">
                    {product.category?.replace(/-/g, " ")}
                  </p>
                  <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-orange-600 mb-4">
                    ₦{product.price.toLocaleString()}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-700 transition"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <Link
                      href={`/products/${product.productId}`}
                      className="p-2.5 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Add All to Cart */}
      {savedProducts.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              savedProducts.forEach(product => handleAddToCart(product))
              setToast({ message: `Added ${savedProducts.length} items to cart!`, type: 'success' })
            }}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            <ShoppingCart className="h-5 w-5" />
            Add All to Cart ({savedProducts.length})
          </button>
        </div>
      )}
    </div>
  )
}
