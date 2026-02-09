import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  searchKeywords?: string[]
}

export async function getProducts(category?: string) {
  const ref = collection(db, "products")

  const q = category
    ? query(ref, where("category", "==", category))
    : ref

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }))
}
