"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getProductById, updateProduct } from "@/lib/firestore-products"
import { uploadImage } from "@/lib/upload-image"
import Image from "next/image"
import { Upload, X, Save, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Helper function to generate slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Image handling
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    if (!id) return

    getProductById(id)
      .then(data => {
        if (!data) {
          router.replace("/admin/products")
          return
        }
        setProduct(data)
        setImageUrl(data.image || "")
        setImagePreview(data.image || "")
      })
      .finally(() => setLoading(false))
  }, [id, router])

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPG, PNG, WEBP, or GIF)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setNewImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setNewImageFile(null)
    setImagePreview(product?.image || "")
    setImageUrl(product?.image || "")
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!product) return

    setSaving(true)

    try {
      const form = e.currentTarget
      const data = new FormData(form)

      let finalImageUrl = imageUrl

      // Upload new image if selected
      if (newImageFile) {
        setUploading(true)
        try {
          finalImageUrl = await uploadImage(newImageFile)
          setImageUrl(finalImageUrl)
        } catch (error) {
          alert("Failed to upload image. Please try again.")
          setSaving(false)
          setUploading(false)
          return
        }
        setUploading(false)
      }

      const name = data.get("name") as string

      await updateProduct(id, {
        name,
        slug: generateSlug(name),
        price: Number(data.get("price")),
        category: data.get("category") as string,
        section: data.get("section") as string,
        image: finalImageUrl || (data.get("imageUrl") as string),
        description: data.get("description") as string,
        inStock: data.get("inStock") === "on",
      })

      alert("✅ Product updated successfully")
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Failed to update product. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  /* 🛑 BLOCK RENDERING UNTIL READY */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Product not found</p>
          <Button onClick={() => router.push("/admin/products")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product information and images</p>
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
                defaultValue={product.name}
                placeholder="e.g., Fresh Tomatoes"
                className="h-12"
                required
              />
            </div>

            {/* Price and Category Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="text-sm font-semibold mb-2">
                  Price (₦) *
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={product.price}
                  placeholder="e.g., 5000"
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
                  defaultValue={product.category}
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
                defaultValue={product.section}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-semibold mb-2">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={product.description}
                placeholder="Product description..."
                className="h-32 resize-none"
                required
              />
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                defaultChecked={product.inStock}
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <Label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                Product is in stock
              </Label>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2">Product Image</Label>
              <p className="text-sm text-gray-500 mb-4">
                Upload a new image or keep the current one. Accepted formats: JPG, PNG, WEBP, GIF (Max 5MB)
              </p>
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-cover"
                    unoptimized={!imagePreview.startsWith('http')}
                  />
                </div>
                {newImageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Upload Button */}
            <div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={uploading || saving}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                  uploading || saving
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-orange-300 hover:border-orange-500 hover:bg-orange-50"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                    <span className="font-medium text-orange-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-600">
                      {newImageFile ? "Change Image" : "Upload New Image"}
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Alternative: Image URL */}
            <div className="pt-4 border-t">
              <Label htmlFor="imageUrl" className="text-sm font-semibold mb-2">
                Or paste image URL
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={product.image}
                placeholder="https://example.com/image.jpg"
                className="h-12"
                disabled={!!newImageFile}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="flex-1 h-12"
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-orange-600 hover:bg-orange-700"
              disabled={saving || uploading}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}