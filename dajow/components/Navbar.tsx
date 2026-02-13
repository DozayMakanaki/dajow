"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Menu, ShoppingCart, Search, Shield, User, X, ChevronDown, Package, Sparkles } from "lucide-react"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"

import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

import { useCartStore } from "@/store/cart-store"
import UserMenu from "@/components/user-menu"
import { useUserRole } from "@/hooks/use-user-role"
import { getProducts, Product } from "@/lib/firestore-products"

const categories = [
  { name: "African Foodstuff", slug: "african-foodstuff", icon: "🌾" },
  { name: "Wigs & Hair", slug: "wigs", icon: "💇" },
  { name: "Packaged Foods", slug: "packaged-foods", icon: "📦" },
  { name: "Soap & Care", slug: "soap & personal-care", icon: "🧼" },
]

// 🔒 ADMIN EMAIL WHITELIST
const ADMIN_EMAILS = [
  "admin@dajow.com",
  "owner@dajow.com",
  "chidoziemail@gmail.com",
  "aloziemaureen89@yahoo.com",
  "Aloziemaureen89@yahoo.com",
  "aloziemartinso50@gmail.com",
  "emmaphilamong2@gmail.com"
   
  
  // Add your admin emails here
]

export default function Navbar() {
  const router = useRouter()
  const totalItems = useCartStore((state) => state.totalItems())
  const { role, loading } = useUserRole()

  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [search, setSearch] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  
  // Search suggestions
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Check if user is authorized admin
  const isAuthorizedAdmin = user && ADMIN_EMAILS.includes(user.email || "")

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Load products for search
  useEffect(() => {
    getProducts().then(setAllProducts)
  }, [])

  // Handle search input
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Filter products based on search
    const searchLower = search.toLowerCase()
    const filtered = allProducts
      .filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      )
      .slice(0, 6) // Show max 6 suggestions

    setSuggestions(filtered)
    setShowSuggestions(true)
  }, [search, allProducts])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch() {
    if (!search.trim()) return
    setShowSuggestions(false)
    router.push(`/products?search=${encodeURIComponent(search)}`)
    setSearch("")
  }

  function handleSuggestionClick(productId: string | undefined) {
    if (!productId) return
    setShowSuggestions(false)
    setSearch("")
    router.push(`/products/${productId}`)
  }

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Free delivery on orders over ₦50,000
          </p>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/track-order" className="hover:underline">Track Order</Link>
            <span>|</span>
            <Link href="/contact" className="hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`sticky top-0 z-[60] w-full border-b transition-all duration-300
          ${scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg"
            : "bg-white"
          }`}
      >
        <div className="mx-auto max-w-7xl">
          
          {/* Main Row */}
          <div className="flex h-20 items-center justify-between px-4 gap-4">

            {/* LEFT - Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden hover:bg-orange-50 rounded-full"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-600/20 blur-xl rounded-full group-hover:bg-orange-600/30 transition" />
                  <span className="relative rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 px-6 py-2.5 text-xl font-black text-white shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                    DAJOW
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER - Search Bar with Suggestions */}
            <div className="hidden md:flex flex-1 max-w-2xl" ref={searchRef}>
              <div className="relative w-full group">
                <Input
                  placeholder="Search for products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => search.trim() && setShowSuggestions(true)}
                  className="w-full h-12 pl-5 pr-12 rounded-full border-2 border-gray-200 focus:border-orange-500 focus-visible:ring-orange-500 transition-all"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                </Button>

                {/* Search Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
                    >
                      {suggestions.map((product) => {
                        const imageUrl = product.image && product.image.trim() !== "" 
                          ? product.image 
                          : "/placeholder.png"

                        return (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b last:border-b-0 text-left"
                          >
                            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {product.category?.replace(/-/g, " ")}
                              </p>
                            </div>
                            <p className="text-orange-600 font-bold text-sm">
                              ₦{product.price?.toLocaleString()}
                            </p>
                          </button>
                        )
                      })}

                      {/* View All Results */}
                      <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 bg-gray-50 text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-colors"
                      >
                        View all results for "{search}"
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* No Results */}
                <AnimatePresence>
                  {showSuggestions && search.trim() && suggestions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
                    >
                      <p className="text-gray-500 text-sm text-center">
                        No products found for "{search}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT - Actions */}
            <div className="flex items-center gap-2">

              {/* Profile (Desktop) */}
              {user && (
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Profile</span>
                </Link>
              )}

              {/* Admin (Desktop) - Only for authorized emails */}
              {!loading && isAuthorizedAdmin && (
                <Link
                  href="/admin"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
                >
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-semibold">Admin</span>
                </Link>
              )}

              {/* Cart */}
              <Link 
                href="/cart" 
                className="relative group p-2 rounded-full hover:bg-orange-50 transition-all"
              >
                <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-orange-600 transition" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1"
                    >
                      <Badge className="rounded-full bg-orange-600 px-2 py-0.5 text-xs text-white shadow-lg border-2 border-white">
                        {totalItems}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>

              {/* User Menu */}
              <UserMenu />
            </div>
          </div>

          {/* Categories Bar (Desktop) */}
          <div className="hidden md:block border-t bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-1 px-4 py-3">
              
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-all font-medium"
                >
                  <Package className="h-4 w-4" />
                  All Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onMouseEnter={() => setCategoriesOpen(true)}
                      onMouseLeave={() => setCategoriesOpen(false)}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.slug}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b last:border-b-0"
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-medium text-gray-700 hover:text-orange-600">{cat.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Links */}
              <Link href="/products" className="px-4 py-2 rounded-lg hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 transition-all">
                All Products
              </Link>
              <Link href="/deals" className="px-4 py-2 rounded-lg hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 transition-all">
                🔥 Hot Deals
              </Link>
              <Link href="/new-arrivals" className="px-4 py-2 rounded-lg hover:bg-orange-50 text-sm font-medium text-gray-700 hover:text-orange-600 transition-all">
                ✨ New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[65] md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-white z-[70] shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                
                {/* Logo */}
                <Link 
                  href="/" 
                  className="text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  DAJOW AfroMart
                </Link>

                {/* Search Mobile */}
                <div className="relative">
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                        setMobileMenuOpen(false)
                      }
                    }}
                    className="w-full focus-visible:ring-orange-500"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium text-gray-700">{cat.name}</span>
                    </Link>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="space-y-2 border-t pt-4">
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg hover:bg-orange-50 font-medium text-gray-700"
                  >
                    All Products
                  </Link>
                  
                  {user && (
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-orange-50 font-medium text-gray-700"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  )}

                  {/* Admin - Only for authorized emails */}
                  {!loading && isAuthorizedAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 font-semibold text-orange-600"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}