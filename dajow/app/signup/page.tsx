"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

import { auth, googleProvider, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function createUserDocument(uid: string, email: string | null) {
    await setDoc(doc(db, "users", uid), {
      email,
      role: "user",
      createdAt: serverTimestamp(),
    })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      await createUserDocument(res.user.uid, res.user.email)

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    setLoading(true)

    try {
      const res = await signInWithPopup(auth, googleProvider)

      await createUserDocument(res.user.uid, res.user.email)

      router.push("/login")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-sm space-y-4 rounded-lg border p-6">
        <h1 className="text-xl font-semibold text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full"
        >
          Continue with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          or
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          onClick={handleSignup}
          disabled={loading}
          className="w-full"
        >
          Sign up with Email
        </Button>
      </form>
    </div>
  )
}
