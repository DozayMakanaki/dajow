"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, googleProvider, db } from "@/lib/firebase"
import { Eye, EyeOff, Mail, Lock, Chrome, ArrowRight, User as UserIcon, CheckCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function createUserDocument(uid: string, email: string | null, displayName?: string) {
    await setDoc(doc(db, "users", uid), {
      email,
      displayName: displayName || name || "",
      role: "user",
      createdAt: serverTimestamp(),
      views: 0,
      orders: 0,
      popularityScore: 0
    })
  }

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      await createUserDocument(res.user.uid, res.user.email, name)
      
      router.push("/") // Redirect to home after signup
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use")
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak")
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setError(null)
    setLoading(true)

    try {
      const res = await signInWithPopup(auth, googleProvider)
      await createUserDocument(res.user.uid, res.user.email, res.user.displayName || undefined)
      
      router.push("/") // Redirect to home after signup
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30 animate-blob" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-600/20 blur-2xl rounded-full group-hover:bg-orange-600/30 transition" />
              <span className="relative rounded-2xl bg-gradient-to-br from-orange-600 to-orange-500 px-8 py-3 text-3xl font-black text-white shadow-xl inline-block">
                DAJOW
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start shopping today</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-2xl p-8 space-y-6">
          
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 h-12 border-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 border-2 focus-visible:ring-orange-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 border-2 focus-visible:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 h-12 border-2 focus-visible:ring-orange-500"
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-base font-bold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-gray-500">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-orange-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-orange-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-700 font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
