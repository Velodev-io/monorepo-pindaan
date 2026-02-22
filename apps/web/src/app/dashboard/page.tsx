import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { BadgeCheck, PlayCircle, MapPin } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-orange-950 mb-2">Welcome Back, Rahul</h1>
        <p className="text-orange-900/60">Manage your bookings securely and view your ritual proofs here.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-900">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-amber-600">1</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-900">Rituals Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold text-orange-950">2</span>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-orange-950 mb-6 border-b border-orange-200 pb-2">Ongoing Ritual Itinerary</h2>
        
        <Card className="border-l-4 border-l-amber-500 overflow-hidden relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            <BadgeCheck className="w-4 h-4" /> CONFIRMED
          </div>

          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-orange-950">Pind Daan Ritual</h3>
                <div className="flex items-center gap-2 text-sm text-orange-900/60 mt-1">
                  <MapPin className="w-4 h-4" /> Dashashwamedh Ghat, Varanasi
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <span className="block text-orange-900/50 mb-1">Departed Soul:</span>
                  <span className="font-semibold text-orange-950">Late. Surya Kant</span>
                </div>
                <div>
                  <span className="block text-orange-900/50 mb-1">Gotra:</span>
                  <span className="font-semibold text-orange-950">Kashyap</span>
                </div>
                <div>
                  <span className="block text-orange-900/50 mb-1">Scheduled Date:</span>
                  <span className="font-semibold text-orange-950">October 14th, 2026</span>
                </div>
                <div>
                  <span className="block text-orange-900/50 mb-1">Assigned Pandit:</span>
                  <span className="font-semibold text-orange-950">Pt. Ramakant Tiwari</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 flex flex-col items-center justify-center min-w-[200px] border border-orange-100 text-center">
              <PlayCircle className="w-10 h-10 text-orange-300 mb-2" />
              <p className="text-sm text-orange-900 font-medium max-w-[150px]">
                Video proofs will appear here once the ritual is completed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
