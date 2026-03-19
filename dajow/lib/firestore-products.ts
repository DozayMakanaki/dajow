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
  increment,
  orderBy,
  limit,
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
  images?: string[]  // Multiple product images for gallery
  description: string
  inStock: boolean
  createdAt?: any
  updatedAt?: any
  
  // Popularity tracking
  views?: number
  orders?: number
  popularityScore?: number
  lastViewed?: Date | null
  lastOrdered?: Date | null
  
  // Variant support (for products with multiple sizes/colors/prices)
  hasVariants?: boolean
  variants?: Array<{
    size?: string
    color?: string
    price: number
    image?: string
  }>
  
  searchKeywords?: string[]
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

/** Get products by category and section */
export async function getProductsBySection(
  category: string,
  section: string,
  maxResults: number = 20
): Promise<Product[]> {
  try {
    const ref = collection(db, "products")
    const q = query(
      ref,
      where("category", "==", category),
      where("section", "==", section),
      limit(maxResults)
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.error("Error fetching products by section:", error)
    return []
  }
}

/** Get popular products by category and section */
export async function getPopularProducts(
  category: string,
  section: string,
  maxResults: number = 4
): Promise<Product[]> {
  try {
    const ref = collection(db, "products")
    const q = query(
      ref,
      where("category", "==", category),
      where("section", "==", section),
      orderBy("popularityScore", "desc"),
      limit(maxResults)
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]
  } catch (error) {
    console.log("Popularity index not found, using fallback")
    return getProductsBySection(category, section, maxResults)
  }
}

/** Get random products from a section */
export async function getRandomProducts(
  category: string,
  section: string,
  maxResults: number = 4
): Promise<Product[]> {
  try {
    const products = await getProductsBySection(category, section, 20)
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, maxResults)
  } catch (error) {
    console.error("Error fetching random products:", error)
    return []
  }
}

/** Search products by name or keywords */
export async function searchProducts(
  searchTerm: string,
  category?: string
): Promise<Product[]> {
  try {
    const ref = collection(db, "products")
    let q = category
      ? query(ref, where("category", "==", category))
      : ref

    const snapshot = await getDocs(q)
    const allProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[]

    const searchLower = searchTerm.toLowerCase()
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.searchKeywords?.some(keyword => 
        keyword.toLowerCase().includes(searchLower)
      )
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

/* ================= WRITE (ADMIN) ================= */

/** Add product */
export async function addProduct(
  product: Product
): Promise<string> {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    views: 0,
    orders: 0,
    popularityScore: 0,
    lastViewed: null,
    lastOrdered: null,
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

/* ================= POPULARITY TRACKING ================= */

/** Track when a product is viewed */
export async function trackProductView(productId: string) {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        views: increment(1),
        popularityScore: increment(1),
        lastViewed: new Date()
      })
    }
  } catch (error) {
    console.error("Error tracking product view:", error)
  }
}

/** Track when a product is ordered */
export async function trackProductOrder(productId: string, quantity: number = 1) {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        orders: increment(quantity),
        popularityScore: increment(quantity * 5),
        lastOrdered: new Date()
      })
    }
  } catch (error) {
    console.error("Error tracking product order:", error)
  }
}

/** Initialize product popularity fields */
export async function initializeProductPopularity(productId: string) {
  try {
    const productRef = doc(db, "products", productId)
    
    await updateDoc(productRef, {
      views: 0,
      orders: 0,
      popularityScore: 0,
      lastViewed: null,
      lastOrdered: null
    })
  } catch (error) {
    console.error("Error initializing product popularity:", error)
  }
}

/** Batch initialize popularity for existing products */
export async function batchInitializePopularity() {
  try {
    const products = await getProducts()
    
    const promises = products.map(product => {
      if (!product.id) return Promise.resolve()
      
      const productRef = doc(db, "products", product.id)
      return updateDoc(productRef, {
        views: product.views || 0,
        orders: product.orders || 0,
        popularityScore: product.popularityScore || 0,
        lastViewed: product.lastViewed || null,
        lastOrdered: product.lastOrdered || null
      })
    })
    
    await Promise.all(promises)
    console.log(`✅ Initialized popularity for ${products.length} products`)
    return products.length
  } catch (error) {
    console.error("Error batch initializing popularity:", error)
    return 0
  }
}
