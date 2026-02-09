"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

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

  function logoutAdmin() {
    signOut(auth).then(() => {
      router.replace("/admin/login")
    })
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Checking admin access…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col">
        <h1 className="text-xl font-bold mb-8">Dajow Admin</h1>

        <nav className="space-y-3 text-sm flex-1">
          <a href="/admin" className="block hover:text-primary">
            Dashboard
          </a>
          <a href="/admin/orders" className="block hover:text-primary">
            Orders
          </a>
          <a href="/admin/products" className="block hover:text-primary">
            Products
          </a>
          <a href="/admin/analytics">Analytics</a>

        </nav>

        <button
          onClick={logoutAdmin}
          className="mt-6 text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
