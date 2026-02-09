"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuthStore } from "@/store/auth-store"

export function useUserRole() {
  const user = useAuthStore((state) => state.user)
  const [role, setRole] = useState<"admin" | "user" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setRole(null)
      setLoading(false)
      return
    }

    async function fetchRole() {
      if (!user) return // Add this guard
      
      try {
        const snap = await getDoc(doc(db, "users", user.uid))

        if (snap.exists()) {
          setRole(snap.data().role)
        } else {
          setRole("user")
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err)
        setRole("user")
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [user])

  return { role, loading }
}