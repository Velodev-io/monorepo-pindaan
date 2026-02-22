import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { SERVICES_DATA } from "@/config/data"

export default function ServicesPage() {

  return (
    <div className="bg-cream min-h-screen pb-24">
      {/* Hero Header - Updated to light theme for maximum visibility */}
      <section className="bg-cream border-b border-orange-100 pt-32 md:pt-44 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <span className="mb-4 text-amber-600 font-bold tracking-widest uppercase text-sm md:text-base inline-block">
            Our Sacred Offerings
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-orange-950 mb-6 drop-shadow-sm">
            Respectful Ritual Services
          </h1>
          <p className="text-lg md:text-xl text-orange-900/70 font-medium leading-relaxed">
            We bridge the distance between you and the sacred rivers of India, ensuring your loved ones are honored with absolute devotion, dignity, and authenticity.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="container mx-auto px-4 md:px-6 -mt-10 relative z-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {SERVICES_DATA.map((service, idx) => (
            <Card key={idx} className="flex flex-col h-full hover:shadow-lg transition-all border-orange-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <service.icon className="h-7 w-7 text-amber-600" />
                  </div>
                  <CardTitle className="text-2xl text-orange-950">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-orange-900 font-medium text-base">
                  {service.shortDesc}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 pb-6">
                <p className="text-orange-900/80 text-sm leading-relaxed mb-6">
                  {service.fullDesc}
                </p>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">What is included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-sm text-orange-900/70">
                        <ShieldCheck className="h-4 w-4 text-amber-500 mr-2 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-6 border-t border-orange-100 bg-orange-50/50 mt-auto rounded-b-xl flex justify-between items-center">
                <Link href={service.href} className="w-full mt-4">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm h-12 text-base group">
                    Assemble Ritual <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Reminder */}
      <section className="mt-24 container mx-auto px-4 text-center max-w-2xl">
        <div className="bg-white p-8 rounded-2xl border border-orange-200 shadow-sm">
          <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-orange-950 mb-3">A Promise of Authenticity</h3>
          <p className="text-orange-900/70 leading-relaxed mb-6">
            We understand the emotional weight of these ceremonies. Every ritual is conducted strictly in accordance with traditional Vedic principles by verified, local Teerth Purohits at the most auspicious Tirthas.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="text-orange-950 border-orange-300 hover:bg-orange-50">
              Speak with our Coordinators
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
