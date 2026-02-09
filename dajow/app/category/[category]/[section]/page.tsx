import { getProducts } from "@/lib/products"
import Link from "next/link"
import Image from "next/image"

export default async function SectionPage({
  params,
}: {
  params: { category: string; section: string }
}) {
  const products = await getProducts()

  const filtered = products.filter(
    (p) =>
      p.category === params.category &&
      p.section === params.section
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-semibold mb-10 capitalize">
        {params.section.replace("-", " ")}
      </h1>

      {filtered.length === 0 && (
        <p>No products in this section yet.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="rounded-2xl border bg-white p-4 hover:shadow-lg transition"
          >
            <div className="relative h-40 mb-4 bg-muted rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="font-medium">{product.name}</h2>
            <p className="text-sm text-muted-foreground">
              £{product.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
