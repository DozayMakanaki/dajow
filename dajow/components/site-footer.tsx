"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, MessageCircle, Mail, Phone } from "lucide-react"

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

              {/* Contact Details */}
              <div className="space-y-3 pt-2">
                <a
                  href="mailto:aloziemaureen89@gmail.com"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors flex-shrink-0">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                  <span>aloziemaureen89@gmail.com</span>
                </a>

                <a
                  href="tel:+447704335223"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <span>+44 7704 335223</span>
                </a>

                <a
                  href="tel:+447763701737"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4 text-orange-600" />
                  </div>
                  <span>+44 7763 701737</span>
                </a>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 pt-3">
                {[Facebook, Instagram, Twitter].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="rounded-full border p-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}

                {/* WhatsApp Social Icon */}
                <a
                  href="https://wa.me/447704335223"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border p-3 text-gray-600 hover:bg-green-50 hover:text-green-600 transition"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* SHOP */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">Shop</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li><Link href="/products" className="hover:text-orange-600">All Products</Link></li>
                <li><Link href="/categories" className="hover:text-orange-600">Categories</Link></li>
                <li><Link href="/products?sort=popular" className="hover:text-orange-600">Popular</Link></li>
                <li><Link href="/products?sort=new" className="hover:text-orange-600">New Arrivals</Link></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">Support</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="mailto:aloziemaureen89@gmail.com" className="hover:text-orange-600">
                    Contact Us
                  </a>
                </li>
                <li><Link href="/faq" className="hover:text-orange-600">FAQs</Link></li>
                <li><Link href="/shipping" className="hover:text-orange-600">Shipping</Link></li>
                <li><Link href="/returns" className="hover:text-orange-600">Returns</Link></li>
                <li>
                  <a
                    href="https://wa.me/447704335223"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-600 flex items-center gap-1.5"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                    WhatsApp Us
                  </a>
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-900">Newsletter</h4>
              <p className="mb-4 text-sm text-gray-600">
                Be the first to hear about new products, deals, and updates.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border px-4 py-3 text-sm focus:border-orange-500 focus:outline-none"
                />
                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-orange-600 text-white hover:bg-orange-700"
                >
                  Subscribe
                </Button>
              </form>

              {/* Quick Contact */}
              <div className="mt-6 p-4 bg-orange-50 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Quick Contact</p>
                <a
                  href="https://wa.me/447704335223"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-green-700 hover:text-green-800 font-medium"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  +44 7704 335223
                </a>
                <a
                  href="https://wa.me/447763701737"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-green-700 hover:text-green-800 font-medium"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  +44 7763 701737
                </a>
              </div>
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Speech bubble tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4, type: "spring" }}
          className="relative bg-white text-gray-800 text-xs font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 max-w-[180px] text-center leading-snug"
        >
          💬 Chat with us for more information on products!
          <span className="absolute -bottom-2 right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white drop-shadow-sm" />
        </motion.div>

        {/* Single bouncing button */}
        <motion.a
          href="https://wa.me/447704335223"
          target="_blank"
          rel="noopener noreferrer"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 rounded-full bg-green-500 px-5 py-4 text-white shadow-xl hover:bg-green-600 transition-colors"
        >
          <span className="relative flex items-center justify-center">
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"
            />
            <MessageCircle className="h-6 w-6 relative z-10" />
          </span>
          <span className="hidden sm:inline font-semibold text-sm">
            Chat with us
          </span>
        </motion.a>
      </div>
    </>
  )
}
