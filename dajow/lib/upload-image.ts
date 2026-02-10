import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export async function uploadImage(file: File): Promise<string> {
  const timestamp = Date.now()
  const filename = `products/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  const storageRef = ref(storage, filename)
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        console.error("Upload error:", error)
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        console.log('File available at', downloadURL)
        resolve(downloadURL)
      }
    )
  })
}