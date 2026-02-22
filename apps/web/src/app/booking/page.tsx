"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card, CardTitle, CardFooter, CardDescription } from "@/components/ui/Card"
import { SERVICES_DATA, LOCATIONS_DATA } from "@/config/data"
import { auth } from "@/lib/firebase"

// Steps in the checkout sequence
const STEPS = [
  "Select Services",
  "Select Location",
  "Ritual Details",
  "Payment"
]

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(0)

  const [formData, setFormData] = useState({
    services: [] as string[],
    location: "",
    departedName: "",
    fatherName: "",
    gotra: "",
    tithiDate: "",
    cremationDate: "",
    notes: ""
  })

  // Calculate dynamic Total Price
  const selectedServiceObjects = SERVICES_DATA.filter(s => formData.services.includes(s.title));
  const totalPrice = selectedServiceObjects.reduce((sum, s) => sum + s.priceUSD, 0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const toggleService = (title: string) => {
      setFormData(prev => ({
          ...prev,
          services: prev.services.includes(title) 
              ? prev.services.filter(t => t !== title)
              : [...prev.services, title]
      }))
  }

  const handleCheckout = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("You must be logged in to complete a booking.");
        return;
      }

      if (formData.services.length === 0 || !formData.location || !formData.tithiDate || !formData.departedName) {
         alert("Please fill out all required details (At least 1 Service, Location, Date, Departed Name).");
         return;
      }

      const locationObj = LOCATIONS_DATA.find(l => l.name === formData.location);

      if (!locationObj) {
         alert("Invalid location selection.");
         return;
      }

      // Automatically refresh the token to ensure it isn't expired
      const token = await currentUser.getIdToken(true);

      // Submit each selected service as a separate booking row (or adapt backend to arrays later)
      for (const serviceTitle of formData.services) {
          const serviceObj = SERVICES_DATA.find(s => s.title === serviceTitle);
          if (serviceObj) {
              await fetch("http://localhost:3001/api/v1/bookings", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                  serviceId: serviceObj.id,
                  locationId: locationObj.id,
                  ritualDate: new Date(formData.tithiDate).toISOString(),
                  departedName: formData.departedName,
                  fatherName: formData.fatherName || undefined,
                  cremationDate: formData.cremationDate ? new Date(formData.cremationDate).toISOString() : undefined,
                  gotra: formData.gotra,
                  address: formData.notes
                })
              });
          }
      }

      alert("Success! Your comprehensive ritual booking has been secured.");
      window.location.href = "/dashboard";
      
    } catch (error: any) {
      alert("Error creating booking: " + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-3xl min-h-[70vh]">
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-5xl text-orange-950 font-bold mb-4 text-center">Arrange a Ritual</h1>
        
        {/* Stepper Progress Bar */}
        <div className="flex justify-between items-center relative mt-8">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-orange-200 -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-500 -z-10" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} 
          />
          
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors ${
                idx <= currentStep ? "bg-amber-500 border-amber-500 text-white" : "bg-white border-orange-200 text-orange-400"
              }`}>
                {idx + 1}
              </div>
              <span className={`text-xs md:text-sm font-medium ${idx <= currentStep ? "text-orange-950" : "text-orange-900/40"}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full relative overflow-hidden bg-white shadow-xl shadow-orange-900/5 border-orange-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* STEP 1: SERVICE */}
            {currentStep === 0 && (
              <div className="p-6 md:p-8">
                <CardTitle className="mb-2">Select Rituals</CardTitle>
                <CardDescription className="mb-6">You may select multiple services to be performed concurrently.</CardDescription>
                <div className="grid md:grid-cols-2 gap-4 border-b border-orange-100 pb-6 mb-6">
                  {SERVICES_DATA.map((srv) => {
                    const isSelected = formData.services.includes(srv.title);
                    return (
                    <button
                      key={srv.id}
                      onClick={() => toggleService(srv.title)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                        ? "border-amber-500 bg-amber-50 shadow-md shadow-amber-500/10" 
                        : "border-orange-100 hover:border-amber-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${isSelected ? "bg-amber-500 text-white" : "bg-orange-50 text-amber-600"}`}>
                             <srv.icon className="h-5 w-5" />
                           </div>
                           <h4 className="font-semibold text-orange-950">{srv.title}</h4>
                         </div>
                         <div className="font-bold text-amber-600">${srv.priceUSD}</div>
                      </div>
                    </button>
                  )})}
                </div>
                <div className="flex justify-between items-center px-4">
                    <span className="font-medium text-orange-900">Subtotal:</span>
                    <span className="font-bold text-2xl text-orange-950">${totalPrice}</span>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8">
                <CardTitle className="mb-6">Select Holy Location</CardTitle>
                <div className="grid md:grid-cols-2 gap-4">
                  {LOCATIONS_DATA.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setFormData({ ...formData, location: loc.name })}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        formData.location === loc.name 
                        ? "border-amber-500 bg-amber-50" 
                        : "border-orange-100 hover:border-amber-300"
                      }`}
                    >
                      <h4 className="font-semibold text-orange-950">{loc.name}</h4>
                      <p className="text-sm text-orange-900/60">{loc.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8 space-y-4">
                <CardTitle className="mb-6">Provide Details for the Priests</CardTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">Name of the Departed Soul</label>
                      <input 
                        type="text" 
                        className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                        placeholder="e.g. Ramesh Sharma"
                        value={formData.departedName}
                        onChange={(e) => setFormData({...formData, departedName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">Father's Name (if known)</label>
                      <input 
                        type="text" 
                        className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500 transition-all"
                        placeholder="e.g. Suresh Sharma"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">Gotra (if known)</label>
                      <input 
                        type="text" 
                        className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500"
                        placeholder="e.g. Kashyap"
                        value={formData.gotra}
                        onChange={(e) => setFormData({...formData, gotra: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-orange-900 mb-1">Preferred Ritual Date</label>
                      <input 
                        type="date" 
                        className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500"
                        value={formData.tithiDate}
                        onChange={(e) => setFormData({...formData, tithiDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-900 mb-1">Cremation Date (if applicable)</label>
                    <input 
                      type="date" 
                      className="w-full h-11 px-3 rounded-md border border-orange-200 outline-none focus:border-amber-500"
                      value={formData.cremationDate}
                      onChange={(e) => setFormData({...formData, cremationDate: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: PAYMENT MOCKUP */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8">
                <CardTitle className="mb-2">Secure Checkout</CardTitle>
                <CardDescription className="mb-6">Review your securely generated quote</CardDescription>
                
                <div className="bg-orange-50 rounded-xl p-6 mb-6">
                  <div className="mb-4">
                    <span className="text-orange-900 text-sm font-medium block border-b border-orange-200 pb-2 mb-3">Selected Rituals:</span>
                    {selectedServiceObjects.map(s => (
                        <div key={s.id} className="flex justify-between items-center mb-2">
                           <span className="font-semibold text-orange-950 flex items-center gap-2"><s.icon className="h-4 w-4"/> {s.title}</span>
                           <span className="text-orange-900 border border-orange-200 px-2 py-0.5 rounded-md text-sm">${s.priceUSD}</span>
                        </div>
                    ))}
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-orange-900">Holy Location:</span>
                    <span className="font-semibold text-orange-950">{formData.location || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-orange-900">Departed Name:</span>
                    <span className="font-semibold text-orange-950">{formData.departedName || "Not provided"}</span>
                  </div>
                  {formData.fatherName && (
                      <div className="flex justify-between mb-2">
                        <span className="text-orange-900">Father's Name:</span>
                        <span className="font-semibold text-orange-950">{formData.fatherName}</span>
                      </div>
                  )}
                  {formData.cremationDate && (
                      <div className="flex justify-between mb-2 border-b border-orange-200 pb-4">
                        <span className="text-orange-900">Cremation Date:</span>
                        <span className="font-semibold text-orange-950">{formData.cremationDate}</span>
                      </div>
                  )}
                  <div className="flex justify-between mt-4">
                    <span className="font-bold text-orange-950 text-xl">Total Pricing:</span>
                    <span className="font-bold text-2xl text-amber-600">${totalPrice}</span>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 text-green-800 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
                  <div className="min-w-6">🔒</div>
                  <div>Your payment is secured by Stripe. A verified Pandit will be securely assigned immediately upon success.</div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <CardFooter className="flex justify-between border-t border-orange-100 bg-orange-50/50 p-6 rounded-b-xl">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="w-24 border-orange-200 bg-white"
          >
            Back
          </Button>
          
          <Button 
            variant="default"
            onClick={currentStep === STEPS.length - 1 ? handleCheckout : nextStep}
            disabled={currentStep === 0 && formData.services.length === 0}
            className="w-32 bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
          >
            {currentStep === STEPS.length - 1 ? `Pay $${totalPrice}` : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
