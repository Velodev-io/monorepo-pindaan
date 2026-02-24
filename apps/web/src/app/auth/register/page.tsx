"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/Button"
import BackButton from "@/components/shared/BackButton"
import { apiClient } from "@/lib/api-client"
import SacredLoading from "@/components/shared/SacredLoading"
import { AnimatePresence } from "framer-motion"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update displayName
      await updateProfile(userCredential.user, {
        displayName: name
      })

      // Sync user to PostgreSQL backend!
      await apiClient("/users/sync", {
         method: "POST",
         body: JSON.stringify({ name, email })
      });

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err: unknown) {
      const error = err as { code?: string; message: string };
      console.error("Registration Error:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already associated with an account. Please sign in instead.")
      } else if (error.code === "auth/weak-password") {
        setError("The password is too weak. Please use a stronger password.")
      } else if (error.code === "auth/invalid-email") {
        setError("Please provide a valid email address.")
      } else {
        setError("Failed to create account. Please check your details and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <SacredLoading message="Preparing Your Sacred Journey..." />}
      </AnimatePresence>
      <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          <BackButton className="mb-6 -ml-2" />
          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-8">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold text-orange-950">Create an Account</h2>
                <p className="mt-2 text-sm text-orange-900/60">
                  Join families worldwide honoring their loved ones securely.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-950 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Ramesh Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-950 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-950 mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <p className="text-xs text-orange-900/40 mt-1">Must be at least 8 characters</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Register securely"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-orange-900/60">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-amber-600 hover:text-amber-700">
                  Sign In
                </Link>
              </p>
          </div>
        </div>
      </div>
    </>
  )
}
