"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Menu, X, LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login")
        return
      }

      // 🔐 CHECK ADMIN ROLE FROM FIRESTORE
      const snap = await getDoc(doc(db, "users", user.uid))

      if (!snap.exists() || snap.data().role !== "admin") {
        await signOut(auth)
        router.replace("/admin/login")
        return
      }

      setLoading(false)
    })

    return () => unsub()
  }, [router])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  function logoutAdmin() {
    signOut(auth).then(() => {
      router.replace("/admin/login")
    })
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Checking admin access…</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Dajow Admin
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Active Page Indicator */}
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500">
            {navItems.find(item => isActiveRoute(item.href))?.label || "Dashboard"}
          </p>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Menu Panel */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-white">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-1">
                  Dajow Admin
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  const isActive = isActiveRoute(item.href)
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all touch-manipulation ${
                          isActive
                            ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg"
                            : "hover:bg-orange-50 text-gray-700 hover:text-orange-600 active:bg-orange-100"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""}`} />
                        <span className="font-semibold text-base">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-pill"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Logout Button */}
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => {
                    logoutAdmin()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-colors font-semibold shadow-lg touch-manipulation"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r flex-col sticky top-0 h-screen">
        <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-white">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-1">
            Dajow Admin
          </h1>
          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isActiveRoute(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md"
                    : "hover:bg-orange-50 text-gray-700 hover:text-orange-600"
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="absolute right-3 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logoutAdmin}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium shadow-md"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile: Add top padding for fixed header */}
        <div className="lg:p-8 p-4 pt-24 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
