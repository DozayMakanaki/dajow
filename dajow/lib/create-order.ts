import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

export async function createOrder({
  userId,
  email,
  items,
  total,
  shippingAddress,
}: {
  userId: string
  email: string
  items: OrderItem[]
  total: number
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
  }
}) {
  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    email,
    items,
    total,
    status: "pending",
    trackingCode: "",
    createdAt: serverTimestamp(),
    shippingAddress,
  })
  
  return docRef.id  // Return the order ID
}