import { NextRequest, NextResponse } from "next/server"
import { adminStorage } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const timestamp = Date.now()
    const filename = `products/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const fileRef = adminStorage.file(filename)
    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
      public: true,
    })

    const publicUrl = `https://storage.googleapis.com/dajow-project.appspot.com/${filename}`

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}