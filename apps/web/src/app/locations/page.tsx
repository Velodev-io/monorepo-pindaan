"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Waves, Sunrise, Sparkles, Anchor } from "lucide-react"
import BackButton from "@/components/shared/BackButton"
import { Button } from "@/components/ui/Button"

const LOCATIONS = [
  {
    id: "varanasi",
    name: "Kashi (Varanasi)",
    title: "The Eternal City of Light",
    description: "Kashi is the spiritual heart of India. Performing rituals on the Dashashwamedh and Manikarnika Ghats is believed to liberate the soul from the cycle of birth and death.",
    longDescription: "Varanasi, or Kashi, is one of the oldest continually inhabited cities in the world. Its ghats are a unique confluence of physical and metaphysical worlds, where the morning sun illuminates the prayers of millions.",
    image: "/images/kashi_ghats_1771776018344.png",
    accent: "orange"
  },
  {
    id: "gaya",
    name: "Gaya",
    title: "The Land of Salvation",
    description: "Crucial for Pitru Dosha Nivaran. The Phalgu River and Vishnupad Temple hold the footprints of Lord Vishnu, ensuring peace for the departed.",
    longDescription: "Gaya is uniquely designated for Pind Daan. It is said that Lord Ram himself performed the first ritual here for his father, Dasharatha. The spiritual vibrations of Gaya are unmatched for ancestral liberation.",
    image: "/images/gaya_vishnupad_temple_1771776066448.png",
    accent: "amber"
  },
  {
    id: "haridwar",
    name: "Haridwar",
    title: "The Gateway to Gods",
    description: "Where the holy Ganges leaves the mountains and enters the plains. Har Ki Pauri remains the most sacred spot for deep spiritual connection.",
    longDescription: "Haridwar is the doorway to the Himalayas and the source of the Ganges' earthly journey through the plains. The Brahmakund at Har Ki Pauri is a portal of immense cosmic energy.",
    image: "/images/haridwar_landing_1771776044242.png",
    accent: "orange"
  },
  {
    id: "prayagraj",
    name: "Prayagraj",
    title: "King of All Pilgrimage Sites",
    description: "The holy Triveni Sangam – the confluence of Ganga, Yamuna, and the mythical Saraswati. A dip here during the Kumbh is the ultimate purification.",
    longDescription: "Prayagraj is the 'Teerthraj', the king of all holy places. The Triveni Sangam serves as the most powerful point for ancestor rites, where the earthly and divine waters meet to carry offerings to the ancestors.",
    image: "/images/triveni_sangam_hero_1771775992808.png",
    accent: "amber"
  },
  {
    id: "kurukshetra",
    name: "Kurukshetra",
    title: "The Field of Righteousness",
    description: "The site of the ancient Mahabharata battle and where the Bhagavad Gita was spoken. The Brahma Sarovar is a supreme site for Pind Daan.",
    longDescription: "Kurukshetra is is of immense spiritual significance. The Brahma Sarovar is believed to have been created by Lord Brahma himself, making it a highly auspicious location for performing rites for ancestors.",
    image: "/images/kurukshetra.png",
    accent: "orange"
  },
  {
    id: "nashik",
    name: "Nashik",
    title: "The Holy Panchavati",
    description: "Bathing in the holy Ram Kund and performing rituals on the Godavari banks offers immense peace. It is where Lord Ram stayed during exile.",
    longDescription: "Nashik, particularly the Panchavati area, is deeply connected to the Ramayana. The Ram Kund is where thousands gather for Asthi Visarjan and ancestor worship in the holy Godavari waters.",
    image: "/images/nashik.png",
    accent: "amber"
  },
  {
    id: "pushkar",
    name: "Pushkar",
    title: "The Abode of Lord Brahma",
    description: "One of the five sacred 'Sarovars'. Pushkar is the only place in the world with a temple dedicated to Lord Brahma, ideal for Pitru Tarpan.",
    longDescription: "Pushkar is a mystical town where the desert meets the divine. A ritual at the 52 ghats of Pushkar Lake is considered equivalent to a full pilgrimage, especially for releasing the souls of ancestors.",
    image: "/images/pushkar.png",
    accent: "orange"
  },
  {
    id: "somnath",
    name: "Somnath",
    title: "The Eternal Shore of Shiva",
    description: "Where the Triveni Sangam meets the Arabian Sea. Somnath offers a unique spiritual experience for releasing the soul into the eternal.",
    longDescription: "The Somnath Temple stands as a symbol of eternal resurrection. The Triveni Sangam here – the meeting of three rivers and the sea – is a powerful portal for performing last rites and immersion.",
    image: "/images/somnath.png",
    accent: "amber"
  },
  {
    id: "siddhpur",
    name: "Siddhpur",
    title: "The Matru Gaya of India",
    description: "Bindu Sarovar in Siddhpur is the only place in the world specifically for rituals honoring one's mother (Matru Gaya).",
    longDescription: "Siddhpur is the counterpart to Gaya, specifically meant for Matru-Shraddh. Legend says Lord Parshuram performed the ritual for his mother here at the Bindu Sarovar, sanctifying it for all mothers.",
    image: "/images/siddhpur.png",
    accent: "orange"
  }
]

export default function LocationsPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Hero Section with Triveni Sangam Background */}
      <section className="relative h-[80vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/triveni_sangam_hero_1771775992808.png"
          alt="Triveni Sangam Aerial View"
          fill
          className="object-cover scale-110 md:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/60 via-orange-950/40 to-cream" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8 flex justify-start">
            <BackButton variant="ghost" className="text-white hover:text-amber-400 hover:bg-white/10" />
          </div>
          <h1 className="font-serif text-4xl md:text-7xl text-white font-bold mb-6 drop-shadow-2xl">
            Sacred <span className="text-amber-400 underline decoration-amber-500/50 underline-offset-8">Confluences</span>
          </h1>
          <p className="text-orange-50/90 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Journey to the most spiritual points on Earth, where the veil between worlds is thinnest and prayers reach the heavens directly.
          </p>
          
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Waves className="h-4 w-4 text-amber-500" /> Sacred Waters
            </span>
            <span className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Sunrise className="h-4 w-4 text-amber-500" /> Eternal Peace
            </span>
            <span className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Sparkles className="h-4 w-4 text-amber-500" /> Moksha
            </span>
          </div>
        </div>
      </section>

      {/* Locations Listing */}
      <section className="py-20 md:py-32 container mx-auto px-4">
        <div className="flex flex-col gap-24 md:gap-40">
          {LOCATIONS.map((location, index) => (
            <div 
              key={location.id}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20`}
            >
              {/* Image Container */}
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute -inset-4 bg-orange-100/50 rounded-[2rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative aspect-[4/3] md:aspect-square rounded-[1.5rem] overflow-hidden shadow-2xl">
                  <Image 
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <p className="font-serif text-2xl font-bold">{location.name}</p>
                  </div>
                </div>
              </div>

              {/* Text Container */}
              <div className="w-full md:w-1/2 space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="h-[2px] w-12 bg-amber-600 rounded-full" />
                    <span className="text-amber-700 font-bold uppercase tracking-[0.2em] text-xs">Holy Site</span>
                  </div>
                  <h2 className="font-serif text-4xl md:text-6xl text-orange-950 font-bold tracking-tight">
                    {location.name}
                  </h2>
                  <p className="text-xl md:text-2xl text-amber-700/80 italic font-serif">
                    &ldquo;{location.title}&rdquo;
                  </p>
                </div>
                
                <p className="text-orange-900/80 text-lg leading-relaxed font-medium">
                  {location.longDescription}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link href={`/booking?location=${location.id}`} className="w-full sm:w-auto">
                    <Button className="w-full h-14 px-8 text-lg rounded-xl shadow-xl shadow-orange-900/10">
                      Book Ritual Here <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-orange-200 text-orange-950 hover:bg-orange-50">
                    Learn History
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-orange-950 py-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
          <Anchor className="absolute top-10 left-10 w-96 h-96 -rotate-12" />
          <Waves className="absolute bottom-10 right-10 w-96 h-96 rotate-12" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-5xl text-white font-bold mb-6">Can&apos;t travel in person?</h2>
          <p className="text-orange-200/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            We bridge the distance between you and these sacred lands. Experience authentic rituals performed by local Purohits, delivered right to your screen.
          </p>
          <Link href="/services">
            <Button variant="default" className="bg-amber-500 hover:bg-amber-600 text-orange-950 font-black h-16 px-12 text-xl rounded-2xl">
              Explore Our Virtual Services
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
