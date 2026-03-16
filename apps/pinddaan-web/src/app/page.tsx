import dynamic from 'next/dynamic'
import HeroSection from "@/components/shared/HeroSection"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SERVICES_DATA } from "@/config/data"

// Dynamic imports for below-the-fold content
const TrustSection = dynamic(() => import("@/components/shared/TrustSection"))
const Button = dynamic(() => import("@/components/ui/Button").then(mod => mod.Button))
const CardContent = dynamic(() => import("@/components/ui/Card").then(mod => mod.CardContent))
const CardFooter = dynamic(() => import("@/components/ui/Card").then(mod => mod.CardFooter))
const CardHeader = dynamic(() => import("@/components/ui/Card").then(mod => mod.CardHeader))
const CardTitle = dynamic(() => import("@/components/ui/Card").then(mod => mod.CardTitle))
const CardDescription = dynamic(() => import("@/components/ui/Card").then(mod => mod.CardDescription))
const Card = dynamic(() => import("@/components/ui/Card").then(mod => mod.Card))

export default function Home() {

  return (
    <>
      <HeroSection />
      <TrustSection />

      {/* Services Grid */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-orange-950 mb-4">Our Sacred Services</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-6" />
            <p className="max-w-2xl mx-auto text-orange-900/90 text-lg">
              We coordinate authentic Shastric rites at Dashashwamedh Ghat, Har Ki Pauri, and Triveni Sangam.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_DATA.map((service, idx) => (
              <Card key={idx} className="group hover:-translate-y-1 transition-transform duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                    <service.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="min-h-[80px]">
                    {service.shortDesc}
                  </CardDescription>
                </CardContent>
                <CardFooter className="justify-start border-t border-orange-100 mt-4 rounded-b-xl items-end">
                  <Link href={service.href} className="w-full">
                    <Button variant="ghost" className="w-full justify-between items-center group-hover:text-amber-700">
                      Learn More <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / 3 Step Process Container */}
      <section className="py-24 bg-white border-y border-orange-100">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-orange-950 mb-4">A Guided Journey</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-16" />
          
          <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[2px] bg-orange-100 -z-10" />
            
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-orange-50 border-4 border-white shadow-md flex items-center justify-center text-2xl font-serif text-amber-600 mb-6">1</div>
              <h3 className="text-xl font-bold text-orange-950 mb-2">Select Ritual</h3>
              <p className="text-orange-900/80">Choose the required service and select the sacred location (Kashi, Haridwar).</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-orange-50 border-4 border-white shadow-md flex items-center justify-center text-2xl font-serif text-amber-600 mb-6">2</div>
              <h3 className="text-xl font-bold text-orange-950 mb-2">Provide Details</h3>
              <p className="text-orange-900/80">Share Gotra, departed soul name, and preferred Tithi dates securely.</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-orange-50 border-4 border-white shadow-md flex items-center justify-center text-2xl font-serif text-amber-600 mb-6">3</div>
              <h3 className="text-xl font-bold text-orange-950 mb-2">Witness remotely</h3>
              <p className="text-orange-900/80">Receive Live Zoom links or a full edited 4K video of the Sankalp and vidhi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-amber-50">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-orange-950 mb-6">Perform the Last Rites with Dignity and Peace</h2>
          <p className="text-lg text-orange-900/80 mb-10">
            Let us handle the logistics so you can focus on the prayers. Our verified pandits await to assist your family.
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold transform hover:scale-105 transition-all w-full sm:w-auto h-14 text-lg">
              Start Booking Flow
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
