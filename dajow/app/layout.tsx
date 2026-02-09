import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar"
import AuthProvider from "@/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import SiteFooter from "@/components/site-footer"
import BackgroundEffects from "@/components/background-effects"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "DAJOW - Premium African Products & More",
  description: "Discover authentic African foodstuff, premium wigs, packaged foods, and personal care products. Fast delivery across Nigeria.",
  keywords: ["African foodstuff", "wigs", "packaged foods", "online shopping Nigeria"],
  authors: [{ name: "DAJOW" }],
  openGraph: {
    title: "DAJOW - Premium African Products",
    description: "Your trusted source for quality African products",
    type: "website",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white antialiased">
        <AuthProvider>
          {/* Navbar */}
          <Navbar />
          
          {/* Main Content */}
          <main className="relative min-h-screen">
            {/* Background Decoration */}
            <BackgroundEffects />

            {/* Content */}
            {children}
          </main>

          {/* Footer */}
          <SiteFooter />

          {/* Toast Notifications */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
