import Link from "next/link"
import Image from "next/image"
import { categories } from "@/lib/categories"

export default function CategoryLandingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-semibold mb-12">
        Shop by Category
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group rounded-3xl overflow-hidden border bg-white shadow hover:shadow-xl transition"
          >
            <div className="relative h-56">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-medium">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
