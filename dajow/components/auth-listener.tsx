"use client"

import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useCartStore } from "@/store/cart-store"

export default function AuthListener() {
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      // Any auth change = reset cart
      clearCart()
    })

    return unsubscribe
  }, [clearCart])

  return null
}
