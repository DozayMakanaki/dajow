"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { updateProduct } from "@/lib/firestore-products"
import Image from "next/image"
import { Save, ArrowLeft, Loader2, Link as LinkIcon, X, Plus, Upload } from "lucide-react"
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

/**
 * Convert various image hosting URLs to direct image links
 */
function convertToDirectImageUrl(url: string): string {
  if (!url) return url
  
  const trimmed = url.trim()
  
  // Already a direct image URL
  if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(trimmed)) {
    return trimmed
  }
  
  // Imgur conversions
  if (trimmed.includes('imgur.com')) {
    // imgur.com/abc123 → i.imgur.com/abc123.jpg
    const imgurMatch = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)/)
    if (imgurMatch) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`
    }
    
    // i.imgur.com/abc123 (no extension) → add .jpg
    if (trimmed.includes('i.imgur.com') && !trimmed.match(/\.(jpg|png|gif|webp)$/i)) {
      return `${trimmed}.jpg`
    }
  }
  
  // Google Drive conversions
  if (trimmed.includes('drive.google.com')) {
    const driveMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (driveMatch) {
      return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`
    }
  }
  
  // Dropbox conversions
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace('?dl=0', '?dl=1')
  }
  
  return trimmed
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Image URL state
  const [imageUrl, setImageUrl] = useState("")
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [imageError, setImageError] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!id) return
    
    // Fetch all products and find the one we need
    import('@/lib/firestore-products').then(({ getProducts }) => {
      return getProducts()
    }).then((products) => {
      const foundProduct = products.find((p: any) => p.id === id)
      if (!foundProduct) {
        router.replace("/admin/products")
        return
      }
      setProduct(foundProduct)
      setImageUrl(foundProduct.image || "")
      setImageUrlInput(foundProduct.image || "")
    }).finally(() => setLoading(false))
  }, [id, router])

  // Apply the typed URL as the live preview
  function handleUrlInput(val: string) {
    setImageUrlInput(val)
    setImageError(false)
    const directUrl = convertToDirectImageUrl(val)
    setImageUrl(directUrl)
  }

  function clearImage() {
    setImageUrl("")
    setImageUrlInput("")
    setImageError(false)
  }

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB for data URLs work best)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ Image is larger than 5MB. For best performance, use smaller images or compress them first.')
      // Still allow it, but warn the user
    }

    setUploading(true)
    setImageError(false)

    try {
      // Convert file to base64 data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Set the data URL as the image
      setImageUrl(dataUrl)
      setImageUrlInput(dataUrl.substring(0, 50) + '...' + dataUrl.substring(dataUrl.length - 20))
      setImageError(false)
      
      alert('✅ Image converted successfully! The image is now embedded as a data URL.')
    } catch (error) {
      console.error('Image conversion error:', error)
      alert('❌ Failed to convert image. Please try again or paste a direct URL instead.')
      setImageError(true)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!product) return
    setSaving(true)

    try {
      const form = e.currentTarget
      const data = new FormData(form)
      const name = data.get("name") as string

      await updateProduct(id, {
        name,
        slug: generateSlug(name),
        price: Number(data.get("price")),
        category: data.get("category") as string,
        section: data.get("section") as string,
        image: imageUrl,
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
          <p className="text-gray-600 mt-2">Update product information</p>
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
                  defaultValue={product.price}
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
                <option value="groceries">Groceries</option>
                <option value="grains">Rice & Grains</option>
                <option value="dairy">Dairy</option>
                <option value="meat">Meat & Poultry</option>
                <option value="pantry">Pantry</option>
                <option value="snacks">Snacks</option>
                <option value="wigs">Wigs</option>
                <option value="soap">Soap & Personal Care</option>
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

            {/* In Stock */}
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

          {/* Image Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
            <div>
              <Label className="text-sm font-semibold">Product Image</Label>
              <p className="text-sm text-gray-500 mt-1">
                Upload an image file (converts to data URL) or paste a direct image URL
              </p>
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                    e.target.value = '' // Clear input
                  }}
                  className="hidden"
                  disabled={uploading}
                />
                <div className={`flex items-center justify-center gap-2 h-12 px-4 rounded-lg border-2 border-dashed transition cursor-pointer ${
                  uploading 
                    ? "bg-gray-100 border-gray-300 cursor-not-allowed" 
                    : "bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400"
                }`}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
                      <span className="text-sm font-medium text-orange-600">Converting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">Convert Image File to URL</span>
                    </>
                  )}
                </div>
              </label>
            </div>

            {/* Info about data URLs */}
            {imageUrl && imageUrl.startsWith('data:image') && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-800 mb-1">✅ Image Embedded as Data URL</p>
                <p className="text-xs text-green-700">
                  Your image is now stored directly in the URL - no external hosting needed!
                </p>
              </div>
            )}

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or paste URL</span>
              </div>
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
                  disabled={uploading}
                />
              </div>
              {imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={clearImage}
                  className="h-12 w-12 flex-shrink-0 text-red-500 hover:text-red-600 hover:border-red-300"
                  disabled={uploading}
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
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-xs font-semibold text-blue-800 mb-2">💡 Image Conversion Tips:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Upload files (JPG, PNG, WEBP, GIF) - instantly converts to data URL</li>
                <li>• Images under 500KB work best for optimal performance</li>
                <li>• Or paste URLs from Google Images, Unsplash, etc.</li>
                <li>• Data URLs embed the image directly - no hosting needed!</li>
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
