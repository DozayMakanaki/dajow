"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerUser } from "@/lib/auth"
import GoogleAuthButton from "@/components/google-signin-button"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      await registerUser(email, password)
      router.push("/")
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form className="w-full max-w-sm space-y-4 border p-6 rounded-lg">
        <h1 className="text-xl font-bold text-center">Create Account</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <GoogleAuthButton />

        <div className="text-center text-sm text-muted-foreground">OR</div>

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

        <Button className="w-full" onClick={handleSubmit}>
          Register
        </Button>
      </form>
    </div>
  )
}
