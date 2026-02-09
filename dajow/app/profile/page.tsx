"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { User, ShoppingBag, Heart, MapPin, Phone, Mail, Calendar, Package, TrendingUp, Settings, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

import ProfileDetails from "@/components/profile/profile-details"
import ProfileOrders from "@/components/profile/profile-orders"
import SavedProducts from "@/components/profile/saved-products"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"details" | "orders" | "saved">("details")
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedItems: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  // Load user stats
  useEffect(() => {
    if (user) {
      loadUserStats(user.uid)
    }
  }, [user])

  async function loadUserStats(userId: string) {
    try {
      // This will be implemented by the child components
      // For now, we'll get the data from localStorage or context
      const savedProducts = JSON.parse(localStorage.getItem('savedProducts') || '[]')
      setStats(prev => ({
        ...prev,
        savedItems: savedProducts.filter((p: any) => p.userId === userId).length
      }))
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  function updateStats(newStats: Partial<typeof stats>) {
    setStats(prev => ({ ...prev, ...newStats }))
  }

  async function handleSignOut() {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const memberSince = user.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently'

  return (
    <section className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-14">

        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-500 p-8 md:p-10 text-white shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="relative h-24 w-24 md:h-32 md:w-32 overflow-hidden rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-xl">
                <Image
                  src={user.photoURL || "/avatar.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-white rounded-full w-8 h-8 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {user.displayName || "Welcome Back!"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-orange-100">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Member since {memberSince}</span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          {/* Stats Cards */}
          <div className="relative mt-8 grid grid-cols-3 gap-4">
            <StatCard
              icon={<ShoppingBag className="h-5 w-5" />}
              label="Orders"
              value={stats.totalOrders}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Total Spent"
              value={`₦${stats.totalSpent.toLocaleString()}`}
            />
            <StatCard
              icon={<Heart className="h-5 w-5" />}
              label="Saved"
              value={stats.savedItems}
            />
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* SIDEBAR */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <div className="bg-white rounded-2xl border shadow-sm p-3 space-y-2">
              <ProfileNavItem
                icon={<User size={18} />}
                label="Profile Details"
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              />

              <ProfileNavItem
                icon={<ShoppingBag size={18} />}
                label="Order History"
                active={activeTab === "orders"}
                onClick={() => setActiveTab("orders")}
              />

              <ProfileNavItem
                icon={<Heart size={18} />}
                label="Saved Products"
                active={activeTab === "saved"}
                onClick={() => setActiveTab("saved")}
              />
            </div>

            {/* Mobile Sign Out */}
            <button
              onClick={handleSignOut}
              className="md:hidden w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>

            {/* Quick Actions */}
            <div className="hidden lg:block bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h3 className="font-bold text-orange-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 text-sm font-medium text-orange-700 transition-all">
                  Track Order
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 text-sm font-medium text-orange-700 transition-all">
                  Contact Support
                </button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/50 text-sm font-medium text-orange-700 transition-all">
                  Download Invoice
                </button>
              </div>
            </div>
          </motion.aside>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border bg-white shadow-sm overflow-hidden"
          >
            {activeTab === "details" && (
              <ProfileDetails userId={user.uid} user={user} />
            )}

            {activeTab === "orders" && (
              <ProfileOrders userId={user.uid} onStatsUpdate={updateStats} />
            )}

            {activeTab === "saved" && (
              <SavedProducts userId={user.uid} onStatsUpdate={updateStats} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ------------------ */
/* STAT CARD */
/* ------------------ */

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
      <div className="flex items-center gap-2 text-white/80 mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}

/* ------------------ */
/* SIDEBAR ITEM */
/* ------------------ */

function ProfileNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
        transition-all
        ${
          active
            ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]"
            : "hover:bg-orange-50 text-gray-700 hover:scale-[1.01]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  )
}
