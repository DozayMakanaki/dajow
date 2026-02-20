"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/firestore-products"
import Image from "next/image"
import { Save, ArrowLeft, Loader2, Link as LinkIcon, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductVariant {
  size?: string
  color?: string
  price: number
  image?: string
}

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

  // Variants state
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [variantType, setVariantType] = useState<"size" | "color">("size")

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

  // Variant management functions
  function addVariant() {
    const newVariant: ProductVariant = {
      [variantType]: "",
      price: 0,
      image: ""
    }
    setVariants([...variants, newVariant])
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  function updateVariant(index: number, field: keyof ProductVariant, value: string | number) {
    const updated = [...variants]
    if (field === 'price') {
      updated[index][field] = Number(value)
    } else {
      // @ts-ignore
      updated[index][field] = value
    }
    setVariants(updated)
  }

  function toggleHasVariants(enabled: boolean) {
    setHasVariants(enabled)
    if (enabled && variants.length === 0) {
      addVariant()
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get("name") as string

    if (!imageUrl && !hasVariants) {
      alert("Please provide an image URL")
      return
    }

    setSaving(true)

    try {
      const productData: any = {
        name,
        slug: generateSlug(name),
        price: Number(data.get("price")),
        category: data.get("category") as string,
        section: data.get("section") as string,
        image: imageUrl,
        description: data.get("description") as string,
        inStock: data.get("inStock") === "on",
        hasVariants: hasVariants
      }

      // Add variants if enabled
      if (hasVariants && variants.length > 0) {
        productData.variants = variants.filter(v => {
          const hasRequiredField = variantType === "size" ? v.size : v.color
          return hasRequiredField && v.price > 0
        })
      }

      await addProduct(productData)

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
                  {hasVariants ? "Base Price (£)" : "Price (£) *"}
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 9.99"
                  className="h-12"
                  required={!hasVariants}
                />
                {hasVariants && (
                  <p className="text-xs text-gray-500 mt-1">
                    This is the fallback price. Variants will have their own prices.
                  </p>
                )}
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
              <Label className="text-sm font-semibold">
                Product Image {!hasVariants && "*"}
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                {hasVariants 
                  ? "This is the default/fallback image. You can set specific images for each variant below."
                  : "Paste a direct image URL from any source"}
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
          </div>

          {/* Variants Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <Label className="text-sm font-semibold">Product Variants</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Add different sizes or colors with unique prices and images
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasVariants"
                  checked={hasVariants}
                  onChange={(e) => toggleHasVariants(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <Label htmlFor="hasVariants" className="text-sm font-medium cursor-pointer">
                  Enable Variants
                </Label>
              </div>
            </div>

            {hasVariants && (
              <div className="space-y-6">
                {/* Variant Type Selector */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="variantSize"
                      checked={variantType === "size"}
                      onChange={() => setVariantType("size")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <Label htmlFor="variantSize" className="text-sm cursor-pointer">
                      Size Variants (e.g., 5kg, 10kg, 20kg)
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="variantColor"
                      checked={variantType === "color"}
                      onChange={() => setVariantType("color")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <Label htmlFor="variantColor" className="text-sm cursor-pointer">
                      Color Variants (e.g., Black, Red, Blue)
                    </Label>
                  </div>
                </div>

                {/* Variant List */}
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">
                          Variant {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(index)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Size or Color */}
                        <div>
                          <Label className="text-xs font-semibold mb-2">
                            {variantType === "size" ? "Size *" : "Color *"}
                          </Label>
                          <Input
                            value={variant[variantType] || ""}
                            onChange={(e) => updateVariant(index, variantType, e.target.value)}
                            placeholder={variantType === "size" ? "e.g., 5kg" : "e.g., Black"}
                            className="h-10"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <Label className="text-xs font-semibold mb-2">
                            Price (£) *
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={variant.price || ""}
                            onChange={(e) => updateVariant(index, "price", e.target.value)}
                            placeholder="e.g., 9.99"
                            className="h-10"
                          />
                        </div>
                      </div>

                      {/* Variant Image */}
                      <div>
                        <Label className="text-xs font-semibold mb-2">
                          Variant Image (Optional)
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                            <Input
                              value={variant.image || ""}
                              onChange={(e) => updateVariant(index, "image", e.target.value)}
                              placeholder="https://example.com/variant-image.jpg"
                              className="h-10 pl-9 text-sm"
                            />
                          </div>
                        </div>
                        {variant.image && (
                          <div className="mt-3 rounded-lg overflow-hidden border w-24 h-24">
                            <div className="relative w-full h-full">
                              <Image
                                src={variant.image}
                                alt="Variant preview"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Variant Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add {variantType === "size" ? "Size" : "Color"} Variant
                </Button>

                {/* Variants Info */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <p className="text-xs font-semibold text-blue-800 mb-2">💡 Variant Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Each variant can have its own price and image</li>
                    <li>• Users will see color boxes or size buttons based on your choice</li>
                    <li>• The product image changes when users select different variants</li>
                    <li>• If no variant image is provided, the default product image is used</li>
                  </ul>
                </div>
              </div>
            )}
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
