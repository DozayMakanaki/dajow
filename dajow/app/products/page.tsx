"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts, type Product } from "@/lib/products"
import { Filter, X, Grid3x3, LayoutGrid, ChevronRight, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"

// Section groupings (by product.section field)
const FOOD_SECTIONS = ["pantry", "fresh", ]
const GROCERIES_SECTIONS = ["groceries", "household", "beverages", "popular", "snacks", "dairy"]
const GRAINS_SECTIONS = ["grains"]
const MEAT_FISH_SECTIONS = ["meat","fish", "protein", "proteins"]
const SOAP_PERSONALCARE_SECTIONS = ["soap"]
const WIGS_SECTIONS = [ "wigs", "synthetic-hair", "hair-extensions", "beauty" ]

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

  // Active filters for each section
  const [foodFilter, setFoodFilter] = useState<string | null>(null)
  const [groceriesFilter, setGroceriesFilter] = useState<string | null>(null)
  const [grainsFilter, setGrainsFilter] = useState<string | null>(null)
  const [meatFishFilter, setMeatFishFilter] = useState<string | null>(null)
  const [soapFilter, setSoapFilter] = useState<string | null>(null)
  const [wigsFilter, setWigsFilter] = useState<string | null>(null)

  const [foodSheetOpen, setFoodSheetOpen] = useState(false)
  const [groceriesSheetOpen, setGroceriesSheetOpen] = useState(false)
  const [grainsSheetOpen, setGrainsSheetOpen] = useState(false)
  const [meatFishSheetOpen, setMeatFishSheetOpen] = useState(false)
  const [soapSheetOpen, setSoapSheetOpen] = useState(false)
  const [wigsSheetOpen, setWigsSheetOpen] = useState(false)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  // Group products by section
  const foodProducts = products.filter(p => FOOD_SECTIONS.includes(p.section || ""))
  const groceriesProducts = products.filter(p => GROCERIES_SECTIONS.includes(p.section || ""))
  const grainsProducts = products.filter(p => GRAINS_SECTIONS.includes(p.section || ""))
  const meatFishProducts = products.filter(p => MEAT_FISH_SECTIONS.includes(p.section || ""))
  const soapProducts = products.filter(p => SOAP_PERSONALCARE_SECTIONS.includes(p.section || ""))
  const wigsProducts = products.filter(p => WIGS_SECTIONS.includes(p.section || ""))

  const foodCategories = [...new Set(foodProducts.map(p => p.category).filter(Boolean))] as string[]
  const groceriesCategories = [...new Set(groceriesProducts.map(p => p.category).filter(Boolean))] as string[]
  const grainsCategories = [...new Set(grainsProducts.map(p => p.category).filter(Boolean))] as string[]
  const meatFishCategories = [...new Set(meatFishProducts.map(p => p.category).filter(Boolean))] as string[]
  const soapCategories = [...new Set(soapProducts.map(p => p.category).filter(Boolean))] as string[]
  const wigsCategories = [...new Set(wigsProducts.map(p => p.category).filter(Boolean))] as string[]

  function applyFiltersAndSort(list: Product[], filter: string | null) {
    let filtered = list.filter(p => {
      if (filter && p.category !== filter) return false
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

  const filteredFood = applyFiltersAndSort(foodProducts, foodFilter)
  const filteredGroceries = applyFiltersAndSort(groceriesProducts, groceriesFilter)
  const filteredGrains = applyFiltersAndSort(grainsProducts, grainsFilter)
  const filteredMeatFish = applyFiltersAndSort(meatFishProducts, meatFishFilter)
  const filteredSoap = applyFiltersAndSort(soapProducts, soapFilter)
  const filteredWigs = applyFiltersAndSort(wigsProducts, wigsFilter)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Products</h1>
              <p className="text-xs text-gray-500">
                {products.length} items · {foodProducts.length} food · {grainsProducts.length} grains · {meatFishProducts.length} meat/fish · {soapProducts.length} soap/care · {wigsProducts.length} beauty
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="flex-1 md:flex-none px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
              
              <div className="hidden md:flex border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={`p-2 rounded transition-all ${viewMode === "compact" ? "bg-orange-100 text-orange-600" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FOOD & GROCERIES SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {foodProducts.length > 0 && (
          <>
            <ProductSection
              title="Food & Groceries"
              subtitle="Rice, grains, pantry essentials & more"
              products={filteredFood}
              categories={foodCategories}
              activeFilter={foodFilter}
              setActiveFilter={setFoodFilter}
              sheetOpen={foodSheetOpen}
              setSheetOpen={setFoodSheetOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
            />

            <SectionDivider />
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* GROCERIES SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {groceriesProducts.length > 0 && (
          <>
            <ProductSection
              title="Groceries"
              subtitle="Everyday essentials & household items"
              products={filteredGroceries}
              categories={groceriesCategories}
              activeFilter={groceriesFilter}
              setActiveFilter={setGroceriesFilter}
              sheetOpen={groceriesSheetOpen}
              setSheetOpen={setGroceriesSheetOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
            />

            <SectionDivider />
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* GRAINS SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {grainsProducts.length > 0 && (
          <>
            <ProductSection
              title="Rice & Grains"
              subtitle="Basmati, jasmine, and specialty grains"
              products={filteredGrains}
              categories={grainsCategories}
              activeFilter={grainsFilter}
              setActiveFilter={setGrainsFilter}
              sheetOpen={grainsSheetOpen}
              setSheetOpen={setGrainsSheetOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
            />

            <SectionDivider />
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* MEAT & FISH SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {meatFishProducts.length > 0 && (
          <>
            <ProductSection
              title="Meat & Fish"
              subtitle="Fresh poultry, beef, and seafood"
              products={filteredMeatFish}
              categories={meatFishCategories}
              activeFilter={meatFishFilter}
              setActiveFilter={setMeatFishFilter}
              sheetOpen={meatFishSheetOpen}
              setSheetOpen={setMeatFishSheetOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
            />

            <SectionDivider />
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SOAP & PERSONAL CARE SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {soapProducts.length > 0 && (
          <>
            <ProductSection
              title="Soap & Personal Care"
              subtitle="Bath, body & skincare products"
              products={filteredSoap}
              categories={soapCategories}
              activeFilter={soapFilter}
              setActiveFilter={setSoapFilter}
              sheetOpen={soapSheetOpen}
              setSheetOpen={setSoapSheetOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              viewMode={viewMode}
            />

            <SectionDivider />
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIGS & BEAUTY SECTION */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {wigsProducts.length > 0 && (
          <ProductSection
            title="Wigs & Beauty"
            subtitle="Hair extensions, wigs & accessories"
            products={filteredWigs}
            categories={wigsCategories}
            activeFilter={wigsFilter}
            setActiveFilter={setWigsFilter}
            sheetOpen={wigsSheetOpen}
            setSheetOpen={setWigsSheetOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  )
}

// ─── Section Divider Component ────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="relative my-16">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-2 border-gray-200" />
      </div>
      <div className="relative flex justify-center">
        <div className="bg-gray-50 px-6">
          <div className="w-2 h-2 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── Product Section Component ────────────────────────────────────────────────
interface ProductSectionProps {
  title: string
  subtitle: string
  products: Product[]
  categories: string[]
  activeFilter: string | null
  setActiveFilter: (filter: string | null) => void
  sheetOpen: boolean
  setSheetOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  viewMode: "grid" | "compact"
}

function ProductSection({
  title,
  subtitle,
  products,
  categories,
  activeFilter,
  setActiveFilter,
  sheetOpen,
  setSheetOpen,
  searchQuery,
  setSearchQuery,
  viewMode
}: ProductSectionProps) {
  
  function clearFilter() {
    setActiveFilter(null)
    setSheetOpen(false)
  }

  return (
    <div className="mb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{title}</h2>
          <p className="text-sm text-gray-500">
            {subtitle} · {products.length} products
            {activeFilter && (
              <span className="ml-2 text-orange-600 font-medium">
                in "{activeFilter.replace(/-/g, " ")}"
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {categories.length > 1 && (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {activeFilter && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      1
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-full max-w-sm p-0 flex flex-col [&>button:first-child]:hidden">
                <div className="flex items-center gap-3 px-4 py-4 border-b bg-white sticky top-0 z-10">
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Filter {title}</p>
                    {activeFilter && <p className="text-xs text-orange-600">1 filter active</p>}
                  </div>
                  {activeFilter && (
                    <button onClick={clearFilter} className="text-xs font-semibold text-red-500 hover:text-red-700">
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</p>

                  <button
                    onClick={clearFilter}
                    className={`w-full text-left px-4 py-4 rounded-xl font-semibold transition-all ${
                      !activeFilter ? "bg-orange-600 text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    All Categories
                  </button>

                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveFilter(cat === activeFilter ? null : cat)
                        setSheetOpen(false)
                      }}
                      className={`w-full text-left px-4 py-4 rounded-xl capitalize font-medium transition-all ${
                        activeFilter === cat ? "bg-orange-600 text-white shadow-md" : "bg-gray-50 text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      {cat.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-48 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chip */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-2 mb-4"
          >
            <button
              onClick={clearFilter}
              className="flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
            >
              {activeFilter.replace(/-/g, " ")}
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Category Pills */}
      {categories.length > 1 && (
        <div className="hidden md:flex flex-wrap gap-2 mb-6">
          <button
            onClick={clearFilter}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeFilter ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat === activeFilter ? null : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                activeFilter === cat ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? <EmptyState onClear={clearFilter} /> : <ProductGrid products={products} viewMode={viewMode} />}
    </div>
  )
}

// ─── Product Grid ─────────────────────────────────────────────────────────────
function ProductGrid({ products, viewMode }: { products: Product[]; viewMode: "grid" | "compact" }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-3 md:gap-5 ${
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
            className="group block bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden border border-gray-100"
          >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <img
                src={product.image && product.image.trim() !== "" ? product.image : "/placeholder.png"}
                alt={product.name || "Product"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={e => { e.currentTarget.src = "/placeholder.png" }}
              />
              <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    View <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2.5 md:p-4 space-y-1">
              <h3 className="font-semibold text-xs md:text-sm line-clamp-2 leading-tight min-h-[2rem] group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-[10px] md:text-xs text-gray-400 capitalize truncate">
                {product.category?.replace(/-/g, " ")}
              </p>
              <p className="font-bold text-orange-600 text-sm md:text-lg">
                £{product.price?.toLocaleString() || "0"}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border">
      <div className="text-5xl mb-3">🔍</div>
      <h3 className="text-xl font-bold mb-2">No products found</h3>
      <p className="text-gray-500 text-sm mb-6">Try adjusting your filters</p>
      <Button onClick={onClear} size="sm" className="bg-orange-600 hover:bg-orange-700">
        Clear Filters
      </Button>
    </div>
  )
}
