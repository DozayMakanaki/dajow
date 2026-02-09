"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { categoryTree } from "@/lib/category-tree"
import { ArrowRight, Sparkles, TrendingUp, Zap, Star } from "lucide-react"
import { useState, useRef } from "react"

export default function CategorySections() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-8 mt-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">20+</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">1000+</div>
            <div className="text-sm text-gray-500">Products</div>
          </div>
          <div className="w-px bg-gray-200" />
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">4.9</div>
            <div className="text-sm text-gray-500">
              <Star className="inline h-3 w-3 fill-orange-500 text-orange-500" /> Rating
            </div>
          </div>
        </motion.div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {category.sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: sectionIndex * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onHoverStart={() => setHoveredSection(`${category.slug}-${section.slug}`)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <Link
                    href={`/products?category=${category.slug}&section=${section.slug}`}
                    className="group relative block overflow-hidden rounded-3xl bg-white border-2 border-gray-100 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image Container */}
                    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                      <Image
                        src={section.image || "/placeholder.png"}
                        alt={section.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-2"
                        unoptimized={!section.image?.startsWith('http')}
                      />
                      
                      {/* Multi-layered Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Animated Badge */}
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={hoveredSection === `${category.slug}-${section.slug}` 
                          ? { scale: 1, rotate: 0 } 
                          : { scale: 0, rotate: -180 }
                        }
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg"
                      >
                        <Sparkles className="inline h-3 w-3 mr-1" />
                        Explore
                      </motion.div>

                      {/* Bottom Gradient Label on Hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center justify-between text-white">
                          <span className="text-sm font-bold">Shop Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem]">
                        {section.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {section.description}
                      </p>
                      
                      {/* Animated Arrow */}
                      <div className="flex items-center text-orange-600 text-xs font-bold pt-2">
                        <span className="group-hover:mr-2 transition-all duration-300">Discover</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile View All Link */}
            <Link
              href={`/products?category=${category.slug}`}
              className="md:hidden flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all mt-8"
            >
              View All {category.name}
              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* Divider with Animation */}
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

      {/* Bottom CTA - Enhanced */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mt-32 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 rounded-3xl" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="relative p-10 md:p-16 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-50 transition-all shadow-2xl group"
                >
                  View All Products
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-3 bg-orange-800/50 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-orange-900/50 transition-all"
                >
                  Contact Support
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Add animations CSS */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  )
}
