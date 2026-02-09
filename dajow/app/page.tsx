import HeroCarousel from "@/components/hero-carousel"
import CategorySection from "@/components/category-sections"

import AboutNewsletter from "@/components/about-newsletter"


export default function HomePage() {
  return (
    <main className="relative">
      <HeroCarousel />
      <CategorySection />
     
      <AboutNewsletter />
      {/* Featured products comes next */}
    </main>
  )
}
