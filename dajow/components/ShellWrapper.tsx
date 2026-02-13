"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import SiteFooter from "@/components/site-footer"
import BackgroundEffects from "@/components/background-effects"

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  return (
    <>
      {!isAdmin && <Navbar />}

      <main className="relative min-h-screen">
        {!isAdmin && <BackgroundEffects />}
        {children}
      </main>

      {!isAdmin && <SiteFooter />}
    </>
  )
}
