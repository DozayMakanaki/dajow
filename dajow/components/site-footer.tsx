"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, MessageCircle } from "lucide-react"

export default function SiteFooter() {
  return (
    <>
      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative border-t bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-20">

          {/* GRID */}
          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-5">

            {/* BRAND */}
            <div className="lg:col-span-2 space-y-5">
              <h3 className="text-3xl font-extrabold tracking-tight">
                <span className="text-orange-600">Dajow</span>
              </h3>

              <p className="max-w-md text-sm leading-relaxed text-gray-600">
                Dajow is a modern online marketplace built for convenience,
                trust, and affordability. We connect you to quality groceries
                and essential products — delivered reliably, every time.
              </p>

              <div className="flex gap-4 pt-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="rounded-full border p-3 text-gray-600
                      hover:bg-orange-50 hover:text-orange-600
                      transition"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* SHOP */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">
                Shop
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/products" className="hover:text-orange-600">All Products</Link></li>
                <li><Link href="/categories" className="hover:text-orange-600">Categories</Link></li>
                <li><Link href="/products?sort=popular" className="hover:text-orange-600">Popular</Link></li>
                <li><Link href="/products?sort=new" className="hover:text-orange-600">New Arrivals</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">
                Support
              </h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/contact" className="hover:text-orange-600">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-orange-600">FAQs</Link></li>
                <li><Link href="/shipping" className="hover:text-orange-600">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-orange-600">Returns</Link></li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">
                Newsletter
              </h4>

              <p className="mb-4 text-sm text-gray-600">
                Be the first to hear about new products, deals, and updates.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="
                    w-full rounded-2xl border px-4 py-3 text-sm
                    focus:border-orange-500 focus:outline-none
                  "
                />

                <Button
                  type="submit"
                  className="
                    w-full rounded-2xl
                    bg-orange-600 text-white
                    hover:bg-orange-700
                  "
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-20 flex flex-col gap-4 border-t pt-6 text-center text-sm text-gray-500 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Dajow. All rights reserved.</p>

            <div className="flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-orange-600">Privacy</Link>
              <Link href="/terms" className="hover:text-orange-600">Terms</Link>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* WHATSAPP FLOATING BUTTON */}
      <a
        href="https://wa.me/+447920693240"
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 right-6 z-50
          flex items-center gap-3
          rounded-full bg-green-500 px-5 py-4
          text-white shadow-xl
          hover:bg-green-600 hover:scale-105
          transition-all
        "
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden sm:inline font-medium">
          Chat with us
        </span>
      </a>
    </>
  )
}
