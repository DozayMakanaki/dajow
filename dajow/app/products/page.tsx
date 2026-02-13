"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getProducts, type Product } from "@/lib/products"
import { Filter, X, Grid3x3, LayoutGrid, ChevronRight, TrendingUp, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const WIGS_CATEGORY = "wigs"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "name">("featured")
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  // Separate filters for each section
  const [foodCategory, setFoodCategory] = useState<string | null>(null)
  const [wigsSection, setWigsSection] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  // Split into food and wigs
  const foodProducts = products.filter(p => p.category !== WIGS_CATEGORY)
  const wigsProducts = products.filter(p => p.category === WIGS_CATEGORY)

  const foodCategories = [...new Set(foodProducts.map(p => p.category))]
  const wigsSections = [...new Set(wigsProducts.map(p => p.section).filter(Boolean))] as string[]

  // Apply filters + search + sort
  function applyFiltersAndSort(list: Product[], catFilter: string | null, secFilter: string | null) {
    let filtered = list.filter(p => {
      if (catFilter && p.category !== catFilter) return false
      if (secFilter && p.section !== secFilter) return false
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price
        case "price-high": return b.price - a.price
        case "name": return a.name.localeCompare(b.name)
        default: return 0
      }
    })
  }

  const filteredFood = applyFiltersAndSort(foodProducts, foodCategory, null)
  const filteredWigs = applyFiltersAndSort(wigsProducts, null, wigsSection)

  const activeFoodFilters = [foodCategory].filter(Boolean).length
  const activeWigsFilters = [wigsSection].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12 space-y-3">
          <h1 className="text-2xl md:text-5xl font-bold">Shop Products</h1>
          <p className="text-orange-100 text-sm md:text-lg">
            {products.length} {products.length === 1 ? "product" : "products"} available
          </p>
          {/* Mobile Search */}
          <div className="md:hidden pb-2">
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

      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* Global Controls */}
        <div className="sticky top-0 z-40 bg-white border-b py-3 -mx-4 px-4 md:static md:border-0 md:py-0 md:mt-6">
          <div className="flex items-center justify-between gap-2">
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
        </div>

        {/* ─────────────────────────────────────────── */}
        {/* SECTION 1: FOOD & GROCERIES                */}
        {/* ─────────────────────────────────────────── */}
        <div className="mt-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">🛒</span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Food & Groceries</h2>
              </div>
              <p className="text-gray-500 text-sm ml-12">
                {filteredFood.length} {filteredFood.length === 1 ? "item" : "items"}
              </p>
            </div>

            {/* Food Filters */}
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter Food
                    {activeFoodFilters > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {activeFoodFilters}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filter Food & Groceries</SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    label="Categories"
                    options={foodCategories}
                    active={foodCategory}
                    setActive={setFoodCategory}
                    onClear={() => setFoodCategory(null)}
                  />
                </SheetContent>
              </Sheet>

              {/* Desktop search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-48"
                />
              </div>
            </div>
          </div>

          {/* Active food filter chips */}
          {foodCategory && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setFoodCategory(null)}
                className="flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-xs font-medium"
              >
                {foodCategory.replace(/-/g, " ")}
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Desktop category pills */}
          {foodCategories.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setFoodCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !foodCategory ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
                }`}
              >
                All
              </button>
              {foodCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFoodCategory(cat === foodCategory ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                    foodCategory === cat ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
                  }`}
                >
                  {cat.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          )}

          {filteredFood.length === 0 ? (
            <EmptyState onClear={() => setFoodCategory(null)} />
          ) : (
            <ProductGrid products={filteredFood} viewMode={viewMode} />
          )}
        </div>

        {/* ─────────────────────────────────────────── */}
        {/* DIVIDER                                     */}
        {/* ─────────────────────────────────────────── */}
        {wigsProducts.length > 0 && (
          <div className="relative my-16 md:my-20">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-dashed border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gray-50 px-6 py-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Also Available
                </span>
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────── */}
        {/* SECTION 2: WIGS & HAIR                     */}
        {/* ─────────────────────────────────────────── */}
        {wigsProducts.length > 0 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">💇‍♀️</span>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">Wigs & Hair</h2>
                </div>
                <p className="text-gray-500 text-sm ml-12">
                  {filteredWigs.length} {filteredWigs.length === 1 ? "item" : "items"}
                </p>
              </div>

              {wigsSections.length > 0 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="relative">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter Wigs
                      {activeWigsFilters > 0 && (
                        <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {activeWigsFilters}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filter Wigs & Hair</SheetTitle>
                    </SheetHeader>
                    <FilterPanel
                      label="Sections"
                      options={wigsSections}
                      active={wigsSection}
                      setActive={setWigsSection}
                      onClear={() => setWigsSection(null)}
                    />
                  </SheetContent>
                </Sheet>
              )}
            </div>

            {/* Desktop section pills for wigs */}
            {wigsSections.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setWigsSection(null)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !wigsSection ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
                  }`}
                >
                  All
                </button>
                {wigsSections.map(sec => (
                  <button
                    key={sec}
                    onClick={() => setWigsSection(sec === wigsSection ? null : sec)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                      wigsSection === sec ? "bg-orange-600 text-white" : "bg-white border text-gray-600 hover:border-orange-400"
                    }`}
                  >
                    {sec.replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            )}

            {filteredWigs.length === 0 ? (
              <EmptyState onClear={() => setWigsSection(null)} />
            ) : (
              <ProductGrid products={filteredWigs} viewMode={viewMode} />
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

// ─── Shared Product Grid ──────────────────────────────────────────────────────
function ProductGrid({ products, viewMode }: { products: Product[]; viewMode: "grid" | "compact" }) {
  return (
    <div
      className={`grid gap-3 md:gap-5 ${
        viewMode === "grid"
          ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
      }`}
    >
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group block bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg active:scale-95 transition-all duration-200 overflow-hidden border border-gray-100"
        >
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img
              src={product.image && product.image.trim() !== "" ? product.image : "/placeholder.png"}
              alt={product.name || "Product"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.currentTarget.src = "/placeholder.png" }}
            />
            <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 items-center justify-center">
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
      ))}
    </div>
  )
}

// ─── Filter Panel (used inside Sheet) ────────────────────────────────────────
function FilterPanel({
  label, options, active, setActive, onClear,
}: {
  label: string
  options: string[]
  active: string | null
  setActive: (v: string | null) => void
  onClear: () => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-orange-600 text-sm">{label}</h3>
        <div className="space-y-2">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => setActive(opt === active ? null : opt)}
              className={`block w-full text-left px-4 py-3 rounded-lg capitalize transition-all touch-manipulation ${
                active === opt
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-50 hover:bg-orange-50 text-gray-700"
              }`}
            >
              {opt.replace(/-/g, " ")}
            </button>
          ))}
        </div>
      </div>
      {active && (
        <Button onClick={onClear} variant="outline" className="w-full">
          Clear Filter
        </Button>
      )}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border">
      <div className="text-5xl mb-3">🔍</div>
      <h3 className="text-xl font-bold mb-2">No products found</h3>
      <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
      <Button onClick={onClear} size="sm" className="bg-orange-600 hover:bg-orange-700">
        Clear Filters
      </Button>
    </div>
  )
}
