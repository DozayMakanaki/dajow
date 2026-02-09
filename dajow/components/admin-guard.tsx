"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { isAdmin } from "@/lib/is-admin"

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login")
        return
      }

      const admin = await isAdmin(user.uid)

      if (!admin) {
        router.replace("/")
        return
      }

      setLoading(false)
    })

    return () => unsub()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Checking permissions...
      </div>
    )
  }

  return <>{children}</>
}
