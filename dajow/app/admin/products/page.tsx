"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getProducts, deleteProduct } from "@/lib/firestore-products"
import { Plus, Upload, Pencil, Trash2, PackageX, AlertCircle, Search, X, SlidersHorizontal, ChevronDown } from "lucide-react"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [sectionFilter, setSectionFilter] = useState<string>("all")
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "out-of-stock">("all")
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high" | "newest">("newest")

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // Get unique sections
  const sections = useMemo(() => {
    const secs = [...new Set(products.map(p => p.section).filter(Boolean))] as string[]
    return secs.sort()
  }, [products])

  // Filter + search + sort
  const filtered = useMemo(() => {
    let list = [...products]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.section?.toLowerCase().includes(q) ||
        String(p.price).includes(q)
      )
    }

    // Section filter
    if (sectionFilter !== "all") {
      list = list.filter(p => p.section === sectionFilter)
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      list = list.filter(p => p.inStock !== false)
    } else if (stockFilter === "out-of-stock") {
      list = list.filter(p => p.inStock === false)
    }

    // Sort
    switch (sortBy) {
      case "name":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "price-low":
        list.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case "price-high":
        list.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case "newest":
      default:
        // Keep original order (Firestore usually returns newest last, reverse it)
        list.reverse()
        break
    }

    return list
  }, [products, search, sectionFilter, stockFilter, sortBy])

  const hasActiveFilters = search || sectionFilter !== "all" || stockFilter !== "all"

  function clearAll() {
    setSearch("")
    setSectionFilter("all")
    setStockFilter("all")
    setSortBy("newest")
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow animate-pulse">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} of {products.length} product{products.length !== 1 ? "s" : ""}
            {hasActiveFilters && <span className="text-orange-600 font-medium"> (filtered)</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href="/admin/products/bulk-upload"
            className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, category, section..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />

          {/* Section */}
          <div className="relative">
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className={`pl-3 pr-8 py-1.5 rounded-full text-xs font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                sectionFilter !== "all"
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="all">All Sections</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec.replace(/-/g, " ")}</option>
              ))}
            </select>
            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none ${sectionFilter !== "all" ? "text-white" : "text-gray-400"}`} />
          </div>

          {/* Stock */}
          <div className="relative">
            <select
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as typeof stockFilter)}
              className={`pl-3 pr-8 py-1.5 rounded-full text-xs font-medium border appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                stockFilter !== "all"
                  ? "bg-orange-600 text-white border-orange-600"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none ${stockFilter !== "all" ? "text-white" : "text-gray-400"}`} />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="pl-3 pr-8 py-1.5 rounded-full text-xs font-medium border appearance-none cursor-pointer bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="name">Name A–Z</option>
              <option value="price-low">Price: Low–High</option>
              <option value="price-high">Price: High–Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none text-gray-400" />
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium ml-1"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <PackageX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2 font-medium">No products yet</p>
          <Link href="/admin/products/new" className="text-orange-600 hover:underline text-sm">
            Add your first product →
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
          <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold mb-1">No products match</p>
          <p className="text-gray-400 text-sm mb-4">Try a different search or clear the filters</p>
          <button
            onClick={clearAll}
            className="text-sm text-orange-600 hover:underline font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(product => {
            const hasValidImage = typeof product.image === "string" && product.image.startsWith("http")

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {hasValidImage ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove("hidden")
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-gray-400 ${hasValidImage ? "hidden" : ""}`}>
                    <AlertCircle className="h-6 w-6" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* Highlight matching search term */}
                  <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                    {search ? (
                      <HighlightText text={product.name || ""} query={search} />
                    ) : product.name}
                  </h3>
                  <p className="text-xs text-gray-400 capitalize truncate mt-0.5">
                    {product.category?.replace(/-/g, " ")}
                    {product.section && ` · ${product.section}`}
                  </p>
                  <p className="font-bold text-orange-600 text-sm md:text-base mt-0.5">
                    £{Number(product.price).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {!product.inStock && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                        Out of Stock
                      </span>
                    )}
                    {!hasValidImage && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                        ⚠ No image
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="flex items-center gap-1.5 text-xs md:text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 md:px-3 py-2 rounded-lg transition font-medium"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex items-center gap-1.5 text-xs md:text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 md:px-3 py-2 rounded-lg transition font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Highlights matching text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-orange-100 text-orange-800 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}
