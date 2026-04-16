"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Mail, ArrowRight, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email address."
          : err.code === "auth/invalid-email"
          ? "Please enter a valid email address."
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-50">

      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20" />
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
        </div>

        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-2xl p-8">

          {/* SUCCESS STATE */}
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check your email!</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                We sent a password reset link to{" "}
                <span className="font-semibold text-gray-900">{email}</span>.
                Check your inbox and click the link to reset your password.
              </p>
              <p className="text-xs text-gray-400">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => { setSent(false); setEmail("") }}
                  className="text-orange-600 hover:underline font-medium"
                >
                  try again
                </button>
                .
              </p>
              <Link href="/login">
                <Button className="w-full h-12 bg-orange-600 hover:bg-orange-700 font-bold mt-2">
                  Back to Sign In
                </Button>
              </Link>
            </motion.div>
          ) : (

            /* FORM STATE */
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-500 text-sm">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-base font-bold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Reset Link
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        {!sent && (
          <p className="text-center mt-6 text-gray-600 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-bold hover:underline">
              Back to Sign In
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  )
}