import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, secret } = await req.json()

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD ||
    secret !== process.env.ADMIN_SECRET
  ) {
    return NextResponse.json(
      { error: "Invalid admin credentials" },
      { status: 401 }
    )
  }

  return NextResponse.json({ ok: true })
}
