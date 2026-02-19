"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProductById, trackProductView, type Product } from "@/lib/products"
import Image from "next/image"
import { useCartStore } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingCart, Heart, Star, Package, TruckIcon, ShieldCheck, Check, Share2, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

interface ProductVariant {
  size?: string
  color?: string
  price: number
}

// Enhanced color mapping
const COLOR_MAP: { [key: string]: string } = {
  '1': '#000000',
  '2': '#1B1B1B', 
  '4': '#2C1810',
  '27': '#C69963',
  '30': '#8B4513',
  '33': '#D2691E',
  'BLACK': '#000000',
  'YELLOW': '#FFD700',
  'IJGB': '#FFD700',
  'SILVER': '#C0C0C0',
  'MIDNIGHT PURPLE': '#2C1B47',
  'ORANGE': '#FF6B35',
  'T.G': '#FF6B35',
  'SEABLUE': '#006994',
  'SEA BLUE': '#006994',
  'RUBY PINK': '#E0115F',
  'RED': '#FF0000',
  'CHAPMAN': '#8B0000',
  'GOLD': '#FFD700',
  'ROYAL BLUE': '#4169E1',
  'NAVY BLUE': '#000080',
  'PINK': '#FFC0CB',
  'GREY': '#808080',
  'GRAY': '#808080',
  'BROWN': '#8B4513',
  'CREAM WHITE': '#FFFDD0',
  'PURPLE': '#800080',
  'BURGUNDY': '#800020',
  'GREEN': '#008000',
  'CARAMEL': '#C68E17',
  'WHITE': '#FFFFFF',
  'T1B/27': 'linear-gradient(135deg, #1B1B1B 50%, #C69963 50%)',
  'T1B/30': 'linear-gradient(135deg, #1B1B1B 50%, #8B4513 50%)',
  'T1B/3501': 'linear-gradient(135deg, #1B1B1B 33%, #8B4513 33%, #8B4513 66%, #D2691E 66%)',
  'T1B/3502': 'linear-gradient(135deg, #1B1B1B 33%, #C69963 33%, #C69963 66%, #FFD700 66%)',
  'T1B/27/613': 'linear-gradient(120deg, #1B1B1B 33%, #C69963 33%, #C69963 66%, #FFE5B4 66%)',
  'T1B/30/27': 'linear-gradient(120deg, #1B1B1B 33%, #8B4513 33%, #8B4513 66%, #C69963 66%)',
  '1/27': 'linear-gradient(135deg, #000000 50%, #C69963 50%)',
  '1/30': 'linear-gradient(135deg, #000000 50%, #8B4513 50%)',
  '1/PINK': 'linear-gradient(135deg, #000000 50%, #FFC0CB 50%)',
  '1/RED': 'linear-gradient(135deg, #000000 50%, #FF0000 50%)',
  '1&27': 'linear-gradient(135deg, #000000 50%, #C69963 50%)',
  '1/GOLD': 'linear-gradient(135deg, #000000 50%, #FFD700 50%)',
  '1BG 900': 'linear-gradient(135deg, #1B1B1B 50%, #FFD700 50%)',
  'TEGAS': '#FF6B35',
}

function getColorHex(colorName: string): string {
  const upper = colorName.toUpperCase().trim()
  return COLOR_MAP[upper] || COLOR_MAP[colorName.trim()] || '#CCCCCC'
}

// FIXED: Proper TypeScript typing
function parseVariants(variants: any[]): ProductVariant[] {
  if (!variants || !Array.isArray(variants)) return []
  
  const parsed = variants.map(variant => {
    if (typeof variant === 'object' && (variant.size || variant.color) && variant.price) {
      return {
        size: variant.size ? String(variant.size) : undefined,
        color: variant.color ? String(variant.color) : undefined,
        price: Number(variant.price) || 0
      }
    }
    
    if (typeof variant === 'string') {
      try {
        const sizeMatch = variant.match(/size:\s*["']?([^"'\s]+)["']?/)
        const colorMatch = variant.match(/color:\s*["']?([^"',]+)["']?/i)
        const priceMatch = variant.match(/price:\s*([0-9.]+)/)
        
        if (priceMatch) {
          return {
            size: sizeMatch ? sizeMatch[1] : undefined,
            color: colorMatch ? colorMatch[1].trim() : undefined,
            price: Number(priceMatch[1]) || 0
          }
        }
      } catch (e) {
        console.error('Error parsing variant:', variant, e)
      }
    }
    
    return null
  })
  
  // Properly filter out null values
  return parsed.filter((v): v is ProductVariant => v !== null)
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [parsedVariants, setParsedVariants] = useState<ProductVariant[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (!id) return

    getProductById(id)
      .then((data) => {
        if (!data) {
          setProduct(null)
          setLoading(false)
          return
        }
        
        setProduct(data)
        
        if (data.hasVariants && data.variants) {
          const parsed = parseVariants(data.variants)
          setParsedVariants(parsed)
          
          if (parsed.length > 0) {
            setSelectedVariant(parsed[0])
          }
        }
        
        trackProductView(id)
      })
      .catch((error) => {
        console.error("Error loading product:", error)
        setProduct(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    if (product.hasVariants && !selectedVariant) {
      return
    }

    const finalPrice = product.hasVariants && selectedVariant
      ? selectedVariant.price
      : Number(product.price) || 0

    let itemName = product.name
    if (product.hasVariants && selectedVariant) {
      if (selectedVariant.size && selectedVariant.color) {
        itemName = `${product.name} - ${selectedVariant.size} / ${selectedVariant.color}`
      } else if (selectedVariant.size) {
        itemName = `${product.name} - ${selectedVariant.size}`
      } else if (selectedVariant.color) {
        itemName = `${product.name} - ${selectedVariant.color}`
      }
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: itemName,
        price: finalPrice,
        image: product.image,
        quantity: 1
      })
    }

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const displayPrice = product?.hasVariants && selectedVariant
    ? selectedVariant.price
    : (Number(product?.price) || 0)

  const hasColors = parsedVariants.length > 0 && parsedVariants.some(v => v.color)
  const hasSizes = parsedVariants.length > 0 && parsedVariants.some(v => v.size)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-gray-900">Product Not Found</h1>
          <p className="text-gray-500 mb-8">The product you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/products')} size="lg" className="bg-orange-600 hover:bg-orange-700">
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 shadow-2xl">
              <Image
                src={product.image || "/placeholder.png"}
                alt={product.name || "Product"}
                fill
                className="object-cover"
                unoptimized={!product.image || !product.image.startsWith('http')}
              />
              
              {product.section && (
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-orange-600 rounded-full text-xs font-bold uppercase shadow-lg">
                    {product.section.replace(/-/g, " ")}
                  </span>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                <TruckIcon className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Easy Returns</span>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm font-semibold capitalize">
                  {product.category.replace(/-/g, " ")}
                </span>
              )}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">(4.9)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              {product.name || "Unnamed Product"}
            </h1>

            {/* Price */}
            <div className="py-4 border-y">
              <motion.div
                key={displayPrice}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-baseline gap-3"
              >
                <span className="text-5xl font-black text-orange-600">
                  £{displayPrice.toFixed(2)}
                </span>
                {selectedVariant && (
                  <span className="text-lg text-gray-500 font-medium">
                    {selectedVariant.size && selectedVariant.size}
                    {selectedVariant.color && selectedVariant.color}
                  </span>
                )}
              </motion.div>
              <p className="text-sm text-gray-500 mt-2">Tax included • Free shipping over £50</p>
            </div>

            {/* Color Selector */}
            {product.hasVariants && hasColors && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Color
                  </label>
                  {selectedVariant?.color && (
                    <span className="text-sm font-semibold text-orange-600">
                      {selectedVariant.color}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {parsedVariants.map((variant, index) => {
                    if (!variant.color) return null
                    
                    const isSelected = selectedVariant?.color === variant.color
                    const colorHex = getColorHex(variant.color)
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedVariant(variant)}
                        className="relative group"
                      >
                        <div
                          className={`w-16 h-16 rounded-2xl border-3 transition-all ${
                            isSelected
                              ? "border-orange-600 shadow-lg ring-4 ring-orange-100"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                          style={{ background: colorHex }}
                        >
                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white rounded-full p-1">
                                <Check className="h-5 w-5 text-orange-600" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-center mt-2 font-medium text-gray-600 max-w-[64px] truncate">
                          {variant.color}
                        </p>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.hasVariants && hasSizes && !hasColors && (
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Select Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {parsedVariants.map((variant, index) => {
                    if (!variant.size) return null
                    
                    const isSelected = selectedVariant?.size === variant.size
                    
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative p-5 rounded-2xl border-2 transition-all ${
                          isSelected
                            ? "border-orange-600 bg-orange-50 shadow-lg"
                            : "border-gray-200 hover:border-orange-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                        <div className="text-center">
                          <p className={`font-bold text-xl ${isSelected ? 'text-orange-600' : 'text-gray-900'}`}>
                            {variant.size}
                          </p>
                          <p className="text-xs mt-1 font-semibold text-orange-600">
                            £{variant.price.toFixed(2)}
                          </p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-2xl p-2">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-700" />
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    £{(displayPrice * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.hasVariants && !selectedVariant}
                size="lg"
                className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="mr-3 h-6 w-6" />
                Add to Cart
              </Button>

              {product.hasVariants && !selectedVariant && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-center text-red-500 font-medium"
                >
                  Please select {hasColors ? 'a color' : 'a size'} to continue
                </motion.p>
              )}
            </div>

            {/* Product Description */}
            <div className="pt-8 border-t">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Product Details</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description || `${product.name} is a premium quality product carefully selected to meet your needs. Perfect for everyday use and specially crafted to deliver exceptional value.`}
              </p>

              {product.hasVariants && parsedVariants.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    All Available Options
                  </h4>
                  <div className="space-y-2">
                    {parsedVariants.map((variant, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {variant.size && <span className="font-medium">{variant.size}</span>}
                          {variant.size && variant.color && ' • '}
                          {variant.color && <span className="font-medium">{variant.color}</span>}
                        </span>
                        <span className="font-bold text-orange-600">£{variant.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Added to cart!</p>
                <p className="text-sm text-green-100">{quantity} item{quantity > 1 ? 's' : ''} added</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}