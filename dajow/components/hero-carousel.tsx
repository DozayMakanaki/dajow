"use client"

import Link from "next/link"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import { useState } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const slides = [
  {
    id: 1,
    title: "African and Caribbean",
    subtitle: "Authentic Afric and Caribbean supermart",
    image: "/banner/1.png",
    cta: {
      label: "Supermart",
      href: "/products?category=beauty",
    },
  },
  {
    id: 2,
    title: "Wigs and Beauty products",
    subtitle: "Stay ahead with the latest trends",
    image: "/banner/2.png",
    cta: {
      label: "Explore New Arrivals",
      href: "/products?sort=new",
    },
  },
  {
    id: 3,
    title: "Fast Delivery Worldwide",
    subtitle: "Reliable shipping you can trust",
    image: "/banner/3.png",
    cta: {
      label: "Browse All Products",
      href: "/products",
    },
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative w-full overflow-hidden ">
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
        ]}
        className="relative"
        setApi={(api) => {
          if (!api) return
          setActive(api.selectedScrollSnap())
          api.on("select", () => {
            setActive(api.selectedScrollSnap())
          })
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[70vh] min-h-[560px] w-full">

                {/* Background */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

                {/* Content */}
                <div className="relative z-10 flex h-full items-center">
                  <div className="mx-auto max-w-7xl px-4">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="max-w-xl rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl shadow-2xl"
                    >
                      <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                        {slide.title}
                      </h1>

                      <p className="mt-4 text-base text-white/90 sm:text-lg">
                        {slide.subtitle}
                      </p>

                      <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                          asChild
                          size="lg"
                          className="bg-orange-600 text-white shadow-lg hover:bg-orange-700 hover:shadow-xl transition-all"
                        >
                          <Link href={slide.cta.href}>
                            {slide.cta.label}
                          </Link>
                        </Button>

                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white/70 text-white hover:bg-white hover:text-orange-600 transition-all"
                        >
                          <Link href="/products">View Collection</Link>
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* DOTS */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all",
                active === i
                  ? "bg-orange-600 w-6"
                  : "bg-white/50 hover:bg-white"
              )}
            />
          ))}
        </div>

      </Carousel>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-8 w-5 rounded-full border-2 border-white/60 flex items-start justify-center p-1"
        >
          <div className="h-2 w-1 rounded-full bg-orange-500" />
        </motion.div>
      </div>
    </section>
  )
}
