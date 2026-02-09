"use client"

import { useState } from "react"
import { PRODUCT_CATEGORIES } from "@/lib/categories"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore"

export default function AddProductForm({
  onClose,
}: {
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrls, setImageUrls] = useState("")
  const [images, setImages] = useState<File[]>([]) // kept for future use
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const parsedImages = imageUrls
        ? imageUrls.split(",").map((url) => url.trim())
        : []

      await addDoc(collection(db, "products"), {
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        category,
        images: parsedImages,
        active: true,
        createdAt: Timestamp.now(),
      })

      onClose()
    } catch (err) {
      console.error(err)
      alert("Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-6 rounded space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Product</h2>

      <input
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="number"
        placeholder="Stock quantity"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select category</option>
        {PRODUCT_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Image URLs (comma separated)"
        value={imageUrls}
        onChange={(e) => setImageUrls(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Image upload placeholder (future use) */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) =>
          setImages(Array.from(e.target.files || []))
        }
        disabled
      />

      <p className="text-xs text-muted-foreground">
        Image upload is disabled. Use image URLs for now.
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
