"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, deleteProduct } from "@/lib/firestore-products"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(data => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <div className="flex gap-3">
          <Link
            href="/admin/products/bulk-upload"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            📦 Bulk Upload
          </Link>
          
          <Link
            href="/admin/products/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No products yet</p>
          <Link
            href="/admin/products/new"
            className="text-blue-600 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(product => {
            const imageSrc =
              typeof product.image === "string" &&
              product.image.startsWith("http")
                ? product.image
                : "/placeholder.png"

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                <Image
                  src={imageSrc}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="font-medium">
                    ₦{Number(product.price).toLocaleString()}
                  </p>

                  {!product.image?.startsWith("http") && (
                    <p className="text-xs text-red-500 mt-1">
                      ⚠ Invalid image URL
                    </p>
                  )}
                  
                  {!product.inStock && (
                    <p className="text-xs text-orange-500 mt-1">
                      Out of Stock
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
