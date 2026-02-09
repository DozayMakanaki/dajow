"use client"

import { useState } from "react"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Product } from "@/app/admin/products/page"
import { PRODUCT_CATEGORIES } from "@/lib/categories"

export default function EditProductDialog({
  product,
  onClose,
  onSaved,
}: {
  product: Product
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price)
  const [category, setCategory] = useState(product.category)
  const [stock, setStock] = useState(product.stock)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)

    await updateDoc(doc(db, "products", product.id), {
      name,
      price,
      category,
      stock,
    })

    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          {/* CATEGORY — UPDATED TO SELECT */}
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
