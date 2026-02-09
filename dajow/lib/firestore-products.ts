import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "./firebase"

/* ================= TYPES ================= */

export type Product = {
  id?: string
  name: string
  slug: string
  price: number
  category: string
  section: string
  image: string
  description: string
  inStock: boolean
  createdAt?: any
  updatedAt?: any
}

/* ================= READ ================= */

/** Get all products */
export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"))
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as Product[]
}

/** Get product by slug (product page) */
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  if (!slug) return null

  const q = query(
    collection(db, "products"),
    where("slug", "==", slug)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  const docSnap = snapshot.docs[0]

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Product
}

/** Get product by ID (admin edit page) */
export async function getProductById(
  id: string
): Promise<Product | null> {
  const ref = doc(db, "products", id)
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...snap.data(),
  } as Product
}

/* ================= WRITE (ADMIN) ================= */

/** ✅ ADD PRODUCT (this fixes your crash) */
export async function addProduct(
  product: Product
): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

/** Update product */
export async function updateProduct(
  id: string,
  data: Partial<Product>
) {
  await updateDoc(doc(db, "products", id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/** Delete product */
export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id))
}
