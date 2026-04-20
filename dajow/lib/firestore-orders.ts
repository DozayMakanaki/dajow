// /lib/firestore-orders.ts

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc
} from "firebase/firestore"
import { db } from "./firebase"

export type OrderItem = {
  productId: string
  productName: string
  price: number
  quantity: number
  image?: string
}

export type Order = {
  id?: string
  userId: string
  userEmail: string
  userName?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "stripe" | "paypal" | "cash"
  paymentStatus: "pending" | "paid" | "failed"
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    postcode: string
    country: string
  }
  orderNumber: string
  createdAt: any
  updatedAt?: any
}

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// Create new order
export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<string> {
  const orderNumber = generateOrderNumber()
  
  const docRef = await addDoc(collection(db, "orders"), {
    ...orderData,
    orderNumber,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

// Get all orders (Admin)
export async function getAllOrders(): Promise<Order[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[]
}

// Get user's orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  )
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[]
}

// Get single order
export async function getOrderById(orderId: string): Promise<Order | null> {
  const docRef = doc(db, "orders", orderId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Order
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
) {
  await updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp()
  })
}