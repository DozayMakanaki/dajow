"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { categoryTree } from "@/lib/category-tree"
import { ArrowRight, Sparkles, TrendingUp, Zap, Star } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { collection, query, where, getDocs, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface CategoryProducts {
  [key: string]: Product[]
}

export default function CategorySections() {
  const [categoryProducts, setCategoryProducts] = useState<CategoryProducts>({})
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const result: CategoryProducts = {}

      try {
        for (const category of categoryTree) {
          const q = query(
            collection(db, "products"),
            where("category", "==", category.slug),
            limit(4)
          )
          const snapshot = await getDocs(q)
          result[category.slug] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as Product))
        }
        setCategoryProducts(result)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <section ref={containerRef} className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <motion.div style={{ opacity, scale }} className="text-center max-w-4xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          Shop by Category
          <Zap className="h-4 w-4" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
        >
          Discover Our{" "}
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Premium Collections
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Explore handpicked categories designed to bring you the finest products
        </motion.p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-24">
        {categoryTree.map((category, categoryIndex) => {
          const products = categoryProducts[category.slug] || []

          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl blur-xl opacity-50" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl flex items-center justify-center text-4xl md:text-5xl shadow-2xl">
                      {category.icon}
                    </div>
                  </motion.div>

                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900">{category.name}</h2>
                      {categoryIndex === 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                          <TrendingUp className="h-3 w-3" />
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-base md:text-lg">{category.description}</p>
                  </div>
                </div>

                <Link
                  href={`/products?category=${category.slug}`}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all group"
                >
                  View All
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product, productIndex) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: productIndex * 0.1 }}
                      whileHover={{ y: -8 }}
                    >
                      <Link
                        href={`/products/${product.id}`}
                        className="group block bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-300 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png"
                            }}
                          />
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-lg font-bold text-orange-600 mt-2">
                            £{product.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <p className="text-gray-400">No products in this category yet</p>
                </div>
              )}

              {/* Mobile View All */}
              <Link
                href={`/products?category=${category.slug}`}
                className="md:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all mt-8"
              >
                View All {category.name}
                <ArrowRight className="h-5 w-5" />
              </Link>

              {/* Divider */}
              {categoryIndex < categoryTree.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-16 origin-center"
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mt-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 rounded-3xl" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative p-10 md:p-16 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Star className="h-4 w-4 fill-white" />
            Premium Quality Guaranteed
          </div>

          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Can't Find What You're<br />Looking For?
          </h3>

          <p className="text-orange-100 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Browse our complete product catalog or get in touch with our support team
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all shadow-2xl"
            >
              View All Products
              <ArrowRight className="h-6 w-6" />
            </Link>
            
          </div>
        </div>
      </motion.div>
    </section>
  )
}
