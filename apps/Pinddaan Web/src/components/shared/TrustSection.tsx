import { ShieldCheck, Video, HeartHandshake } from "lucide-react"

export default function TrustSection() {
  const indicators = [
    {
      icon: ShieldCheck,
      title: "Verified Teerth Purohits",
      desc: "Rituals performed strictly according to Shastras by learned local Pandits."
    },
    {
      icon: Video,
      title: "Full Video Proof",
      desc: "Receive a high-quality video recording or join via live Zoom."
    },
    {
      icon: HeartHandshake,
      title: "Compassionate Support",
      desc: "A dedicated coordinator to guide your family through the entire process respectfully."
    }
  ]

  return (
    <section className="py-12 bg-white/50 border-b border-orange-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {indicators.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-orange-950">{item.title}</h3>
              <p className="text-sm text-orange-900/70 max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
