"use client"

import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

export default function DeleteProductDialog({
  productId,
  productName,
  onClose,
  onDeleted,
}: {
  productId: string
  productName: string
  onClose: () => void
  onDeleted: () => void
}) {
  async function handleDelete() {
    await deleteDoc(doc(db, "products", productId))
    onDeleted()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 space-y-4">
        <h2 className="text-lg font-semibold">Delete Product</h2>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-medium">{productName}</span>?  
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
