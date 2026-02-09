import { collection, query, where, getDocs, orderBy, limit, doc, updateDoc, increment, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  section?: string
  searchKeywords?: string[]
  
  // Popularity tracking fields
  views?: number
  orders?: number
  popularityScore?: number
  lastViewed?: Date | null
  lastOrdered?: Date | null
}

/**
 * Get all products or filter by category
 */
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

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)

    if (productSnap.exists()) {
      return {
        id: productSnap.id,
        ...productSnap.data()
      } as Product
    }
    return null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

/**
 * Get products by category and section
 */
export async function getProductsBySection(category: string, section: string, maxResults: number = 20) {
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
      ...(doc.data() as Omit<Product, "id">),
    }))
  } catch (error) {
    console.error("Error fetching products by section:", error)
    return []
  }
}

/**
 * Get popular products by category and section
 * Sorted by popularityScore (orders × 5 + views)
 */
export async function getPopularProducts(category: string, section: string, maxResults: number = 4) {
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
      ...(doc.data() as Omit<Product, "id">),
    }))
  } catch (error) {
    // If index doesn't exist, fall back to regular query
    console.log("Popularity index not found, using fallback")
    return getProductsBySection(category, section, maxResults)
  }
}

/**
 * Get random products from a section
 */
export async function getRandomProducts(category: string, section: string, maxResults: number = 4) {
  try {
    const products = await getProductsBySection(category, section, 20)
    
    // Shuffle array
    const shuffled = [...products].sort(() => Math.random() - 0.5)
    
    return shuffled.slice(0, maxResults)
  } catch (error) {
    console.error("Error fetching random products:", error)
    return []
  }
}

/**
 * Search products by name or keywords
 */
export async function searchProducts(searchTerm: string, category?: string) {
  try {
    const ref = collection(db, "products")
    let q = category
      ? query(ref, where("category", "==", category))
      : ref

    const snapshot = await getDocs(q)
    const allProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }))

    // Filter by search term (client-side search)
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

/* ============================================ */
/* POPULARITY TRACKING FUNCTIONS */
/* ============================================ */

/**
 * Track when a product is viewed
 * Call this on product detail page
 */
export async function trackProductView(productId: string) {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        views: increment(1),
        popularityScore: increment(1), // Views = 1 point
        lastViewed: new Date()
      })
    }
  } catch (error) {
    console.error("Error tracking product view:", error)
  }
}

/**
 * Track when a product is ordered
 * Call this when order is successfully created
 */
export async function trackProductOrder(productId: string, quantity: number = 1) {
  try {
    const productRef = doc(db, "products", productId)
    const productSnap = await getDoc(productRef)
    
    if (productSnap.exists()) {
      await updateDoc(productRef, {
        orders: increment(quantity),
        popularityScore: increment(quantity * 5), // Orders = 5 points each
        lastOrdered: new Date()
      })
    }
  } catch (error) {
    console.error("Error tracking product order:", error)
  }
}

/**
 * Initialize product popularity fields
 * Call this when creating new products
 */
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

/**
 * Batch initialize popularity for existing products
 * Run this once to add fields to all existing products
 */
export async function batchInitializePopularity() {
  try {
    const products = await getProducts()
    
    const promises = products.map(product => {
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
