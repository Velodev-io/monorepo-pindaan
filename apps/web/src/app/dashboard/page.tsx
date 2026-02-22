"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { BadgeCheck, PlayCircle, MapPin, Clock, CheckCircle2, XCircle, ChevronRight, X } from "lucide-react"

export default function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<any[] | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserName(user.displayName || "User")
        try {
          const token = await user.getIdToken()
          const res = await fetch("http://localhost:3001/api/v1/bookings", {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          const json = await res.json()
          if (json.success) {
            setBookings(json.data)
          }
        } catch (err) {
          console.error("Failed to fetch bookings", err)
        } finally {
          setLoading(false)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const activeCount = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length

  // Grouping Logic
  const groupedBookings = bookings.reduce((groups: any, booking) => {
    const key = `${booking.departedName}-${booking.ritualDate}-${booking.locationId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(booking);
    return groups;
  }, {});

  const groupList = Object.values(groupedBookings);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <BadgeCheck className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      default: return 'bg-amber-100 text-amber-800'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">
          {loading ? "Syncing..." : `Welcome Back, ${userName}`}
        </h1>
        <p className="text-orange-900/60">Manage your bookings securely and view your ritual proofs here.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-900">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-amber-600">{loading ? "..." : activeCount}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-900">Rituals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-orange-950">{loading ? "..." : completedCount}</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-orange-950 mb-6 border-b border-orange-200 pb-2">Ongoing Ritual Itinerary</h2>
        
        {loading ? (
          <div className="py-12 text-center text-orange-900/40 animate-pulse">Retrieving your sacred records...</div>
        ) : groupList.length === 0 ? (
          <Card className="p-12 text-center text-orange-900/60 border-dashed">
            No active rituals found. Start by arranging a new ritual.
          </Card>
        ) : (
          <div className="space-y-6">
            {groupList.map((group: any, idx) => {
              const mainBooking = group[0];
              const isMulti = group.length > 1;
              const allCompleted = group.every((b: any) => b.status === 'COMPLETED');

              return (
                <Card 
                    key={idx} 
                    onClick={() => setSelectedGroup(group)}
                    className="border-l-4 border-l-amber-500 overflow-hidden relative transition-all hover:shadow-lg cursor-pointer group"
                >
                  <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isMulti ? 'bg-orange-900 text-white' : getStatusColor(mainBooking.status)}`}>
                    {isMulti ? `${group.length} Rituals Grouped` : mainBooking.status}
                  </div>

                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-center">
                    <div className="space-y-4 w-full">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-orange-950">
                            {isMulti ? `Ritual Package for ${mainBooking.departedName}` : mainBooking.service?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-orange-900/60 mt-1 uppercase tracking-wider font-semibold">
                          <MapPin className="w-4 h-4 text-amber-600" /> {mainBooking.location?.name}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                          <span className="block text-orange-900/50 mb-1 font-medium">Departed Soul:</span>
                          <span className="font-bold text-orange-950">{mainBooking.departedName}</span>
                        </div>
                        <div>
                          <span className="block text-orange-900/50 mb-1 font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Scheduled Date:</span>
                          <span className="font-bold text-orange-950">{new Date(mainBooking.ritualDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </div>
                        <div className="col-span-2 mt-2">
                            <span className="block text-orange-900/50 mb-2 font-medium">Services included:</span>
                            <div className="flex flex-wrap gap-2">
                                {group.map((b: any, bIdx: number) => (
                                    <span key={bIdx} className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100 text-orange-900 text-xs font-semibold">
                                        {b.service?.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-600 font-bold group-hover:translate-x-1 transition-transform">
                        View Details <ChevronRight className="ml-1 w-5 h-5" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedGroup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-orange-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button 
                    onClick={() => setSelectedGroup(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-orange-50 text-orange-950 hover:bg-orange-100 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="bg-orange-50 p-8 border-b border-orange-100">
                    <h2 className="font-serif text-3xl font-bold text-orange-950 mb-2">Sacred Package Details</h2>
                    <p className="text-orange-900/60 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {selectedGroup[0].location?.name} • {new Date(selectedGroup[0].ritualDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                    {selectedGroup.map((ritual, rIdx) => (
                        <div key={rIdx} className="border border-orange-100 rounded-2xl p-6 hover:border-amber-500 transition-colors bg-white">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-xl font-bold text-orange-950">{ritual.service?.name}</h4>
                                    <p className="text-xs text-orange-900/50 mt-1 uppercase tracking-widest font-bold">Booking ID: {ritual.id.slice(0, 8)}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(ritual.status)}`}>
                                    {getStatusIcon(ritual.status)} {ritual.status}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 space-y-2 text-sm">
                                    <p><span className="text-orange-900/40">Departed:</span> <span className="font-bold ml-2">{ritual.departedName}</span></p>
                                    <p><span className="text-orange-900/40">Father:</span> <span className="font-bold ml-2">{ritual.fatherName || "N/A"}</span></p>
                                    <p><span className="text-orange-900/40">Gotra:</span> <span className="font-bold ml-2">{ritual.gotra || "N/A"}</span></p>
                                </div>

                                <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[160px] border border-orange-100">
                                    {ritual.status === 'COMPLETED' ? (
                                        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform">
                                            <PlayCircle className="w-8 h-8 text-amber-600 mb-2" />
                                            <p className="text-xs text-orange-950 font-bold">Watch Proof</p>
                                        </div>
                                    ) : (
                                        <>
                                            <PlayCircle className="w-8 h-8 text-orange-200 mb-2" />
                                            <p className="text-[10px] text-orange-900/40 text-center leading-tight">Proof video<br/>coming soon</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 bg-orange-50 border-t border-orange-100 text-center">
                    <button 
                        onClick={() => setSelectedGroup(null)}
                        className="w-full h-12 bg-orange-950 text-white rounded-xl font-bold hover:bg-orange-900 transition-colors"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
