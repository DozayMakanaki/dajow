"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { categoryTree } from "@/lib/category-tree"
import { ArrowRight, Sparkles, TrendingUp, Zap, Star, Eye, ShoppingCart } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  section?: string
  views?: number
  orders?: number
  popularityScore?: number
}

interface SectionProducts {
  [key: string]: Product[]
}

export default function CategorySections() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [sectionProducts, setSectionProducts] = useState<SectionProducts>({})
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  // Fetch products for all sections
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const productsBySection: SectionProducts = {}

      try {
        // Loop through all categories and sections
        for (const category of categoryTree) {
          for (const section of category.sections) {
            const sectionKey = `${category.slug}-${section.slug}`
            
            // Try to get popular products first (with views/orders)
            const popularQuery = query(
              collection(db, "products"),
              where("category", "==", category.slug),
              where("section", "==", section.slug),
              orderBy("popularityScore", "desc"),
              limit(4)
            )

            try {
              const popularSnapshot = await getDocs(popularQuery)
              
              if (popularSnapshot.docs.length >= 4) {
                // We have enough popular products
                productsBySection[sectionKey] = popularSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                } as Product))
              } else {
                // Not enough popular products, get random ones
                const randomQuery = query(
                  collection(db, "products"),
                  where("category", "==", category.slug),
                  where("section", "==", section.slug),
                  limit(4)
                )
                
                const randomSnapshot = await getDocs(randomQuery)
                let products = randomSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data()
                } as Product))

                // Shuffle for randomness
                products = shuffleArray(products)
                productsBySection[sectionKey] = products.slice(0, 4)
              }
            } catch (error) {
              // If popularityScore index doesn't exist, fall back to random
              const fallbackQuery = query(
                collection(db, "products"),
                where("category", "==", category.slug),
                where("section", "==", section.slug),
                limit(4)
              )
              
              const snapshot = await getDocs(fallbackQuery)
              let products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              } as Product))

              // Shuffle for randomness
              products = shuffleArray(products)
              productsBySection[sectionKey] = products.slice(0, 4)
            }
          }
        }

        setSectionProducts(productsBySection)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Shuffle array helper
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  return (
    <section ref={containerRef} className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Hero Header */}
      <motion.div 
        style={{ opacity, scale }}
        className="text-center max-w-4xl mx-auto mb-20"
      >
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
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
            Premium Collections
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Explore handpicked categories designed to bring you the finest products from across Africa
        </motion.p>
      </motion.div>

      {/* Categories */}
      <div className="space-y-24">
        {categoryTree.map((category, categoryIndex) => (
          <motion.div 
            key={category.slug}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: categoryIndex * 0.1 }}
            className="relative"
          >
            {/* Category Header */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start md:items-center gap-5">
                  {/* Icon */}
                  <motion.div 
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl blur-xl opacity-50" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl flex items-center justify-center text-4xl md:text-5xl shadow-2xl">
                      {category.icon}
                    </div>
                  </motion.div>

                  {/* Text */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                        {category.name}
                      </h2>
                      {categoryIndex === 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                          <TrendingUp className="h-3 w-3" />
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* View All Button - Desktop */}
                <Link
                  href={`/products?category=${category.slug}`}
                  className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all group"
                >
                  View All
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Sections Grid */}
            <div className="space-y-12">
              {category.sections.map((section, sectionIndex) => {
                const sectionKey = `${category.slug}-${section.slug}`
                const products = sectionProducts[sectionKey] || []

                return (
                  <div key={section.slug} className="space-y-6">
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {section.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                      </div>
                      <Link
                        href={`/products?category=${category.slug}&section=${section.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
                      >
                        See All
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Products Grid - 4 per section */}
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
                              {/* Product Image */}
                              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.png"}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                
                                {/* Popularity Badges */}
                                {product.popularityScore && product.popularityScore > 10 && (
                                  <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Popular
                                  </div>
                                )}
                                
                                {/* Stats on Hover */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                  <div className="flex items-center gap-3 text-white text-xs">
                                    {product.views !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {product.views}
                                      </div>
                                    )}
                                    {product.orders !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <ShoppingCart className="h-3 w-3" />
                                        {product.orders}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="p-4">
                                <h4 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-lg font-bold text-orange-600 mt-2">
                                  ₦{product.price.toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <p className="text-gray-500">No products available in this section yet</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Mobile View All Link */}
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
        ))}
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
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000" />
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
            Browse our complete product catalog with thousands of items or get in touch with our dedicated support team
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all shadow-2xl"
            >
              View All Products
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-orange-800/50 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-900/50 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
