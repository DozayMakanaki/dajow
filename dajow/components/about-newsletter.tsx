"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function AboutNewsletter() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-24">
      
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="
          mx-auto max-w-4xl
          rounded-3xl
          border border-white/20
          bg-white/70 backdrop-blur-xl
          p-8 sm:p-12
          shadow-xl
          text-center
        "
      >
        {/* TITLE */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          What is <span className="text-orange-600">Dajow</span>?
        </h2>

        {/* DESCRIPTION */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
          Dajow is your trusted online marketplace for quality everyday products —
          from groceries and household essentials to carefully curated popular items.
          We connect you with reliable vendors, fair prices, and fast delivery,
          all in one seamless shopping experience.
        </p>

        {/* VALUE POINTS */}
        <div className="mt-10 grid gap-6 sm:grid-cols-3 text-left">
          {[
            {
              title: "Quality Products",
              text: "Only vetted and trusted items you can rely on.",
            },
            {
              title: "Fast & Reliable",
              text: "Quick delivery and smooth checkout experience.",
            },
            {
              title: "Made for You",
              text: "Built with simplicity, speed, and trust in mind.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="
                rounded-2xl
                bg-white/80
                p-5
                shadow-sm
              "
            >
              <h3 className="font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* NEWSLETTER */}
        <div className="mt-12 space-y-4">
          <p className="text-sm text-gray-500">
            Get updates on new arrivals, deals, and exclusive offers.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="
                w-full rounded-xl border
                px-4 py-3 text-sm
                outline-none
                focus:border-orange-500
              "
            />

            <Button
              type="submit"
              className="
                rounded-xl
                bg-orange-600 px-6
                text-white
                hover:bg-orange-700
              "
            >
              Stay Updated
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
