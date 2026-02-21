"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts, type Product } from "@/lib/products"
import { Filter, X, Grid3x3, LayoutGrid, ChevronRight, Search, Sparkles, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

const WIGS_CATEGORY = "wigs"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured")
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const [foodCategory, setFoodCategory] = useState<string | null>(null)
  const [wigsSection, setWigsSection] = useState<string | null>(null)

  const [foodSheetOpen, setFoodSheetOpen] = useState(false)
  const [wigsSheetOpen, setWigsSheetOpen] = useState(false)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full mx-auto"
          />
          <p className="text-gray-600 font-semibold">Loading amazing products...</p>
        </motion.div>
      </div>
    )
  }

  const foodProducts = products.filter(p => p.category !== WIGS_CATEGORY)
  const wigsProducts = products.filter(p => p.category === WIGS_CATEGORY)

  const foodCategories = [...new Set(foodProducts.map(p => p.category).filter(Boolean))] as string[]
  const wigsSections   = [...new Set(wigsProducts.map(p => p.section).filter(Boolean))] as string[]

  function applyFiltersAndSort(list: Product[], catFilter: string | null, secFilter: string | null) {
    let filtered = list.filter(p => {
      if (catFilter && p.category !== catFilter) return false
      if (secFilter && p.section !== secFilter) return false
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":  return a.price - b.price
        case "price-high": return b.price - a.price
        case "name":       return a.name.localeCompare(b.name)
        default: return 0
      }
    })
  }

  const filteredFood = applyFiltersAndSort(foodProducts, foodCategory, null)
  const filteredWigs = applyFiltersAndSort(wigsProducts, null, wigsSection)

  function clearFood() {
    setFoodCategory(null)
    setFoodSheetOpen(false)
  }
  function clearWigs() {
    setWigsSection(null)
    setWigsSheetOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">

      {/* Top Bar with Stats */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            {/* Left: Title + Count */}
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🛍️
              </motion.div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900">All Products</h1>
                <p className="text-xs text-gray-500">
                  {products.length} items · {foodProducts.length} groceries · {wigsProducts.length} beauty
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="flex-1 md:flex-none px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
              
              <div className="hidden md:flex border rounded-xl p-1 bg-gray-50">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("compact")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "compact" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 pb-20 pt-6">

        {/* ─── FOOD & GROCERIES SECTION ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg">
                🛒
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  Food & Groceries
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredFood.length} products
                  {foodCategory && (
                    <span className="ml-2 text-orange-600 font-semibold">
                      in "{foodCategory.replace(/-/g, " ")}"
                    </span>
                  )}
                </p>
              </div>
            </motion.div>

            <div className="flex items-center gap-2">
              <Sheet open={foodSheetOpen} onOpenChange={setFoodSheetOpen}>
                <SheetTrigger asChild>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="sm" className="relative shadow-sm hover:shadow-md transition-shadow">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {foodCategory && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                        >
                          1
                        </motion.span>
                      )}
                    </Button>
                  </motion.div>
                </SheetTrigger>

                <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col [&>button:first-child]:hidden">
                  <div className="flex items-center gap-3 px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
                    <button
                      onClick={() => setFoodSheetOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">Filter Food</p>
                      {foodCategory && <p className="text-xs text-orange-600">1 filter active</p>}
                    </div>
                    {foodCategory && (
                      <button onClick={clearFood} className="text-xs font-bold text-red-500 hover:text-red-700">
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</p>

                    <button
                      onClick={clearFood}
                      className={`w-full text-left px-4 py-4 rounded-xl font-semibold transition-all ${
                        !foodCategory ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg" : "bg-gray-50 text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      All Categories
                    </button>

                    {foodCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFoodCategory(cat === foodCategory ? null : cat)
                          setFoodSheetOpen(false)
                        }}
                        className={`w-full text-left px-4 py-4 rounded-xl capitalize font-medium transition-all ${
                          foodCategory === cat ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg" : "bg-gray-50 text-gray-700 hover:bg-orange-50"
                        }`}
                      >
                        {cat.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-48 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Chip */}
          <AnimatePresence>
            {foodCategory && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 mb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFood}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold hover:from-orange-200 hover:to-orange-100 transition-all shadow-sm"
                >
                  {foodCategory.replace(/-/g, " ")}
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Category Pills */}
          {foodCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex flex-wrap gap-2 mb-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFood}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  !foodCategory ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md" : "bg-white border-2 text-gray-600 hover:border-orange-400"
                }`}
              >
                All
              </motion.button>
              {foodCategories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFoodCategory(cat === foodCategory ? null : cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                    foodCategory === cat ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md" : "bg-white border-2 text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {cat.replace(/-/g, " ")}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Products Grid */}
          {filteredFood.length === 0 ? <EmptyState onClear={clearFood} /> : <ProductGrid products={filteredFood} viewMode={viewMode} />}
        </motion.div>

        {/* ─── ELEGANT DIVIDER ──────────────────────────────────────────── */}
        {wigsProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative my-20"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-gradient-to-r from-gray-50 via-white to-gray-50 px-8 py-3 flex items-center gap-3 rounded-full shadow-lg border-2 border-gray-100"
              >
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-black text-gray-600 uppercase tracking-wider">Beauty & Hair</span>
                <Sparkles className="h-5 w-5 text-orange-500" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ─── WIGS & BEAUTY SECTION ────────────────────────────────────── */}
        {wigsProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-3xl shadow-lg">
                  💇‍♀️
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    Wigs & Beauty
                  </h2>
                  <p className="text-sm text-gray-500">
                    {filteredWigs.length} products
                    {wigsSection && (
                      <span className="ml-2 text-orange-600 font-semibold">
                        in "{wigsSection.replace(/-/g, " ")}"
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>

              {wigsSections.length > 0 && (
                <Sheet open={wigsSheetOpen} onOpenChange={setWigsSheetOpen}>
                  <SheetTrigger asChild>
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" className="relative shadow-sm hover:shadow-md transition-shadow">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                        {wigsSection && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                          >
                            1
                          </motion.span>
                        )}
                      </Button>
                    </motion.div>
                  </SheetTrigger>

                  <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col [&>button:first-child]:hidden">
                    <div className="flex items-center gap-3 px-4 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50 sticky top-0 z-10">
                      <button
                        onClick={() => setWigsSheetOpen(false)}
                        className="p-2 rounded-lg hover:bg-white/50 active:bg-white transition-colors -ml-1"
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">Filter Wigs & Hair</p>
                        {wigsSection && <p className="text-xs text-orange-600">1 filter active</p>}
                      </div>
                      {wigsSection && (
                        <button onClick={clearWigs} className="text-xs font-bold text-red-500 hover:text-red-700">
                          Clear
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sections</p>

                      <button
                        onClick={clearWigs}
                        className={`w-full text-left px-4 py-4 rounded-xl font-semibold transition-all ${
                          !wigsSection ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" : "bg-gray-50 text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                        All Sections
                      </button>

                      {wigsSections.map(sec => (
                        <button
                          key={sec}
                          onClick={() => {
                            setWigsSection(sec === wigsSection ? null : sec)
                            setWigsSheetOpen(false)
                          }}
                          className={`w-full text-left px-4 py-4 rounded-xl capitalize font-medium transition-all ${
                            wigsSection === sec ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg" : "bg-gray-50 text-gray-700 hover:bg-purple-50"
                          }`}
                        >
                          {sec.replace(/-/g, " ")}
                        </button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>

            {/* Active Filter Chip */}
            <AnimatePresence>
              {wigsSection && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearWigs}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-200 hover:to-pink-200 transition-all shadow-sm"
                  >
                    {wigsSection.replace(/-/g, " ")}
                    <X className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Section Pills */}
            {wigsSections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hidden md:flex flex-wrap gap-2 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearWigs}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    !wigsSection ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md" : "bg-white border-2 text-gray-600 hover:border-purple-400"
                  }`}
                >
                  All
                </motion.button>
                {wigsSections.map(sec => (
                  <motion.button
                    key={sec}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWigsSection(sec === wigsSection ? null : sec)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                      wigsSection === sec ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md" : "bg-white border-2 text-gray-600 hover:border-purple-400"
                    }`}
                  >
                    {sec.replace(/-/g, " ")}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Products Grid */}
            {filteredWigs.length === 0 ? <EmptyState onClear={clearWigs} /> : <ProductGrid products={filteredWigs} viewMode={viewMode} />}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Product Grid with Animations ─────────────────────────────────────────────
function ProductGrid({ products, viewMode }: { products: Product[]; viewMode: "grid" | "compact" }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-4 md:gap-5 ${
        viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
      }`}
    >
      {products.map((product, index) => (
        <motion.div 
          key={`product-${index}`} 
          variants={itemVariants}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={`/products/${product.id}`}
            className="group block"
          >
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                <img
                  src={product.image && product.image.trim() !== "" ? product.image : "/placeholder.png"}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.currentTarget.src = "/placeholder.png" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                >
                  View <ChevronRight className="h-3 w-3" />
                </motion.div>
              </div>
              <div className="p-3 md:p-4 space-y-2">
                <h3 className="font-bold text-sm md:text-base line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-400 capitalize truncate font-medium">
                  {product.category?.replace(/-/g, " ")}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-black text-orange-600 text-base md:text-xl">
                    £{product.price?.toLocaleString() || "0"}
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center"
                  >
                    <ShoppingBag className="h-4 w-4 text-orange-600" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Empty State with Animation ───────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-white rounded-2xl border-2 border-dashed"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-4"
      >
        🔍
      </motion.div>
      <h3 className="text-2xl font-bold mb-2 text-gray-900">No products found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your filters or search</p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={onClear} className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg">
          Clear Filters
        </Button>
      </motion.div>
    </motion.div>
  )
}
