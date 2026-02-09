// ✅ REQUIRED — Firebase Admin CANNOT run in Edge
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import * as XLSX from "xlsx"
import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, Timestamp } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"

// -----------------------------
// Firebase Admin Init (SAFE)
// -----------------------------
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  })
}

const db = getFirestore()
const bucket = getStorage().bucket()

// -----------------------------
// POST handler
// -----------------------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // -----------------------------
    // Upload XLSX to Firebase Storage
    // -----------------------------
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `admin-uploads/${Date.now()}-${file.name}`

    const storageFile = bucket.file(fileName)

    await storageFile.save(buffer, {
      contentType: file.type,
      resumable: false,
    })

    // -----------------------------
    // Parse XLSX
    // -----------------------------
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    const rows = XLSX.utils.sheet_to_json<any>(sheet)

    if (!rows.length) {
      return NextResponse.json(
        { error: "Excel file is empty" },
        { status: 400 }
      )
    }

    // -----------------------------
    // Save products to Firestore
    // Expected columns:
    // name | price | stock | category | description | images
    // images = comma-separated URLs
    // -----------------------------
    const batch = db.batch()

    rows.forEach((row) => {
      if (!row.name || !row.price) return

      const ref = db.collection("products").doc()

      batch.set(ref, {
        name: String(row.name),
        price: Number(row.price),
        stock: Number(row.stock ?? 0),
        category: String(row.category ?? ""),
        description: String(row.description ?? ""),
        images: row.images
          ? String(row.images)
              .split(",")
              .map((url) => url.trim())
          : [],
        active: true,
        createdAt: Timestamp.now(),
      })
    })

    await batch.commit()

    return NextResponse.json({
      success: true,
      message: "Products uploaded successfully",
      count: rows.length,
      storagePath: fileName,
    })
  } catch (err: any) {
    console.error("UPLOAD XLSX ERROR:", err)

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    )
  }
}
