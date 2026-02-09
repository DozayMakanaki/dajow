"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/firestore-products"
import { uploadImage } from "@/lib/upload-image"
import Image from "next/image"

// Helper function to generate slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewProductPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string>("")

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImageUrl(url)
      setImagePreview(URL.createObjectURL(file))
    } catch (error) {
      alert("Failed to upload image: " + error)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const form = e.currentTarget
    const data = new FormData(form)

    const name = data.get("name") as string

    const productData = {
      name,
      slug: generateSlug(name),
      price: Number(data.get("price")),
      category: data.get("category") as string,
      section: data.get("section") as string,
      image: imageUrl || (data.get("imageUrl") as string),
      description: data.get("description") as string,
      inStock: Boolean(data.get("inStock")),
    }

    if (!productData.image) {
      alert("Please upload an image or provide an image URL")
      return
    }

    try {
      await addProduct(productData)
      alert("✅ Product added successfully")
      router.push("/admin/products")
    } catch (error) {
      alert("Failed to add product: " + error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            name="name"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., Fresh Tomatoes"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price (₦)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., 5000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            name="category"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="e.g., Vegetables"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Section</label>
          <select
            name="section"
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Select section</option>
            <option value="popular">Popular</option>
            <option value="fresh">Fresh Produce</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat & Poultry</option>
            <option value="pantry">Pantry</option>
            <option value="snacks">Snacks</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border rounded-lg"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Preview"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Or paste image URL</label>
          <input
            name="imageUrl"
            type="url"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="https://example.com/image.jpg"
            disabled={!!imageUrl}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            className="w-full px-4 py-2 border rounded-lg h-32"
            placeholder="Product description..."
            required
          />
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            defaultChecked
          />
          <span className="text-sm font-medium">In Stock</span>
        </label>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          disabled={uploading}
        >
          Add Product
        </button>
      </form>
    </div>
  )
}