"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Loader2, Sunrise } from "lucide-react";
import { SERVICES_DATA } from "@/config/data";
import BackButton from "@/components/shared/BackButton";
import { apiClient } from "@/lib/api-client";
import { Service } from "@pinddaan/types";

export default function ServicesPage() {
  const [dynamicServices, setDynamicServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiClient("/services");
        if (res.success) {
          // Filter to only show active services
          setDynamicServices(res.data.filter((s: Service) => s.isActive));
        }
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Helper to get static assets for dynamic services
  const getServiceMetadata = (name: string) => {
    const matched = SERVICES_DATA.find(s => 
      s.title.toLowerCase().includes(name.toLowerCase()) || 
      name.toLowerCase().includes(s.title.toLowerCase())
    );
    
    return matched || {
      icon: Sparkles,
      shortDesc: "Traditional Vedic ritual performed by verified Pandits.",
      fullDesc: "A sacred ceremony conducted with absolute devotion at the banks of the holy Ganges. Every step follows ancient scriptures to ensure peace and salvation.",
      features: ["Traditional Vedic Mantras", "Verified Teerth Purohits", "Documented Proof provided", "Respectful execution"]
    };
  };

  return (
    <div className="bg-cream min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-cream border-b border-orange-100 pt-32 md:pt-40 pb-20 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto relative z-10 max-w-6xl mb-8">
            <BackButton />
        </div>
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="font-serif text-orange-900/60 italic">Preparing the sacred register...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {dynamicServices.map((service) => {
              const meta = getServiceMetadata(service.name);
              const Icon = meta.icon;
              
              return (
                <Card key={service.id} className="flex flex-col h-full hover:shadow-lg transition-all border-orange-200 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-14 w-14 rounded-[1rem] bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200">
                        <Icon className="h-7 w-7 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-orange-950">{service.name}</CardTitle>
                        <div className="text-amber-600 font-bold text-sm mt-1 underline decoration-amber-500/20 underline-offset-4 tracking-tight">
                          Offering: ${service.basePrice.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-orange-900 font-medium text-base">
                      {meta.shortDesc}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pb-6">
                    <p className="text-orange-900/80 text-sm leading-relaxed mb-6">
                      {meta.fullDesc}
                    </p>
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-orange-950 uppercase tracking-widest border-b border-orange-100 pb-1">Ritual Inclusions:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        {meta.features.map((feature: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-start text-xs text-orange-900/70">
                            <ShieldCheck className="h-3.5 w-3.5 text-amber-500 mr-2 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-6 border-t border-orange-100 bg-orange-50/50 mt-auto rounded-b-xl flex justify-between items-center">
                    <Link href={`/booking?service=${service.id}`} className="w-full mt-4">
                      <Button className="w-full bg-orange-950 hover:bg-orange-900 text-white shadow-sm h-12 text-base group rounded-xl">
                        Assemble Ritual <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Trust Reminder */}
      <section className="mt-24 container mx-auto px-4 text-center max-w-2xl">
        <div className="bg-white p-12 rounded-[2.5rem] border border-orange-200 shadow-xl shadow-orange-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sunrise className="w-40 h-40 rotate-12" />
          </div>
          <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h3 className="font-serif text-3xl font-bold text-orange-950 mb-4">A Promise of Authenticity</h3>
          <p className="text-orange-900/70 text-lg leading-relaxed mb-8">
            We understand the emotional weight of these ceremonies. Every ritual is conducted strictly in accordance with traditional Vedic principles by verified, local Teerth Purohits.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="text-orange-950 border-orange-300 hover:bg-orange-50 h-14 px-8 rounded-xl font-bold">
              Speak with our Coordinators
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
