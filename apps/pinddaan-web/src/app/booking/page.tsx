"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card, CardFooter } from "@/components/ui/Card"
import { LOCATIONS_DATA } from "@/config/data"
import { COUNTRY_CODES } from "@/config/countries"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import BackButton from "@/components/shared/BackButton"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { Service } from "@pinddaan/types"
import LocationSelector, { SelectionData } from "@/components/booking/LocationSelector"
import { ServiceKey } from "@pinddaan/shared"

// Steps in the checkout sequence
const STEPS = [
  "Select Services",
  "Select Location",
  "Ritual Details",
  "Payment"
]

function BookingForm() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [dynamicServices, setDynamicServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)

  const [selectionData, setSelectionData] = useState<SelectionData | null>(null)
  const [formData, setFormData] = useState({
    services: [] as string[], // These are ServiceKey strings now
    departedName: "",
    fatherName: "",
    gotra: "",
    tithiDate: "",
    cremationDate: "",
    countryCode: "+1",
    contactPhone: "",
    notes: ""
  })

  // Sync user with DB on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        try {
          await apiClient("/users/sync", {
            method: "POST",
            body: JSON.stringify({ name: user.displayName, email: user.email })
          });
        } catch (err) {
          console.error("User sync failed", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch alive services from DB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient("/services")
        if (res.success) {
          setDynamicServices(res.data.filter((s: Service) => s.isActive))
        }
      } catch (err) {
          console.error("Failed to fetch services", err)
      } finally {
          setLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  // Handle URL pre-selection
  useEffect(() => {
    if (loadingServices) return

    const serviceParam = searchParams.get('service')

    setFormData(prev => {
      let newServices = [...prev.services]

      if (serviceParam) {
        const service = dynamicServices.find(s => s.id === serviceParam || s.name.toLowerCase() === serviceParam.toLowerCase() || s.id.toLowerCase() === serviceParam.toLowerCase())
        if (service && !newServices.includes(service.id)) {
          newServices = [service.id]
        }
      }

      return {
        ...prev,
        services: newServices,
      }
    })
  }, [searchParams, loadingServices, dynamicServices])

  // Calculate dynamic Total Price
  const selectedServiceObjects = dynamicServices.filter(s => formData.services.includes(s.id));
  const totalPrice = selectedServiceObjects.reduce((sum, s) => sum + s.basePrice, 0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const toggleService = (id: string) => {
      setFormData(prev => ({
          ...prev,
          services: prev.services.includes(id) 
              ? prev.services.filter(t => t !== id)
              : [...prev.services, id]
      }))
      // Reset location selection when services change
      setSelectionData(null);
  }

  const handleCheckout = async () => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to complete a booking.");
        return;
      }

      if (formData.services.length === 0 || !selectionData || !formData.tithiDate || !formData.departedName || !formData.fatherName || !formData.cremationDate || !formData.contactPhone) {
         alert("Please fill out all required details (Services, Location, Date, Departed Name, Father's Name, Cremation Date, Contact Number).");
         return;
      }

      // Create a booking for each selected service
      for (const serviceId of formData.services) {
          let locationId = "";
          if (selectionData.type === "common") {
            locationId = selectionData.commonLocationId!;
          } else {
            locationId = selectionData.individualSelections![serviceId as ServiceKey];
          }

          const res = await apiClient("/bookings", {
              method: "POST",
              body: JSON.stringify({
                  serviceId,
                  locationId,
                  ritualDate: formData.tithiDate,
                  departedName: formData.departedName,
                  fatherName: formData.fatherName,
                  gotra: formData.gotra,
                  address: formData.notes,
                  cremationDate: formData.cremationDate,
                  contactPhone: `${formData.countryCode}${formData.contactPhone}`
              })
          });
          
          if (!res.success) {
              throw new Error(res.message || "Failed to create one of the bookings");
          }
      }

      setIsSubmitted(true);
      
    } catch (error: unknown) {
      alert("Error creating booking: " + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl min-h-[70vh] flex flex-col items-center justify-center text-center">
        <Card className="w-full relative overflow-hidden bg-white shadow-xl shadow-orange-900/5 border-orange-100 p-8 md:p-12">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-amber-600 rounded-full flex items-center justify-center mb-6 text-3xl">
            🙏
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-orange-950 font-bold mb-4">We are deeply grateful for your trust</h2>
          <p className="text-orange-900/80 mb-6 text-lg leading-relaxed">
            Our thoughts are with you and your family during this sensitive time. We have received the details for the rituals of the departed soul.
          </p>
          <p className="text-orange-900/80 mb-8 text-lg leading-relaxed">
            Our team will respectfully contact you shortly to provide guidance and assist you with the necessary arrangements.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/dashboard"} 
            className="border-orange-200 text-orange-900 bg-orange-50 hover:bg-orange-100"
          >
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 md:pt-40 pb-20 max-w-3xl min-h-[70vh]">
      <div className="mb-8">
        <BackButton className="mb-6 -ml-2" />
        <h1 className="font-serif text-3xl md:text-5xl text-orange-950 font-bold mb-4 text-center">Arrange a Ritual</h1>
        
        {/* Stepper Progress Bar */}
        <div className="flex justify-between items-center relative mt-8">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-orange-200 -z-10" />
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${
                i <= currentStep ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-110" : "bg-white text-orange-300 border-orange-200"
              }`}>
                {i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-black hidden md:block ${
                i <= currentStep ? "text-orange-950" : "text-orange-300"
              }`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-orange-100 shadow-xl shadow-orange-900/5 bg-white overflow-hidden rounded-2xl transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4 md:p-8"
          >
            {/* Step 1: Services Selection */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-orange-950">Select Ritual Offerings</h2>
                  <p className="text-orange-900/60 mt-1">You can select multiple rituals for the same departed soul.</p>
                </div>
                
                {loadingServices ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    <p className="text-orange-900/40 italic text-sm">Validating ritual availability...</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {dynamicServices.map((s) => (
                      <div 
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                          formData.services.includes(s.id) 
                            ? "border-amber-500 bg-amber-50/50" 
                            : "border-orange-100 hover:border-orange-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                            formData.services.includes(s.id) ? "bg-amber-500 border-amber-500" : "border-orange-200 bg-white group-hover:border-orange-300"
                          }`}>
                            {formData.services.includes(s.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div>
                            <p className="font-bold text-orange-950">{s.name}</p>
                            <p className="text-xs text-orange-900/50 uppercase tracking-widest font-bold mt-0.5">{(s as Service).category || "Sacred Ritual"}</p>
                          </div>
                        </div>
                        <div className="text-lg font-black text-orange-950">${s.basePrice.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold font-serif text-orange-950">Where should we perform?</h2>
                  <p className="text-orange-900/60 mt-2">Our system finds the best sacred Tirthas based on your ritual selection.</p>
                </div>
                
                <LocationSelector 
                  selectedServices={formData.services as ServiceKey[]}
                  onSelectionChange={(data) => setSelectionData(data)}
                />
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-orange-950">Departed Soul Details</h2>
                  <p className="text-orange-900/60 mt-1">Please provide accurate information for the Vedic Sankalpa.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Departed Name *</label>
                    <input 
                      type="text"
                      className="w-full p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                      value={formData.departedName}
                      onChange={(e) => setFormData({...formData, departedName: e.target.value})}
                      placeholder="Name of the soul"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Father / Husband Name *</label>
                    <input 
                      type="text"
                      className="w-full p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                      value={formData.fatherName}
                      onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Family Gotra (optional)</label>
                    <input 
                      type="text"
                      className="w-full p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                      value={formData.gotra}
                      onChange={(e) => setFormData({...formData, gotra: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Mandatory Ritual Date *</label>
                    <input 
                      type="date"
                      className="w-full p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                      value={formData.tithiDate}
                      onChange={(e) => setFormData({...formData, tithiDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Cremation Date *</label>
                    <input 
                      type="date"
                      className="w-full p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                      value={formData.cremationDate}
                      onChange={(e) => setFormData({...formData, cremationDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-orange-400">Contact Number (WhatsApp) *</label>
                    <div className="flex gap-2">
                       <select 
                        className="w-24 p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950 text-sm"
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                       >
                         {COUNTRY_CODES.map(c => <option key={`${c.code}-${c.name}`} value={c.code}>{c.code} ({c.name})</option>)}
                       </select>
                       <input 
                        type="tel"
                        className="flex-1 p-4 rounded-xl border border-orange-100 bg-orange-50/30 outline-amber-500 font-bold text-orange-950"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Payment (Mock) */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-orange-950">Final Assembly</h2>
                  <p className="text-orange-900/60 mt-1">Review your selections before we begin the sacred arrangements.</p>
                </div>

                <div className="p-8 rounded-3xl bg-orange-50/30 border border-orange-100 space-y-6">
                    <div className="flex justify-between items-end border-b border-orange-100 pb-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-orange-400">Ritual Selections</span>
                        <span className="text-xs font-bold text-orange-950">{formData.services.length} items</span>
                    </div>
                    <div className="space-y-4">
                        {selectedServiceObjects.map((s, idx) => (
                           <div key={idx} className="flex justify-between items-center">
                              <span className="font-bold text-orange-900">{s.name}</span>
                              <span className="font-black text-orange-950">${s.basePrice}</span>
                           </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-orange-100 flex justify-between items-center text-xl font-bold">
                        <span className="text-orange-950 font-serif">Total Commitment</span>
                        <span className="text-amber-600">${totalPrice}</span>
                    </div>
                </div>
                
                <p className="text-center text-xs text-orange-900/40 px-10 leading-relaxed italic">
                  By continuing, you agree to allow our certified Pandits to perform the rituals in your absence as per Vedic norms. Proof of ritual will be uploaded to your dashboard.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <CardFooter className="flex flex-row items-center justify-between border-t border-orange-100 bg-orange-50/50 p-6 rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0 || submitting}
            className="border-orange-200 text-orange-900"
          >
            Back
          </Button>
          <Button 
            onClick={currentStep === STEPS.length - 1 ? handleCheckout : nextStep}
            disabled={
                submitting ||
                (currentStep === 0 && formData.services.length === 0) ||
                (currentStep === 1 && !selectionData)
            }
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 font-bold rounded-xl shadow-lg shadow-amber-500/10 min-w-[120px]"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (currentStep === STEPS.length - 1 ? "Complete Payment" : "Continue")}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-xs text-orange-900/30 font-bold uppercase tracking-widest">Secured by Vedic Standards</p>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <div className="bg-cream min-h-screen">
      <Suspense fallback={<div className="container mx-auto px-4 pt-32 text-center text-orange-950/20 italic">Loading ritual guide...</div>}>
         <BookingForm />
      </Suspense>
    </div>
  )
}
