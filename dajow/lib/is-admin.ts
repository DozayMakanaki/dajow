import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function isAdmin(uid: string) {
  const userRef = doc(db, "users", uid)
  const snap = await getDoc(userRef)

  if (!snap.exists()) return false

  return snap.data().role === "admin"
}
