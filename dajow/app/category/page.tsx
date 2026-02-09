import { getProducts } from "@/lib/products"
import Link from "next/link"

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
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold capitalize mb-8">
        {params.section.replace("-", " ")}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-xl p-4 hover:shadow"
          >
            <h2 className="font-medium">{product.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
