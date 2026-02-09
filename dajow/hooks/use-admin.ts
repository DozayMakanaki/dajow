"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAdminGuard() {
  const router = useRouter()

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")

    if (!isAdmin) {
      router.replace("/admin/login")
    }
  }, [router])
}
