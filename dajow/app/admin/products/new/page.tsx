"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/firestore-products"
import Image from "next/image"
import { Save, ArrowLeft, Loader2, Link as LinkIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Image URL state
  const [imageUrl, setImageUrl] = useState("")
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [imageError, setImageError] = useState(false)

  function handleUrlInput(val: string) {
    setImageUrlInput(val)
    setImageError(false)
    setImageUrl(val)
  }

  function clearImage() {
    setImageUrl("")
    setImageUrlInput("")
    setImageError(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get("name") as string

    if (!imageUrl) {
      alert("Please provide an image URL")
      return
    }

    setSaving(true)

    try {
      await addProduct({
        name,
        slug: generateSlug(name),
        price: Number(data.get("price")),
        category: data.get("category") as string,
        section: data.get("section") as string,
        image: imageUrl,
        description: data.get("description") as string,
        inStock: data.get("inStock") === "on",
      })

      alert("✅ Product added successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Failed to add product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/admin/products")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in the details to list a new product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">

            {/* Product Name */}
            <div>
              <Label htmlFor="name" className="text-sm font-semibold mb-2">
                Product Name *
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Fresh Tomatoes"
                className="h-12"
                required
              />
            </div>

            {/* Price and Category */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="text-sm font-semibold mb-2">
                  Price (£) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 9.99"
                  className="h-12"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-sm font-semibold mb-2">
                  Category *
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Vegetables"
                  className="h-12"
                  required
                />
              </div>
            </div>

            {/* Section */}
            <div>
              <Label htmlFor="section" className="text-sm font-semibold mb-2">
                Section *
              </Label>
              <select
                id="section"
                name="section"
                defaultValue=""
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="" disabled>Select section</option>
                <option value="popular">Popular</option>
                <option value="fresh">Fresh Produce</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat & Poultry</option>
                <option value="pantry">Pantry</option>
                <option value="snacks">Snacks</option>
                <option value="wigs">Wigs</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-semibold mb-2">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description..."
                className="h-32 resize-none"
                required
              />
            </div>

            {/* In Stock */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <Label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                Product is in stock
              </Label>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
            <div>
              <Label className="text-sm font-semibold">Product Image *</Label>
              <p className="text-sm text-gray-500 mt-1">
                Paste a direct image URL from any source (Google, Unsplash, your CDN, etc.)
              </p>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={imageUrlInput}
                  onChange={(e) => handleUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-12 pl-9 pr-4"
                />
              </div>
              {imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearImage}
                  className="h-12 w-12 flex-shrink-0 text-red-500 hover:text-red-600 hover:border-red-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Live preview */}
            {imageUrl && !imageError && (
              <div className="rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50 w-full max-w-xs mx-auto">
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                </div>
                <p className="text-xs text-center text-gray-400 py-2">Preview</p>
              </div>
            )}

            {/* Error state */}
            {imageError && imageUrl && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">Image URL couldn't load</p>
                  <p className="text-xs text-red-500 mt-0.5">
                    Make sure the URL ends in .jpg, .png, .webp or is a direct image link
                  </p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-orange-800 mb-2">💡 Where to get image URLs:</p>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• <strong>Google Images</strong> → right-click image → "Copy image address"</li>
               
                <li>• <strong>Imgur.com</strong> → upload your own, copy the direct link</li>
                <li>• <strong>Firebase Storage</strong> → upload manually, copy the download URL</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="flex-1 h-12"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
