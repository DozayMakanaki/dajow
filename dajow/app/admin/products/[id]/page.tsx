"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProductById, updateProduct } from "@/lib/firestore-products"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    getProductById(id)
      .then(data => {
        if (!data) {
          router.replace("/admin/products")
          return
        }
        setProduct(data)
      })
      .finally(() => setLoading(false))
  }, [id, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!product) return

    const form = e.currentTarget
    const data = new FormData(form)

    await updateProduct(id, {
      name: data.get("name") as string,
      price: Number(data.get("price")),
      category: data.get("category") as string,
      section: data.get("section") as string,
      image: data.get("image") as string,
      description: data.get("description") as string,
      inStock: Boolean(data.get("inStock")),
    })

    alert("✅ Product updated")
    router.push("/admin/products")
  }

  /* 🛑 BLOCK RENDERING UNTIL READY */
  if (loading) {
    return <p className="p-6">Loading product...</p>
  }

  if (!product) {
    return <p className="p-6 text-red-500">Product not found</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          defaultValue={product.name}
          className="input"
          required
        />

        <input
          name="price"
          type="number"
          defaultValue={product.price}
          className="input"
          required
        />

        <input
          name="category"
          defaultValue={product.category}
          className="input"
          required
        />

        <input
          name="section"
          defaultValue={product.section}
          className="input"
          required
        />

        <input
          name="image"
          defaultValue={product.image}
          className="input"
          required
        />

        <textarea
          name="description"
          defaultValue={product.description}
          className="input h-32"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked={product.inStock}
          />
          In stock
        </label>

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Save Changes
        </button>
      </form>
    </div>
  )
}