import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { app } from "./firebase"

const storage = getStorage(app)

export async function uploadImage(file: File): Promise<string> {
  // Create a unique filename
  const timestamp = Date.now()
  const filename = `products/${timestamp}-${file.name}`
  
  // Create a reference to the file location
  const storageRef = ref(storage, filename)
  
  // Upload the file
  await uploadBytes(storageRef, file)
  
  // Get the download URL
  const downloadURL = await getDownloadURL(storageRef)
  
  return downloadURL
}
