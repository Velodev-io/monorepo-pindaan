"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import { User as UserIcon, LogOut, Mail, Phone, Calendar, Edit2, MapPin, Check, X } from "lucide-react"

import BackButton from "@/components/shared/BackButton"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setPhoneNumber(currentUser.phoneNumber || "")
        // Mock address - in a real app this would come from the database
        setAddress("123 Sacred Ghat Road, Kashi, Uttar Pradesh")
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

  const handleSavePhone = () => {
    setIsEditingPhone(false)
    // Here you would typically call a backend API to update the user profile
  }

  const handleSaveAddress = () => {
    setIsEditingAddress(false)
    // Here you would typically call a backend API to update the user profile
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
    <div className="max-w-2xl mx-auto py-8 lg:py-12 px-4">
      <BackButton className="mb-6 -ml-2" />
      <Card className="overflow-hidden border-orange-100 shadow-sm transition-all hover:shadow-md bg-white">
        <div className="bg-orange-50 p-8 flex flex-col items-center border-b border-orange-100 relative">
          <div className="h-24 w-24 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
            <UserIcon size={48} />
          </div>
          <h2 className="text-2xl font-bold text-orange-950">{user.displayName || "User"}</h2>
          <p className="text-orange-900/60 text-sm">Member since {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
        </div>
        
        <CardContent className="p-8 space-y-6 text-orange-950">
          {/* Email - Read Only */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <Mail size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-orange-900/40 uppercase tracking-widest mb-0.5">Primary Email</p>
              <p className="font-semibold text-orange-950">{user.email}</p>
            </div>
          </div>
          
          {/* Phone Number - Editable */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 group transition-all">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <Phone size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-orange-900/40 uppercase tracking-widest mb-0.5">Contact Number</p>
              {isEditingPhone ? (
                <div className="flex items-center gap-2 mt-1">
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 bg-white border border-amber-200 rounded-md px-2 py-1 text-sm outline-none focus:ring-2 ring-amber-500/20"
                    placeholder="Enter phone number"
                    autoFocus
                  />
                  <button onClick={handleSavePhone} className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600">
                    <Check size={16} />
                  </button>
                  <button onClick={() => setIsEditingPhone(false)} className="p-1.5 bg-orange-100 text-orange-900 rounded-md hover:bg-orange-200">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <p className="font-semibold text-orange-950">{phoneNumber || "Not provided"}</p>
              )}
            </div>
            {!isEditingPhone && (
              <button 
                onClick={() => setIsEditingPhone(true)}
                className="p-2 text-orange-300 hover:text-amber-600 transition-colors"
                title="Edit Phone"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          {/* Address - Editable */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 group transition-all">
            <div className="p-2 rounded-lg bg-white text-amber-600 shadow-sm">
              <MapPin size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-orange-900/40 uppercase tracking-widest mb-0.5">Sacred Offering Address</p>
              {isEditingAddress ? (
                <div className="flex flex-col gap-2 mt-1">
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-md px-2 py-2 text-sm outline-none focus:ring-2 ring-amber-500/20 min-h-[80px] resize-none"
                    placeholder="Enter your full address"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSaveAddress} className="flex-1 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-xs font-bold transition-colors">
                      Save Address
                    </button>
                    <button onClick={() => setIsEditingAddress(false)} className="px-4 py-2 bg-orange-100 text-orange-900 rounded-md hover:bg-orange-200 text-xs font-bold transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-orange-950 leading-relaxed text-sm">{address || "No address saved for ritual delivery"}</p>
              )}
            </div>
            {!isEditingAddress && (
              <button 
                onClick={() => setIsEditingAddress(true)}
                className="p-2 text-orange-300 hover:text-amber-600 transition-colors"
                title="Edit Address"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          {/* Last Login */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50/30 border border-orange-100/50 opacity-60">
            <div className="p-2 rounded-lg bg-white text-orange-400 shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-900/40 uppercase tracking-widest mb-0.5">Account Security</p>
              <p className="text-sm font-medium">Last Login: {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-0 border-t border-orange-100">
          <button 
            onClick={handleSignOut}
            className="w-full py-6 flex items-center justify-center gap-2 text-red-600 font-bold bg-white hover:bg-red-50 transition-colors group"
          >
            <LogOut size={20} className="transition-transform group-hover:translate-x-1" />
            Sign Out from Portal
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
