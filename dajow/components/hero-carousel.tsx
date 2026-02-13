"use client"

import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    eyebrow: "Welcome to Dajow",
    title: "African &\nCaribbean",
    highlight: "Supermart",
    subtitle: "Authentic groceries, fresh produce and pantry essentials — delivered to your door.",
    image: "/banner/2.png",
    accent: "from-orange-950/90 via-orange-900/60 to-transparent",
    cta: { label: "Shop Groceries", href: "/products?category=groceries" },
    ctaSecondary: { label: "View All", href: "/products" },
    tag: "🌍 Worldwide Shipping",
  },
  {
    id: 2,
    eyebrow: "New Collection",
    title: "Wigs &\nBeauty",
    highlight: "Products",
    subtitle: "Stay ahead with the latest trends in hair and beauty. Premium quality, unbeatable prices.",
    image: "/banner/1.png",
    accent: "from-rose-950/90 via-rose-900/60 to-transparent",
    cta: { label: "Shop Wigs", href: "/products?category=wigs" },
    ctaSecondary: { label: "New Arrivals", href: "/products?sort=new" },
    tag: "✨ Premium Quality",
  },
  {
    id: 3,
    eyebrow: "Fast & Reliable",
    title: "Delivered\nWorldwide",
    highlight: "Guaranteed",
    subtitle: "Reliable shipping you can track in real time. Order today, at your door in days.",
    image: "/banner/3.png",
    accent: "from-slate-950/90 via-slate-900/60 to-transparent",
    cta: { label: "Browse Products", href: "/products" },
    ctaSecondary: { label: "Learn More", href: "/shipping" },
    tag: "🚚 Fast Delivery",
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [api, setApi] = useState<CarouselApi>()
  const [prevActive, setPrevActive] = useState(0)

  useEffect(() => {
    if (!api) return
    api.on("select", () => {
      setPrevActive(active)
      setActive(api.selectedScrollSnap())
    })
  }, [api, active])

  const goTo = (index: number) => api?.scrollTo(index)
  const goPrev = () => api?.scrollPrev()
  const goNext = () => api?.scrollNext()

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
        setApi={setApi}
        className="relative"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full" style={{ height: "clamp(520px, 90vh, 820px)" }}>

                {/* Background image with zoom */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.08 }}
                  animate={{ scale: active === index ? 1 : 1.08 }}
                  transition={{ duration: 7, ease: "easeOut" }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                  />
                </motion.div>

                {/* Left gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
                {/* Bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                  <div className="w-full mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                    <AnimatePresence mode="wait">
                      {active === index && (
                        <motion.div
                          key={`content-${index}`}
                          className="max-w-2xl"
                        >
                          {/* Eyebrow tag */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="inline-flex items-center gap-2 mb-5"
                          >
                            <span className="h-px w-8 bg-orange-500" />
                            <span className="text-orange-400 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
                              {slide.eyebrow}
                            </span>
                          </motion.div>

                          {/* Heading */}
                          <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white font-black leading-none mb-2"
                            style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
                          >
                            {slide.title.split("\n").map((line, i) => (
                              <span key={i} className="block">{line}</span>
                            ))}
                            <span
                              className="block text-transparent"
                              style={{
                                WebkitTextStroke: "2px #ea580c",
                                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                              }}
                            >
                              {slide.highlight}
                            </span>
                          </motion.h1>

                          {/* Subtitle */}
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mt-4 mb-8 max-w-md"
                          >
                            {slide.subtitle}
                          </motion.p>

                          {/* CTAs */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.45 }}
                            className="flex flex-wrap items-center gap-3"
                          >
                            <Link href={slide.cta.href}>
                              <button className="group relative overflow-hidden bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-300 flex items-center gap-2 shadow-lg shadow-orange-600/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95">
                                {slide.cta.label}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                              </button>
                            </Link>

                            <Link href={slide.ctaSecondary.href}>
                              <button className="text-white/80 hover:text-white font-semibold text-sm sm:text-base px-4 py-3 rounded-full border border-white/20 hover:border-white/50 hover:bg-white/10 transition-all duration-300">
                                {slide.ctaSecondary.label}
                              </button>
                            </Link>
                          </motion.div>

                          {/* Tag badge */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-medium px-4 py-2 rounded-full"
                          >
                            {slide.tag}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Slide number */}
                <div className="absolute bottom-8 right-6 sm:right-10 z-20 text-white/30 font-black tabular-nums select-none hidden sm:block"
                  style={{ fontSize: "clamp(3rem, 6vw, 5rem)", lineHeight: 1 }}
                >
                  0{index + 1}
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prev / Next arrows — desktop only */}
        <button
          onClick={goPrev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/25 transition-all hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/25 transition-all hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Progress dots + slide labels */}
        <div className="absolute bottom-6 left-5 sm:left-8 lg:left-12 z-20 flex items-center gap-4">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="group flex items-center gap-2"
            >
              {/* Animated progress bar */}
              <div className={cn(
                "h-0.5 rounded-full transition-all duration-500 bg-white/30",
                active === i ? "w-10 bg-orange-500" : "w-4 group-hover:bg-white/60"
              )} />
              <span className={cn(
                "text-xs font-semibold transition-all hidden sm:block",
                active === i ? "text-white opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
              )}>
                0{i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium">Scroll</span>
            <div className="h-8 w-5 rounded-full border border-white/25 flex items-start justify-center p-1.5">
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="h-1.5 w-1 rounded-full bg-orange-500"
              />
            </div>
          </motion.div>
        </div>
      </Carousel>
    </section>
  )
}
