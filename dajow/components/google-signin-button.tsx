"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { loginWithGoogle } from "@/lib/auth"

export default function GoogleSignInButton() {
  const router = useRouter()

  async function handleGoogleSignIn() {
    try {
      await loginWithGoogle()
      router.push("/")
    } catch (error: any) {
      alert(error.message)
      console.error(error)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center justify-center gap-3"
      onClick={handleGoogleSignIn}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.2 3.6l6.9-6.9C35.9 2.38 30.47 0 24 0 14.64 0 6.4 5.38 2.4 13.22l8.1 6.3C12.47 13.09 17.76 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.21-.43-4.73H24v9.05h12.5c-.54 2.9-2.16 5.35-4.6 7.05l7.1 5.5c4.15-3.82 6.1-9.45 6.1-16.87z"/>
        <path fill="#FBBC05" d="M10.5 28.82c-.48-1.45-.75-2.99-.75-4.57s.27-3.12.75-4.57l-8.1-6.3C.86 16.6 0 20.17 0 24.25s.86 7.65 2.4 10.87l8.1-6.3z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.78l-7.1-5.5c-1.97 1.32-4.5 2.1-8.8 2.1-6.24 0-11.53-3.59-13.5-8.52l-8.1 6.3C6.4 42.62 14.64 48 24 48z"/>
      </svg>
      Continue with Google
    </Button>
  )
}
