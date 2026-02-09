import HeroCarousel from "@/components/hero-carousel"
import CategorySection from "@/components/category-sections"
import PopularProductsSlider from "@/components/popular-product"
import AboutNewsletter from "@/components/about-newsletter"
import PopularProducts from "@/components/popular-product"

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
