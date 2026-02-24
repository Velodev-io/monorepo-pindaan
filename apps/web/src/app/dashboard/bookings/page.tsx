"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { Card, CardContent } from "@/components/ui/Card"
import Link from "next/link"
import { Booking } from "@pinddaan/types"
import { apiClient } from "@/lib/api-client"
import { 
  BadgeCheck, 
  PlayCircle, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  X,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import BackButton from "@/components/shared/BackButton"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<Booking[] | null>(null)
  const [filter, setFilter] = useState("ALL") // ALL, PENDING, COMPLETED, CANCELLED

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const json = await apiClient("/bookings")
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

  // Grouping Logic (Identical to dashboard for consistency)
  const groupedBookings = bookings.reduce((groups: Record<string, Booking[]>, booking) => {
    const key = `${booking.departedName}-${booking.ritualDate}-${booking.locationId}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(booking);
    return groups;
  }, {});

  let groupList = Object.values(groupedBookings);

  // Apply Filter
  if (filter !== "ALL") {
    groupList = groupList.filter((group) => {
        if (filter === "COMPLETED") return group.every((b) => b.status === "COMPLETED");
        if (filter === "PENDING") return group.some((b) => b.status !== "COMPLETED" && b.status !== "CANCELLED");
        return group.some((b) => b.status === filter);
    });
  }

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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">My Ritual Bookings</h1>
          <p className="text-orange-900/60 font-medium">View and manage your spiritual commitments across sacred Tirthas.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-900/40" />
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-10 pr-8 py-2.5 bg-white border border-orange-100 rounded-xl text-sm font-bold text-orange-950 outline-none ring-2 ring-amber-500/0 focus:ring-amber-500/10 transition-all appearance-none cursor-pointer"
                >
                    <option value="ALL">All Rituals</option>
                    <option value="PENDING">Active Only</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-900/40 pointer-events-none" />
            </div>
            
            <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-900/40" />
                <input 
                    type="text" 
                    placeholder="Search ancestors..."
                    className="pl-10 pr-4 py-2.5 bg-white border border-orange-100 rounded-xl text-sm font-medium text-orange-950 outline-none ring-2 ring-amber-500/0 focus:ring-amber-500/10 transition-all w-64"
                />
            </div>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-orange-900/30 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
            <p className="font-serif italic animate-pulse">Syncing with sacred records...</p>
          </div>
        ) : groupList.length === 0 ? (
          <Card className="p-20 text-center border-dashed border-orange-200 bg-orange-50/20">
            <div className="max-w-xs mx-auto space-y-4">
                <CalendarIcon className="w-12 h-12 text-orange-200 mx-auto" />
                <h3 className="text-xl font-bold text-orange-950">No rituals found</h3>
                <p className="text-orange-900/60 text-sm">You haven&apos;t booked any rituals matching this filter yet.</p>
                <Link href="/booking">
                    <Button className="mt-4 bg-amber-600">Start New Booking</Button>
                </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupList.map((group, idx) => {
              const mainBooking = group[0];
              const isMulti = group.length > 1;

              return (
                <Card 
                    key={idx} 
                    onClick={() => setSelectedGroup(group)}
                    className="border border-orange-100 overflow-hidden relative transition-all hover:shadow-xl hover:border-amber-200 cursor-pointer bg-white group"
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${isMulti ? 'bg-orange-950' : 'bg-amber-500'}`} />
                  
                  <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isMulti ? 'bg-orange-900 text-white' : getStatusColor(mainBooking.status)}`}>
                    {isMulti ? `${group.length} SHASTRIC RITES` : mainBooking.status}
                  </div>

                  <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-center">
                    <div className="space-y-6 w-full">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                          <CalendarIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-orange-950">
                              {isMulti ? `Sacred Package: ${mainBooking.departedName}` : mainBooking.service?.name}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-orange-900/60 font-bold uppercase tracking-widest">
                                <MapPin className="w-3.5 h-3.5 text-amber-600" /> {mainBooking.location?.name}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-orange-900/60 font-bold uppercase tracking-widest border-l border-orange-200 pl-4">
                                <Clock className="w-3.5 h-3.5 text-amber-600" /> {new Date(mainBooking.ritualDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-orange-900/40 mb-1 font-black">Ancestor:</span>
                          <span className="font-bold text-orange-950 text-sm">{mainBooking.departedName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-orange-900/40 mb-1 font-black">Gotra:</span>
                          <span className="font-bold text-orange-950 text-sm">{mainBooking.gotra || "N/A"}</span>
                        </div>
                        <div className="col-span-2">
                             <span className="block text-[10px] uppercase tracking-widest text-orange-900/40 mb-1 font-black">Involved Rites:</span>
                             <div className="flex flex-wrap gap-2">
                                {group.map((b, bIdx) => (
                                    <span key={bIdx} className="text-[10px] font-bold text-orange-900">
                                        • {b.service?.name}
                                    </span>
                                ))}
                             </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center bg-orange-50 px-6 py-3 rounded-xl text-amber-700 font-black text-xs uppercase tracking-widest group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                        Details <ChevronRight className="ml-2 w-4 h-4" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-orange-950/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <button 
                    onClick={() => setSelectedGroup(null)}
                    className="absolute top-8 right-8 p-3 rounded-full bg-orange-50 text-orange-950 hover:bg-amber-500 hover:text-white transition-all shadow-sm z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="bg-gradient-to-br from-orange-50 to-white p-10 border-b border-orange-100 relative">
                    <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-4">
                        <MapPin size={240} className="-mr-20 -mt-20" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-orange-950 mb-3">Ritual Deep-Dive</h2>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                            <MapPin className="w-3 h-3" /> {selectedGroup[0].location?.name}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-900/60">
                            <CalendarIcon className="w-3 h-3" /> {new Date(selectedGroup[0].ritualDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </span>
                    </div>
                </div>

                <div className="p-10 space-y-6 max-h-[50vh] overflow-y-auto">
                    {selectedGroup.map((ritual, rIdx) => (
                        <div key={rIdx} className="border border-orange-50 rounded-3xl p-6 bg-orange-50/30 hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-orange-950/5 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="text-xl font-bold text-orange-950 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{ritual.service?.name}</h4>
                                    <p className="text-[10px] text-orange-900/40 mt-1.5 uppercase tracking-widest font-black">Tracking ID: {ritual.id.toUpperCase()}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(ritual.status)}`}>
                                    {getStatusIcon(ritual.status)} {ritual.status}
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl p-6 border border-orange-100/50">
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-orange-900/30 mb-1">Departed</p>
                                            <p className="font-bold text-orange-950 text-sm">{ritual.departedName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest font-black text-orange-900/30 mb-1">Gotra</p>
                                            <p className="font-bold text-orange-950 text-sm">{ritual.gotra || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center min-w-[140px] border-l border-orange-100 pl-8 ml-2">
                                    {ritual.status === 'COMPLETED' ? (
                                        <div className="flex flex-col items-center group cursor-pointer">
                                            <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                                                <PlayCircle className="w-8 h-8" />
                                            </div>
                                            <p className="text-[10px] text-orange-950 font-black uppercase tracking-widest">Witness Proof</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center opacity-40">
                                            <div className="h-14 w-14 rounded-2xl bg-orange-200 text-white flex items-center justify-center mb-3">
                                                <Clock className="w-8 h-8" />
                                            </div>
                                            <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest text-center">In Pipeline</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-10 bg-white border-t border-orange-50 flex items-center justify-center">
                    <button 
                        onClick={() => setSelectedGroup(null)}
                        className="w-full h-16 bg-orange-950 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-950/20 hover:bg-orange-900 hover:-translate-y-1 transition-all"
                    >
                        Back to List
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
