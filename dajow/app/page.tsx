import HeroCarousel from "@/components/hero-carousel"
import CategorySection from "@/components/category-sections"

import AboutNewsletter from "@/components/about-newsletter"
import ContactSupport from "@/components/contact-support"

export default function HomePage() {
  return (
    <main className="relative">
      <HeroCarousel />
      <CategorySection />
     
      <AboutNewsletter />
      <ContactSupport />
      {/* Featured products comes next */}
    </main>
  )
}
