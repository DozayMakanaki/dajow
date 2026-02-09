"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addProduct } from "@/lib/firestore-products"

interface BulkProduct {
  name: string
  price: number
  category: string
  section: string
  image: string
  description: string
  inStock: boolean
}

export default function BulkUploadPage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  })

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setResults({ success: 0, failed: 0, errors: [] })

    try {
      const text = await file.text()
      let products: BulkProduct[] = []

      // Parse based on file extension
      if (file.name.endsWith('.json')) {
        products = JSON.parse(text)
      } else if (file.name.endsWith('.csv')) {
        products = parseCSV(text)
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        // Extract array from TypeScript file
        const match = text.match(/export\s+(?:default\s+)?(?:const\s+\w+\s*=\s*)?\[([\s\S]*)\]/m)
        if (match) {
          // Clean up the TypeScript syntax
          const cleaned = match[1]
            .replace(/\/\/.*/g, '') // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
          products = JSON.parse(`[${cleaned}]`)
        }
      }

      if (!Array.isArray(products) || products.length === 0) {
        alert('Invalid file format or empty array')
        setUploading(false)
        return
      }

      // Validate and upload products
      let success = 0
      let failed = 0
      const errors: string[] = []

      for (const product of products) {
        try {
          // Validate required fields
          if (!product.name || !product.price || !product.category || !product.section || !product.image) {
            throw new Error(`Missing required fields for product: ${product.name || 'Unknown'}`)
          }

          await addProduct({
            name: product.name,
            price: Number(product.price),
            category: product.category,
            section: product.section,
            image: product.image,
            description: product.description || '',
            inStock: product.inStock !== false, // Default to true
          })
          success++
        } catch (error) {
          failed++
          errors.push(`${product.name}: ${error}`)
        }
      }

      setResults({ success, failed, errors })
      
      if (failed === 0) {
        setTimeout(() => {
          router.push('/admin/products')
        }, 2000)
      }
    } catch (error) {
      alert('Failed to process file: ' + error)
    } finally {
      setUploading(false)
    }
  }

  function parseCSV(text: string): BulkProduct[] {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
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
        description: product.description || '',
        inStock: product.inStock !== 'false'
      }
    })
  }

  function downloadTemplate(format: 'json' | 'csv' | 'ts') {
    const sampleProducts = [
      {
        name: "Fresh Tomatoes",
        price: 5000,
        category: "Vegetables",
        section: "fresh",
        image: "https://example.com/tomatoes.jpg",
        description: "Fresh, ripe tomatoes",
        inStock: true
      },
      {
        name: "Whole Milk",
        price: 3500,
        category: "Dairy",
        section: "dairy",
        image: "https://example.com/milk.jpg",
        description: "Fresh whole milk",
        inStock: true
      }
    ]

    let content = ''
    let filename = ''

    if (format === 'json') {
      content = JSON.stringify(sampleProducts, null, 2)
      filename = 'products-template.json'
    } else if (format === 'csv') {
      const headers = ['name', 'price', 'category', 'section', 'image', 'description', 'inStock']
      const rows = sampleProducts.map(p => 
        `${p.name},${p.price},${p.category},${p.section},${p.image},${p.description},${p.inStock}`
      )
      content = [headers.join(','), ...rows].join('\n')
      filename = 'products-template.csv'
    } else if (format === 'ts') {
      content = `export const products = ${JSON.stringify(sampleProducts, null, 2)}`
      filename = 'products-template.ts'
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Upload Products</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">📋 Supported Formats</h2>
        <ul className="text-sm space-y-1 mb-4">
          <li>• <strong>JSON</strong> - Array of product objects</li>
          <li>• <strong>CSV</strong> - Comma-separated values with headers</li>
          <li>• <strong>TypeScript</strong> - Exported array of products</li>
        </ul>
        
        <h3 className="font-semibold mb-2">Download Templates:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => downloadTemplate('json')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            JSON Template
          </button>
          <button
            onClick={() => downloadTemplate('csv')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            CSV Template
          </button>
          <button
            onClick={() => downloadTemplate('ts')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
          >
            TypeScript Template
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".json,.csv,.ts,.tsx"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer"
        >
          <div className="text-6xl mb-4">📁</div>
          <p className="text-lg font-semibold mb-2">
            {uploading ? 'Uploading...' : 'Click to upload file'}
          </p>
          <p className="text-sm text-gray-500">
            JSON, CSV, or TypeScript files accepted
          </p>
        </label>
      </div>

      {(results.success > 0 || results.failed > 0) && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Upload Results</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-3xl font-bold text-green-600">{results.success}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-3xl font-bold text-red-600">{results.failed}</p>
            </div>
          </div>

          {results.errors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Errors:</h3>
              <ul className="text-sm space-y-1">
                {results.errors.map((error, i) => (
                  <li key={i} className="text-red-600">• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {results.failed === 0 && (
            <p className="text-green-600 font-semibold">
              ✅ All products uploaded successfully! Redirecting...
            </p>
          )}
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Required Fields:</h3>
        <ul className="text-sm space-y-1 text-gray-600">
          <li>• <strong>name</strong> - Product name</li>
          <li>• <strong>price</strong> - Price in Naira (number)</li>
          <li>• <strong>category</strong> - Product category</li>
          <li>• <strong>section</strong> - Section (popular, fresh, dairy, meat, pantry, snacks)</li>
          <li>• <strong>image</strong> - Image URL (must start with http/https)</li>
          <li>• <strong>description</strong> - Product description (optional)</li>
          <li>• <strong>inStock</strong> - true/false (optional, defaults to true)</li>
        </ul>
      </div>
    </div>
  )
}
