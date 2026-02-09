import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  Timestamp
} from "firebase/firestore"

/* DASHBOARD */
export async function getDashboardStats() {
  const ordersSnap = await getDocs(collection(db, "orders"))
  const productsSnap = await getDocs(collection(db, "products"))

  const orders = ordersSnap.docs.map(d => d.data())
  const revenue = orders.reduce((sum, o: any) => sum + o.total, 0)

  return {
    totalOrders: orders.length,
    totalRevenue: revenue,
    totalProducts: productsSnap.size,
    pendingOrders: orders.filter(o => o.status === "pending").length
  }
}

/* ORDERS */
export async function getOrders() {
  const snap = await getDocs(collection(db, "orders"))
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export async function updateOrderStatus(id: string, status: string) {
  await updateDoc(doc(db, "orders", id), { status })
}

/* PRODUCTS */
export async function addProduct(data: any) {
  await addDoc(collection(db, "products"), {
    ...data,
    createdAt: Timestamp.now()
  })
}
