"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import { User as UserIcon, LogOut, Mail, Phone, Calendar } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
      } else {
        router.push("/auth/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto py-8 lg:py-12">
      <Card className="overflow-hidden border-orange-100 shadow-sm transition-all hover:shadow-md">
        <div className="bg-orange-50 p-8 flex flex-col items-center border-b border-orange-100">
          <div className="h-24 w-24 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
            <UserIcon size={48} />
          </div>
          <h2 className="text-2xl font-bold text-orange-950">{user.displayName || "User"}</h2>
          <p className="text-orange-900/60 text-sm">Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
        </div>
        
        <CardContent className="p-8 space-y-6 text-orange-950">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100/50">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-900/50 uppercase tracking-wider">Email Address</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100/50">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-900/50 uppercase tracking-wider">Contact Number</p>
              <p className="font-semibold">{user.phoneNumber || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100/50">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-orange-900/50 uppercase tracking-wider">Last Login</p>
              <p className="font-semibold">{user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-0 border-t border-orange-100">
          <button 
            onClick={handleSignOut}
            className="w-full py-6 flex items-center justify-center gap-2 text-red-600 font-bold bg-white hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
