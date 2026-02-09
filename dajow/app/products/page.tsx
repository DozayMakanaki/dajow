"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, type Product } from "@/lib/products"
import { Filter, X, Grid3x3, LayoutGrid, ChevronRight, TrendingUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function ProductsPage() {
  // ✅ Fix: Correct state types
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [section, setSection] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured")
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium text-sm md:text-base">Loading products...</p>
        </div>
      </div>
    )
  }

  const categories = [...new Set(products.map(p => p.category))]
  const sections = [...new Set(products.map(p => p.section).filter(Boolean))] as string[]

  // Filter products
  let filtered = products.filter(p => {
    if (category && p.category !== category) return false
    if (section && p.section !== section) return false
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Sort products
  filtered = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setCategory(null)
    setSection(null)
    setSearchQuery("")
  }

  const activeFiltersCount = [category, section].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Mobile Hero - Compact */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="py-6 md:py-12 space-y-3 md:space-y-4">
            <h1 className="text-2xl md:text-5xl font-bold">Shop Products</h1>
            <p className="text-orange-100 text-sm md:text-lg">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Mobile Search */}
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-300" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 backdrop-blur text-white placeholder:text-orange-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8 md:pb-20">
        
        {/* Mobile Controls Bar */}
        <div className="sticky top-0 z-40 bg-white border-b py-3 -mx-4 px-4 md:static md:border-0 md:py-0 md:mt-6">
          <div className="flex items-center justify-between gap-2">
            
            {/* Filter Button - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="relative flex-1 md:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-xl">Filters</SheetTitle>
                </SheetHeader>
                <MobileFilters
                  categories={categories}
                  sections={sections}
                  category={category}
                  section={section}
                  setCategory={setCategory}
                  setSection={setSection}
                  clearFilters={clearFilters}
                />
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown - Mobile Friendly */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1 md:flex-none px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* View Toggle - Desktop Only */}
            <div className="hidden md:flex border rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-2 rounded transition-all ${viewMode === "compact" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"}`}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {category && (
                <button
                  onClick={() => setCategory(null)}
                  className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
                >
                  {category.replace(/-/g, " ")}
                  <X className="h-3 w-3" />
                </button>
              )}
              {section && (
                <button
                  onClick={() => setSection(null)}
                  className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0"
                >
                  {section.replace(/-/g, " ")}
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-orange-600 font-medium whitespace-nowrap shrink-0"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 mt-6">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-4 sticky top-24 h-fit">
            <div className="bg-white rounded-xl border shadow-sm p-5 space-y-5">
              
              {/* Desktop Search */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3 text-sm text-gray-700">Categories</h3>
                <div className="space-y-1.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat === category ? null : cat)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all capitalize text-sm ${
                        category === cat 
                          ? "bg-orange-600 text-white shadow-sm" 
                          : "hover:bg-orange-50 text-gray-700"
                      }`}
                    >
                      {cat.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections */}
              {sections.length > 0 && (
                <div className="border-t pt-5">
                  <h3 className="font-semibold mb-3 text-sm text-gray-700">Sections</h3>
                  <div className="space-y-1.5">
                    {sections.map(sec => (
                      <button
                        key={sec}
                        onClick={() => setSection(sec === section ? null : sec)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition-all capitalize text-sm ${
                          section === sec 
                            ? "bg-orange-600 text-white shadow-sm" 
                            : "hover:bg-orange-50 text-gray-700"
                        }`}
                      >
                        {sec.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear */}
              {(category || section) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="w-full text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Promo Card */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl p-5 text-white">
              <TrendingUp className="h-7 w-7 mb-2" />
              <h4 className="font-bold text-sm mb-1">Hot Deals!</h4>
              <p className="text-xs text-orange-100 mb-3">Up to 30% off</p>
              <Link href="/deals" className="text-xs font-semibold underline">
                Shop Now →
              </Link>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 md:py-20 bg-white rounded-xl border">
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">🔍</div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">No products found</h3>
                <p className="text-gray-600 text-sm md:text-base mb-4 md:mb-6">Try adjusting your filters</p>
                <Button 
                  onClick={clearFilters} 
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-3 md:gap-5 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5"
                }`}
              >
                {filtered.map((product) => {
                  const imageUrl = product.image && product.image.trim() !== "" 
                    ? product.image 
                    : "/placeholder.png"

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="group block bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden border border-gray-100"
                    >
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name || "Product"}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={!imageUrl.startsWith('http')}
                        />
                        
                        <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                              View
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 md:p-4 space-y-1 md:space-y-2">
                        <h3 className="font-semibold text-xs md:text-sm line-clamp-2 leading-tight min-h-[2rem] md:min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                        
                        {viewMode === "grid" && (
                          <p className="text-[10px] md:text-xs text-gray-500 capitalize truncate">
                            {product.category?.replace(/-/g, " ")}
                          </p>
                        )}

                        <p className="font-bold text-orange-600 text-sm md:text-lg">
                          ₦{product.price?.toLocaleString() || '0'}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

interface MobileFiltersProps {
  categories: string[]
  sections: string[]
  category: string | null
  section: string | null
  setCategory: (cat: string | null) => void
  setSection: (sec: string | null) => void
  clearFilters: () => void
}

function MobileFilters({ 
  categories, 
  sections, 
  category, 
  section, 
  setCategory, 
  setSection, 
  clearFilters 
}: MobileFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-orange-600 text-sm">Categories</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? null : cat)}
              className={`block w-full text-left px-4 py-3 rounded-lg capitalize transition-all touch-manipulation ${
                category === cat 
                  ? "bg-orange-600 text-white shadow-md" 
                  : "bg-gray-50 hover:bg-orange-50 text-gray-700 active:bg-orange-100"
              }`}
            >
              {cat.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {sections.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-orange-600 text-sm">Sections</h3>
          <div className="space-y-2">
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setSection(sec === section ? null : sec)}
                className={`block w-full text-left px-4 py-3 rounded-lg capitalize transition-all touch-manipulation ${
                  section === sec 
                    ? "bg-orange-600 text-white shadow-md" 
                    : "bg-gray-50 hover:bg-orange-50 text-gray-700 active:bg-orange-100"
                }`}
              >
                {sec.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {(category || section) && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full touch-manipulation"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
