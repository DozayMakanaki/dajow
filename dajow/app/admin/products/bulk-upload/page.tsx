"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/firestore-products"
import { ArrowLeft, Upload, CheckCircle2, XCircle, FileJson, FileText, FileCode } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkProduct {
  name: string
  price: number
  category: string
  section: string
  image: string
  description: string
  inStock: boolean
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function BulkUploadPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [results, setResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  async function processProducts(products: BulkProduct[]) {
    if (!Array.isArray(products) || products.length === 0) {
      alert("Invalid file format or empty array")
      return
    }

    setUploading(true)
    setResults(null)

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const product of products) {
      try {
        if (!product.name || !product.price || !product.category || !product.section || !product.image) {
          throw new Error(`Missing required fields`)
        }
        await addProduct({
          name: product.name,
          slug: generateSlug(product.name),
          price: Number(product.price),
          category: product.category,
          section: product.section,
          image: product.image,
          description: product.description || "",
          inStock: product.inStock !== false,
        })
        success++
      } catch (error) {
        failed++
        errors.push(`${product.name || "Unknown"}: ${error}`)
      }
    }

    setResults({ success, failed, errors })
    setUploading(false)

    if (failed === 0) {
      setTimeout(() => router.push("/admin/products"), 2000)
    }
  }

  async function handleFile(file: File) {
    if (!file) return

    try {
      const text = await file.text()
      let products: BulkProduct[] = []

      if (file.name.endsWith(".json")) {
        products = JSON.parse(text)
      } else if (file.name.endsWith(".csv")) {
        products = parseCSV(text)
      } else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
        const match = text.match(/export\s+(?:default\s+)?(?:const\s+\w+\s*=\s*)?\[([\s\S]*)\]/m)
        if (match) {
          const cleaned = match[1]
            .replace(/\/\/.*/g, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
          products = JSON.parse(`[${cleaned}]`)
        }
      }

      await processProducts(products)
    } catch (error) {
      alert("Failed to process file: " + error)
      setUploading(false)
    }
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await handleFile(file)
  }

  function parseCSV(text: string): BulkProduct[] {
    const lines = text.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim())
      const product: any = {}
      headers.forEach((header, index) => {
        product[header] = values[index]
      })
      return {
        name: product.name,
        price: parseFloat(product.price),
        category: product.category,
        section: product.section,
        image: product.image,
        description: product.description || "",
        inStock: product.inStock !== "false",
      }
    })
  }

  function downloadTemplate(format: "json" | "csv" | "ts") {
    const sampleProducts = [
      {
        name: "Fresh Tomatoes",
        price: 2.99,
        category: "Vegetables",
        section: "fresh",
        image: "https://example.com/tomatoes.jpg",
        description: "Fresh, ripe tomatoes",
        inStock: true,
      },
      {
        name: "Whole Milk",
        price: 1.49,
        category: "Dairy",
        section: "dairy",
        image: "https://example.com/milk.jpg",
        description: "Fresh whole milk",
        inStock: true,
      },
    ]

    let content = ""
    let filename = ""

    if (format === "json") {
      content = JSON.stringify(sampleProducts, null, 2)
      filename = "products-template.json"
    } else if (format === "csv") {
      const headers = ["name", "price", "category", "section", "image", "description", "inStock"]
      const rows = sampleProducts.map(
        (p) => `${p.name},${p.price},${p.category},${p.section},${p.image},${p.description},${p.inStock}`
      )
      content = [headers.join(","), ...rows].join("\n")
      filename = "products-template.csv"
    } else {
      content = `export const products = ${JSON.stringify(sampleProducts, null, 2)}`
      filename = "products-template.ts"
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Products</h1>
          <p className="text-gray-600 mt-2">Upload multiple products at once via JSON, CSV, or TypeScript</p>
        </div>

        {/* Templates Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Download a Template</h2>
          <p className="text-sm text-gray-500 mb-4">
            Start from a template to make sure your file is formatted correctly
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => downloadTemplate("json")}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
            >
              <FileJson className="h-4 w-4" />
              JSON Template
            </button>
            <button
              onClick={() => downloadTemplate("csv")}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
            >
              <FileText className="h-4 w-4" />
              CSV Template
            </button>
            <button
              onClick={() => downloadTemplate("ts")}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition"
            >
              <FileCode className="h-4 w-4" />
              TypeScript Template
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`bg-white rounded-xl border-2 border-dashed transition-all p-12 text-center mb-6 ${
            dragOver
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 hover:border-orange-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            accept=".json,.csv,.ts,.tsx"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition ${
              dragOver ? "bg-orange-100" : "bg-gray-100"
            }`}>
              <Upload className={`h-8 w-8 ${dragOver ? "text-orange-600" : "text-gray-400"}`} />
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-1">
              {uploading ? "Processing..." : "Drop your file here"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or <span className="text-orange-600 font-medium underline underline-offset-2">browse to upload</span>
            </p>
            <p className="text-xs text-gray-400">Supports .json, .csv, .ts, .tsx</p>
          </label>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upload Results</h2>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Successful</p>
                  <p className="text-3xl font-bold text-green-600">{results.success}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <XCircle className="h-8 w-8 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Failed</p>
                  <p className="text-3xl font-bold text-red-500">{results.failed}</p>
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700 mb-2">Errors:</p>
                <ul className="text-sm space-y-1">
                  {results.errors.map((error, i) => (
                    <li key={i} className="text-red-600 flex items-start gap-2">
                      <span className="mt-0.5 flex-shrink-0">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.failed === 0 && (
              <div className="flex items-center gap-2 text-green-700 font-semibold mt-2">
                <CheckCircle2 className="h-5 w-5" />
                All products uploaded successfully! Redirecting...
              </div>
            )}
          </div>
        )}

        {/* Required Fields Reference */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Fields</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { field: "name", desc: "Product name" },
              { field: "price", desc: "Price in GBP (number, e.g. 9.99)" },
              { field: "category", desc: "Product category" },
              { field: "section", desc: "popular, fresh, dairy, meat, pantry, snacks, wigs" },
              { field: "image", desc: "Direct image URL (https://...)" },
              { field: "description", desc: "Product description (optional)" },
              { field: "inStock", desc: "true or false (optional, defaults to true)" },
            ].map(({ field, desc }) => (
              <div key={field} className="flex items-start gap-2 text-sm">
                <code className="px-1.5 py-0.5 bg-gray-100 rounded text-orange-600 font-mono text-xs flex-shrink-0 mt-0.5">
                  {field}
                </code>
                <span className="text-gray-500">{desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs font-semibold text-orange-800 mb-2">💡 Where to get image URLs:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• <strong className="text-gray-700">Google Images</strong> → right-click image → "Copy image address"</li>
              <li>• <strong className="text-gray-700">Unsplash.com</strong> → free high-quality photos, right-click → copy</li>
              <li>• <strong className="text-gray-700">Imgur.com</strong> → upload your own, copy the direct link</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
