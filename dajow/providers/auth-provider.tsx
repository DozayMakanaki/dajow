"use client"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuthStore } from "@/store/auth-store"
import { useCartStore } from "@/store/cart-store"
import { User } from "firebase/auth"

/* -------------------------------
   AUTH PROVIDER (ZUSTAND-BASED)
-------------------------------- */

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
      setLoading(false)

      // reset cart when user changes
      useCartStore.getState().resetForUser()
    })

    return () => unsubscribe()
  }, [setUser, setLoading])

  return <>{children}</>
}

/* -------------------------------
   useAuth HOOK (WHAT YOU NEED)
-------------------------------- */
export function useAuth(): {
  user: User | null
  loading: boolean
} {
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  return { user, loading }
}
